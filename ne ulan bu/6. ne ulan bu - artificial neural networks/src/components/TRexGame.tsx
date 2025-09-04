import React, { useRef, useEffect, useState } from 'react'
import { NeuralNetwork, DEFAULT_ARCHITECTURE } from '../ai/NeuralNetwork'
import {
  saveCheckpoint,
  buildBestPayloadFromWeights,
} from '../managers/TrainingState'
import './TRexGame.css'
import {
  GAME_CONFIG,
  SPRITE_DEFINITION,
  TREX_CONFIG,
  TREX_COLLISION_BOXES,
  TREX_ANIM_FRAMES,
  HORIZON_CONFIG,
  CLOUD_CONFIG,
  OBSTACLE_TYPES,
  FPS,
  ENABLE_NOCLIP,
  T_REX_COUNT,
  TRex,
  Obstacle,
  ObstacleDefinition,
  TRexGameProps,
} from '../types'

// helper function from original code
const getRandomNum = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

// deterministic argmax action selection (GA exploration via diversity)
const argmax = (values: number[]): number => {
  let idx = 0
  let best = values[0]
  for (let i = 1; i < values.length; i++) {
    if (values[i] > best) {
      best = values[i]
      idx = i
    }
  }
  return idx
}

// width-height is just a ratio
const TRexGame: React.FC<TRexGameProps> = ({
  width = 600,
  height = 150,
  networkManager,
  onGenerationChange,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [gameState, setGameState] = useState<'waiting' | 'playing' | 'crashed'>(
    'waiting'
  )
  const [score, setScore] = useState(0)
  const [highScore, setHighScore] = useState(0)
  const [remainingCount, setRemainingCount] = useState<number>(T_REX_COUNT)
  const [autoRun, setAutoRun] = useState(false)
  const autoRunRef = useRef(false)
  useEffect(() => {
    autoRunRef.current = autoRun
  }, [autoRun])
  const animationFrameRef = useRef<number>(0)
  const spriteImageRef = useRef<HTMLImageElement | null>(null)
  const [spritesLoaded, setSpritesLoaded] = useState(false)

  // detect high DPI screens
  const isHiDPI = window.devicePixelRatio > 1
  const spriteDef = isHiDPI ? SPRITE_DEFINITION.HDPI : SPRITE_DEFINITION.LDPI

  // game state
  const gameDataRef = useRef({
    time: 0,
    runningTime: 0,
    currentSpeed: GAME_CONFIG.SPEED,
    distanceRan: 0,
    msPerFrame: 1000 / FPS,
    playing: false,
    crashed: false,
    activated: false,
    ctx: null as CanvasRenderingContext2D | null,
    // multiple t-rex state
    tRexes: [] as TRex[],
    // per-trex neural networks
    networks: [] as NeuralNetwork[],
    // per-trex fitness tracking and GA state
    fitness: [] as number[],
    generation: 0,
    bestFitness: 0,
    bestWeights: null as number[] | null,
    // obstacle system
    obstacles: [] as Obstacle[],
    obstacleHistory: [] as ObstacleDefinition['type'][],
    // horizon system
    horizon: {
      xPos: [0, HORIZON_CONFIG.WIDTH],
      yPos: HORIZON_CONFIG.YPOS,
      sourceXPos: [0, 0] as [number, number],
    },
    // cloud system
    clouds: [] as Array<{
      xPos: number
      yPos: number
      cloudGap: number
      remove: boolean
    }>,
  })

  useEffect(() => {
    // load sprite images
    loadImages()

    // cleanup on unmount
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [])

  useEffect(() => {
    if (canvasRef.current && spritesLoaded) {
      const canvas = canvasRef.current
      const ctx = canvas.getContext('2d')

      if (ctx) {
        gameDataRef.current.ctx = ctx
        initializeGame(ctx, canvas)
        console.log('game initialized with sprites')
      }
    }
  }, [spritesLoaded])

  // load persisted highScore from checkpoint
  useEffect(() => {
    ;(async () => {
      try {
        const res = await fetch('/training-checkpoint.json')

        if (res.ok) {
          const data = await res.json()

          if (typeof data?.highScore === 'number') {
            const hs = data.highScore as number
            setHighScore(prev => (hs > prev ? hs : prev))
          }
        }
      } catch {}
    })()
  }, [])

  // persist highScore immediately when it increases
  useEffect(() => {
    ;(async () => {
      try {
        const res = await fetch('/training-checkpoint.json')

        if (!res.ok) return

        const data = await res.json()
        const current = typeof data?.highScore === 'number' ? data.highScore : 0

        if (highScore > current) {
          data.highScore = highScore
          await fetch('/api/save-checkpoint', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
          })
        }
      } catch {}
    })()
  }, [highScore])

  const loadImages = () => {
    const spriteImage = new Image()
    const spritePath = isHiDPI
      ? '/assets/default_200_percent/200-offline-sprite.png'
      : '/assets/default_100_percent/100-offline-sprite.png'

    spriteImage.onload = () => {
      spriteImageRef.current = spriteImage
      setSpritesLoaded(true)
      console.log('sprites loaded:', spritePath)
    }

    spriteImage.onerror = () => {
      console.error('Failed to load sprites:', spritePath)
      // fallback - continue without sprites
      setSpritesLoaded(true)
    }

    spriteImage.src = spritePath
  }

  // GA: called when all t-rexes die
  const handleGenerationEnd = () => {
    const gameData = gameDataRef.current
    // rank by fitness
    const indices = gameData.fitness
      .map((f, i) => [f, i] as [number, number])
      .sort((a, b) => b[0] - a[0])
      .map(([_, i]) => i)

    const bestIdx = indices[0]
    const bestFitness = gameData.fitness[bestIdx]
    const bestWeights = gameData.networks[bestIdx].getWeights()

    // store best
    if (bestFitness > gameData.bestFitness) {
      gameData.bestFitness = bestFitness
      gameData.bestWeights = bestWeights
    }

    // update panel to reflect current best connections immediately
    if (networkManager && bestWeights) {
      try {
        networkManager.setNetworkFromFlatWeights(bestWeights)
      } catch {}
    }

    // produce next generation with tournament selection + crossover + mutation
    const populationSize = gameData.networks.length
    const parentsPool = buildParentsPool(
      gameData.networks,
      gameData.fitness,
      Math.max(2, Math.floor(populationSize / 4))
    )
    const nextNetworks: NeuralNetwork[] = []

    // elitism (clone the best)
    const elite = gameData.networks[bestIdx].clone()
    nextNetworks.push(elite)

    // diversity preservation: 10% random survivors (clone to preserve weights)
    const randomSurvivors = Math.floor(populationSize * 0.1)
    const shuffledIndices = Array.from(
      { length: populationSize },
      (_, i) => i
    ).sort(() => Math.random() - 0.5)
    for (
      let i = 0;
      i < randomSurvivors && nextNetworks.length < populationSize;
      i++
    ) {
      const randomIdx = shuffledIndices[i]
      if (randomIdx !== bestIdx) {
        const randomNet = gameData.networks[randomIdx].clone()
        nextNetworks.push(randomNet)
      }
    }

    // generate offspring
    while (nextNetworks.length < populationSize) {
      const p1 = parentsPool[Math.floor(Math.random() * parentsPool.length)]
      const p2 = parentsPool[Math.floor(Math.random() * parentsPool.length)]
      const w1 = p1.getWeights()
      const w2 = p2.getWeights()
      const childW = crossoverSinglePoint(w1, w2)
      const mutated = mutateWeights(childW, 0.05, 0.02)
      const child = new NeuralNetwork(DEFAULT_ARCHITECTURE)
      child.setWeights(mutated)
      nextNetworks.push(child)
    }

    // persist checkpoint (best + current population) — fire-and-forget
    try {
      const population = gameData.networks.map((net, idx) => ({
        id: idx + 1,
        weights: net.getWeights(),
      }))
      saveCheckpoint({
        generation: gameData.generation + 1,
        config: {
          populationSize: population.length,
          mutationRate: 0.1,
          crossoverRate: 0.7,
        },
        rngSeed: undefined,
        population,
        highScore,
      })

      if (gameData.bestWeights) {
        const bestPayload = buildBestPayloadFromWeights(gameData.bestWeights)

        // bestPayload includes arch/metadata; we could extend with fitness/gen here if needed
        fetch('/api/save-weights', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(bestPayload),
        }).catch(() => {})
      }
    } catch {}

    // reset game state for next generation
    gameData.networks = nextNetworks
    gameData.fitness = new Array(nextNetworks.length).fill(0)

    gameData.generation += 1
    if (onGenerationChange) {
      try {
        onGenerationChange(gameData.generation)
      } catch {}
    }

    // auto-restart
    handleRestart()
  }

  const buildParentsPool = (
    networks: NeuralNetwork[],
    fitness: number[],
    k = 3
  ): NeuralNetwork[] => {
    const pool: NeuralNetwork[] = []
    const n = networks.length

    for (let i = 0; i < n; i++) {
      // tournament selection of size k
      let bestIdx = Math.floor(Math.random() * n)

      for (let t = 1; t < k; t++) {
        const challenger = Math.floor(Math.random() * n)

        if (fitness[challenger] > fitness[bestIdx]) bestIdx = challenger
      }

      pool.push(networks[bestIdx])
    }

    return pool
  }

  const crossoverSinglePoint = (a: number[], b: number[]): number[] => {
    const len = Math.min(a.length, b.length)

    if (len === 0) return []

    const point = 1 + Math.floor(Math.random() * (len - 1))
    const child = a.slice(0, point).concat(b.slice(point))

    return child
  }

  // simple Gaussian mutation with probability per weight
  const mutateWeights = (
    weights: number[],
    mutationRate = 0.1,
    sigma = 0.02
  ): number[] => {
    const randn = () => {
      // Box-Muller
      let u = 0,
        v = 0
      while (u === 0) u = Math.random()
      while (v === 0) v = Math.random()
      return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v)
    }

    return weights.map(w =>
      Math.random() < mutationRate ? w + randn() * sigma : w
    )
  }

  const initializeGame = (
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement
  ) => {
    const gameData = gameDataRef.current

    // initialize t-rexes
    const groundYPos =
      canvas.height - GAME_CONFIG.BOTTOM_PAD - TREX_CONFIG.HEIGHT
    const minJumpHeight = groundYPos - TREX_CONFIG.MIN_JUMP_HEIGHT

    // ensure clean state to avoid accumulating t-rexes on re-init
    gameData.tRexes = []
    gameData.networks = []
    gameData.fitness = []

    for (let i = 0; i < T_REX_COUNT; i++) {
      gameData.tRexes.push({
        id: i + 1,
        xPos: TREX_CONFIG.START_X_POS,
        yPos: groundYPos,
        groundYPos: groundYPos,
        minJumpHeight: minJumpHeight,
        jumping: false,
        ducking: false,
        jumpVelocity: 0,
        reachedMinHeight: false,
        speedDrop: false,
        currentFrame: 0,
        timer: 0,
        msPerFrame: TREX_ANIM_FRAMES.WAITING.msPerFrame,
        currentAnimFrames: [...TREX_ANIM_FRAMES.WAITING.frames],
        status: 'WAITING',
        alive: true,
        lastLandTime: 0,
        duckUntilX: null,
      })

      // create a random network for each t-rex to produce diverse behavior
      gameData.networks.push(new NeuralNetwork(DEFAULT_ARCHITECTURE))
      gameData.fitness.push(0)
    }

    // try to seed from existing checkpoint (continue generation after refresh)
    ;(async () => {
      try {
        const res = await fetch('/training-checkpoint.json')

        if (res.ok) {
          const data = await res.json()

          if (typeof data?.generation === 'number') {
            gameData.generation = data.generation

            if (onGenerationChange) {
              try {
                onGenerationChange(gameData.generation)
              } catch {}
            }
          }

          const pop = Array.isArray(data?.population) ? data.population : []
          const n = Math.min(gameData.networks.length, pop.length)

          for (let i = 0; i < n; i++) {
            if (Array.isArray(pop[i]?.weights)) {
              try {
                gameData.networks[i].setWeights(pop[i].weights)
              } catch {}
            }
          }

          console.log(
            'seeded from checkpoint: gen',
            gameData.generation,
            'used',
            n,
            'nets'
          )
        }
      } catch (e) {
        // ignore; start fresh
      }
    })()

    initializeCanvas(ctx, canvas)
  }

  const initializeCanvas = (
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement
  ) => {
    // clear canvas
    ctx.fillStyle = '#f7f7f7'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // draw clouds background
    drawClouds(ctx)

    // draw horizon texture
    drawHorizon(ctx)

    // draw obstacles
    drawObstacles(ctx)

    // draw all t-rexes
    drawAllTRexes(ctx)
  }

  const drawClouds = (ctx: CanvasRenderingContext2D) => {
    const gameData = gameDataRef.current
    const spriteImage = spriteImageRef.current

    if (!spriteImage) {
      // fallback: draw simple rectangles for clouds
      ctx.fillStyle = '#c0c0c0'
      gameData.clouds.forEach(cloud => {
        if (!cloud.remove) {
          ctx.fillRect(
            cloud.xPos,
            cloud.yPos,
            CLOUD_CONFIG.WIDTH,
            CLOUD_CONFIG.HEIGHT
          )
        }
      })

      return
    }

    gameData.clouds.forEach(cloud => {
      if (!cloud.remove) {
        const sourceX = spriteDef.CLOUD.x
        const sourceY = spriteDef.CLOUD.y

        const spriteSourceWidth = isHiDPI
          ? CLOUD_CONFIG.WIDTH * 2
          : CLOUD_CONFIG.WIDTH
        const spriteSourceHeight = isHiDPI
          ? CLOUD_CONFIG.HEIGHT * 2
          : CLOUD_CONFIG.HEIGHT
        const spriteSourceX = isHiDPI ? sourceX * 2 : sourceX
        const spriteSourceY = isHiDPI ? sourceY * 2 : sourceY

        ctx.drawImage(
          spriteImage,
          spriteSourceX,
          spriteSourceY,
          spriteSourceWidth,
          spriteSourceHeight,
          cloud.xPos,
          cloud.yPos,
          CLOUD_CONFIG.WIDTH,
          CLOUD_CONFIG.HEIGHT
        )
      }
    })
  }

  const drawHorizon = (ctx: CanvasRenderingContext2D) => {
    const gameData = gameDataRef.current
    const spriteImage = spriteImageRef.current
    const horizon = gameData.horizon

    if (!spriteImage) {
      // fallback: simple ground line
      ctx.strokeStyle = '#535353'
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(0, HORIZON_CONFIG.YPOS)
      ctx.lineTo(width, HORIZON_CONFIG.YPOS)
      ctx.stroke()

      return
    }

    // draw horizon texture with sprite and bumps
    const baseSourceX = spriteDef.HORIZON.x
    const sourceY = spriteDef.HORIZON.y
    const sourceWidth = HORIZON_CONFIG.WIDTH
    const sourceHeight = HORIZON_CONFIG.HEIGHT

    // adjust for hi-dpi
    const spriteSourceWidth = isHiDPI ? sourceWidth * 2 : sourceWidth
    const spriteSourceHeight = isHiDPI ? sourceHeight * 2 : sourceHeight
    const spriteSourceY = isHiDPI ? sourceY * 2 : sourceY

    // draw two horizon segments for scrolling with bump variations
    for (let i = 0; i < 2; i++) {
      const spriteSourceX = isHiDPI
        ? (baseSourceX + horizon.sourceXPos[i]) * 2
        : baseSourceX + horizon.sourceXPos[i]

      ctx.drawImage(
        spriteImage,
        spriteSourceX,
        spriteSourceY,
        spriteSourceWidth,
        spriteSourceHeight,
        horizon.xPos[i],
        horizon.yPos,
        HORIZON_CONFIG.WIDTH,
        HORIZON_CONFIG.HEIGHT
      )
    }
  }

  const drawObstacles = (ctx: CanvasRenderingContext2D) => {
    const gameData = gameDataRef.current
    const spriteImage = spriteImageRef.current

    gameData.obstacles.forEach(obstacle => {
      if (!obstacle.remove) {
        if (!spriteImage) {
          // fallback: rectangle obstacles
          ctx.fillStyle = '#535353'
          ctx.fillRect(
            obstacle.xPos,
            obstacle.yPos,
            obstacle.width,
            obstacle.height
          )

          return
        }

        if (obstacle.type === 'PTERODACTYL') {
          const baseX = spriteDef.PTERODACTYL.x
          const baseY = spriteDef.PTERODACTYL.y
          const frameW = 46
          const frameH = 40
          const frame = obstacle.currentFrame || 0
          const sourceX = baseX + frameW * frame

          const sX = isHiDPI ? sourceX * 2 : sourceX
          const sY = isHiDPI ? baseY * 2 : baseY
          const sW = isHiDPI ? frameW * 2 : frameW
          const sH = isHiDPI ? frameH * 2 : frameH

          ctx.drawImage(
            spriteImage,
            sX,
            sY,
            sW,
            sH,
            obstacle.xPos,
            obstacle.yPos,
            frameW,
            frameH
          )
        } else {
          const isSmall = obstacle.type === 'CACTUS_SMALL'
          const unitWidth = isSmall ? 17 : 25
          const unitHeight = isSmall ? 35 : 50
          const size =
            (obstacle as Obstacle).size ||
            Math.max(1, Math.round(obstacle.width / unitWidth))

          const baseX = isSmall
            ? spriteDef.CACTUS_SMALL.x
            : spriteDef.CACTUS_LARGE.x
          const baseY = spriteDef.CACTUS_SMALL.y

          const sourceWidth = unitWidth
          const cropXOffset = sourceWidth * size * (0.5 * (size - 1))
          const sourceX = baseX + cropXOffset

          const sX = isHiDPI ? sourceX * 2 : sourceX
          const sY = isHiDPI ? baseY * 2 : baseY
          const sW = isHiDPI ? sourceWidth * size * 2 : sourceWidth * size
          const sH = isHiDPI ? unitHeight * 2 : unitHeight

          ctx.drawImage(
            spriteImage,
            sX,
            sY,
            sW,
            sH,
            obstacle.xPos,
            obstacle.yPos,
            unitWidth * size,
            unitHeight
          )
        }
      }
    })
  }

  const updateClouds = (deltaTime: number) => {
    const gameData = gameDataRef.current
    const canvas = canvasRef.current

    if (!canvas) return

    // proper cloud speed (much faster movement)
    const cloudSpeed = GAME_CONFIG.BG_CLOUD_SPEED * deltaTime * 0.5
    const numClouds = gameData.clouds.length

    // spawn first cloud immediately if none exist
    if (numClouds === 0) {
      addCloud(canvas)

      return
    }

    // update existing clouds
    gameData.clouds.forEach(cloud => {
      if (!cloud.remove) {
        cloud.xPos -= cloudSpeed

        // remove if off screen
        if (cloud.xPos + CLOUD_CONFIG.WIDTH < 0) {
          cloud.remove = true
        }
      }
    })

    // more frequent cloud spawning
    if (
      numClouds < GAME_CONFIG.MAX_CLOUDS &&
      Math.random() < 0.02 // 2% chance each frame (~1.2 clouds per second at 60fps)
    ) {
      const lastCloud = gameData.clouds[numClouds - 1]

      if (!lastCloud || canvas.width - lastCloud.xPos > 100) {
        addCloud(canvas)
      }
    }

    // remove expired clouds
    gameData.clouds = gameData.clouds.filter(cloud => !cloud.remove)
  }

  const addCloud = (canvas: HTMLCanvasElement) => {
    const gameData = gameDataRef.current
    const newCloud = {
      xPos: canvas.width,
      yPos: getRandomNum(
        CLOUD_CONFIG.MAX_SKY_LEVEL,
        CLOUD_CONFIG.MIN_SKY_LEVEL
      ),
      cloudGap: getRandomNum(
        CLOUD_CONFIG.MIN_CLOUD_GAP,
        CLOUD_CONFIG.MAX_CLOUD_GAP
      ),
      remove: false,
    }
    gameData.clouds.push(newCloud)
  }

  const getRandomType = (): number => {
    return Math.random() > HORIZON_CONFIG.BUMP_THRESHOLD
      ? HORIZON_CONFIG.WIDTH
      : 0
  }

  const updateHorizon = (deltaTime: number) => {
    const gameData = gameDataRef.current
    const horizon = gameData.horizon
    const increment = Math.floor(
      gameData.currentSpeed * (FPS / 1000) * deltaTime
    )

    // update horizon positions for scrolling
    if (horizon.xPos[0] <= 0) {
      horizon.xPos[0] -= increment
      horizon.xPos[1] = horizon.xPos[0] + HORIZON_CONFIG.WIDTH

      if (horizon.xPos[0] <= -HORIZON_CONFIG.WIDTH) {
        horizon.xPos[0] += HORIZON_CONFIG.WIDTH * 2
        horizon.xPos[1] = horizon.xPos[0] - HORIZON_CONFIG.WIDTH
        // add bump variation when resetting
        horizon.sourceXPos[0] = getRandomType()
      }
    } else {
      horizon.xPos[1] -= increment
      horizon.xPos[0] = horizon.xPos[1] + HORIZON_CONFIG.WIDTH

      if (horizon.xPos[1] <= -HORIZON_CONFIG.WIDTH) {
        horizon.xPos[1] += HORIZON_CONFIG.WIDTH * 2
        horizon.xPos[0] = horizon.xPos[1] - HORIZON_CONFIG.WIDTH

        // add bump variation when resetting
        horizon.sourceXPos[1] = getRandomType()
      }
    }
  }

  const updateAllTRexes = (deltaTime: number) => {
    const gameData = gameDataRef.current

    // update only alive t-rexes
    gameData.tRexes.forEach(tRex => {
      if (!tRex.alive) return

      tRex.timer += deltaTime

      // no timed duck release; policy controls duck on/off

      // update animation frame
      if (tRex.timer >= tRex.msPerFrame) {
        tRex.currentFrame =
          tRex.currentFrame === tRex.currentAnimFrames.length - 1
            ? 0
            : tRex.currentFrame + 1
        tRex.timer = 0
      }

      // handle jumping physics
      if (tRex.jumping) {
        updateTRexJump(tRex, deltaTime)
      }
    })
  }

  const updateTRexJump = (tRex: TRex, deltaTime: number) => {
    const framesElapsed = deltaTime / tRex.msPerFrame

    // apply jump velocity
    tRex.yPos += Math.round(tRex.jumpVelocity * framesElapsed)
    tRex.jumpVelocity += TREX_CONFIG.GRAVITY * framesElapsed

    // check if reached minimum height
    if (tRex.yPos < tRex.minJumpHeight || tRex.speedDrop) {
      tRex.reachedMinHeight = true
    }

    // check if reached max height
    if (tRex.yPos < TREX_CONFIG.MAX_JUMP_HEIGHT || tRex.speedDrop) {
      endTRexJump(tRex)
    }

    // back down at ground level - jump completed
    if (tRex.yPos >= tRex.groundYPos) {
      tRex.yPos = tRex.groundYPos
      tRex.jumping = false
      tRex.jumpVelocity = 0
      tRex.reachedMinHeight = false
      tRex.speedDrop = false
      tRex.lastLandTime = getTimeStamp()

      updateTRexStatus(tRex, 'RUNNING')
    }
  }

  const startTRexJump = (tRex: TRex) => {
    const gameData = gameDataRef.current

    if (!tRex.jumping && !tRex.ducking) {
      updateTRexStatus(tRex, 'JUMPING')
      tRex.jumpVelocity =
        TREX_CONFIG.INIITAL_JUMP_VELOCITY - gameData.currentSpeed / 10
      tRex.jumping = true
      tRex.reachedMinHeight = false
      tRex.speedDrop = false
    }
  }

  const endTRexJump = (tRex: TRex) => {
    if (
      tRex.reachedMinHeight &&
      tRex.jumpVelocity < TREX_CONFIG.DROP_VELOCITY
    ) {
      tRex.jumpVelocity = TREX_CONFIG.DROP_VELOCITY
    }
  }

  const updateTRexStatus = (
    tRex: TRex,
    status: 'WAITING' | 'RUNNING' | 'JUMPING' | 'DUCKING' | 'CRASHED'
  ) => {
    if (tRex.status !== status) {
      tRex.status = status
      tRex.currentFrame = 0
      tRex.msPerFrame = TREX_ANIM_FRAMES[status].msPerFrame
      tRex.currentAnimFrames = [...TREX_ANIM_FRAMES[status].frames]
    }
  }

  const drawAllTRexes = (ctx: CanvasRenderingContext2D) => {
    const gameData = gameDataRef.current
    const spriteImage = spriteImageRef.current

    // draw only alive t-rexes
    gameData.tRexes.forEach(tRex => {
      if (!tRex.alive) return

      if (!spriteImage) {
        // fallback to rectangle if no sprite
        ctx.fillStyle = '#535353'
        ctx.fillRect(
          tRex.xPos,
          tRex.yPos,
          TREX_CONFIG.WIDTH,
          TREX_CONFIG.HEIGHT
        )
        return
      }

      // get current animation frame
      const frameX = tRex.currentAnimFrames[tRex.currentFrame]
      const sourceX = spriteDef.TREX.x + frameX
      // ducking ve running frame'ler aynı Y koordinatında (source code ile uyumlu)
      const sourceY = spriteDef.TREX.y

      // ducking state uses different sizes
      const sourceWidth = tRex.ducking
        ? TREX_CONFIG.WIDTH_DUCK
        : TREX_CONFIG.WIDTH
      const sourceHeight = TREX_CONFIG.HEIGHT

      // adjust for hi-dpi
      const spriteSourceWidth = isHiDPI ? sourceWidth * 2 : sourceWidth
      const spriteSourceHeight = isHiDPI ? sourceHeight * 2 : sourceHeight
      const spriteSourceX = isHiDPI ? sourceX * 2 : sourceX
      const spriteSourceY = isHiDPI ? sourceY * 2 : sourceY

      // draw the sprite - ducking state uses different sizes
      if (tRex.ducking) {
        ctx.drawImage(
          spriteImage,
          spriteSourceX,
          spriteSourceY,
          spriteSourceWidth,
          spriteSourceHeight,
          tRex.xPos,
          tRex.yPos,
          TREX_CONFIG.WIDTH_DUCK,
          TREX_CONFIG.HEIGHT
        )
      } else {
        ctx.drawImage(
          spriteImage,
          spriteSourceX,
          spriteSourceY,
          spriteSourceWidth,
          spriteSourceHeight,
          tRex.xPos,
          tRex.yPos,
          TREX_CONFIG.WIDTH,
          TREX_CONFIG.HEIGHT
        )
      }
    })
  }

  const getTimeStamp = (): number => {
    return performance.now()
  }

  const clearCanvas = () => {
    const ctx = gameDataRef.current.ctx
    if (ctx) {
      ctx.clearRect(0, 0, width, height)
    }
  }

  const update = () => {
    const gameData = gameDataRef.current

    const now = getTimeStamp()
    const deltaTime = now - (gameData.time || now)
    gameData.time = now

    if (gameData.playing) {
      clearCanvas()

      // game logic
      gameData.runningTime += deltaTime
      gameData.distanceRan +=
        (gameData.currentSpeed * deltaTime) / gameData.msPerFrame

      // update speed
      if (gameData.currentSpeed < GAME_CONFIG.MAX_SPEED) {
        gameData.currentSpeed += GAME_CONFIG.ACCELERATION
      }

      // compute global closest obstacle once per frame (all t-rex share xPos)
      let globalClosest: Obstacle | null = null
      let globalMinDist = Infinity
      for (const ob of gameData.obstacles) {
        if (!ob.remove && ob.xPos > TREX_CONFIG.START_X_POS) {
          const d = ob.xPos - TREX_CONFIG.START_X_POS
          if (d < globalMinDist) {
            globalMinDist = d
            globalClosest = ob
          }
        }
      }

      // per-t-rex network control
      if (
        gameData.tRexes.length > 0 &&
        gameData.networks.length === gameData.tRexes.length
      ) {
        for (let i = 0; i < gameData.tRexes.length; i++) {
          const trex = gameData.tRexes[i]
          if (!trex.alive) continue
          const gameInputs = getGameInputsForNN(trex, {
            closestObstacle: globalClosest,
            minDistance: globalMinDist,
          })

          // use each t-rex's own network to decide
          const outputs = gameData.networks[i].predict([
            gameInputs.obstacleDistance,
            gameInputs.obstacleHeight,
            gameInputs.dinoYVelocity,
            gameInputs.gameSpeed,
            gameInputs.isOnGround,
            gameInputs.timeToImpact,
            gameInputs.obstaclePresent,
            gameInputs.isPtero,
            gameInputs.pteroRelHeight,
            gameInputs.invDistance,
            gameInputs.dDistance,
            gameInputs.enhancedDuckSignal,
          ])

          // deterministic action selection with duck buffing
          let actionIdx = argmax(outputs)

          // force duck when pterodactyl is low and close
          if (globalClosest && globalClosest.type === 'PTERODACTYL') {
            const pteroBottom = globalClosest.yPos + globalClosest.height
            const tRexDuckTop = trex.groundYPos - TREX_CONFIG.HEIGHT_DUCK
            const isClose = globalMinDist < 80

            if (pteroBottom > tRexDuckTop && isClose) {
              // force duck by boosting duck output
              outputs[1] += 0.5 // boost duck signal
              actionIdx = argmax(outputs)
            }
          }

          // smart action selection with duck lock logic
          if (actionIdx === 0 && !trex.jumping && !trex.ducking) {
            startTRexJump(trex)
          } else if (actionIdx === 1 && !trex.jumping) {
            // start ducking - set obstacle pass point using global closest
            const closestObstacle = globalClosest
            if (closestObstacle) {
              trex.ducking = true
              trex.duckUntilX =
                closestObstacle.xPos + closestObstacle.width + 50 // increased safety margin
              updateTRexStatus(trex, 'DUCKING')
            }
          } else if (actionIdx === 1 && trex.ducking) {
            // if already ducking and network wants to duck, extend duck duration
            if (globalClosest && globalClosest.type === 'PTERODACTYL') {
              const pteroBottom = globalClosest.yPos + globalClosest.height
              const tRexDuckTop = trex.groundYPos - TREX_CONFIG.HEIGHT_DUCK
              if (pteroBottom > tRexDuckTop) {
                // extend duck until pterodactyl is passed
                trex.duckUntilX = Math.max(
                  trex.duckUntilX || 0,
                  globalClosest.xPos + globalClosest.width + 50
                )
              }
            }
          } else if (actionIdx === 2 && !trex.jumping) {
            // try to release duck - check if obstacle is passed
            if (trex.ducking) {
              // check if we've passed the duck target point
              if (trex.duckUntilX && trex.xPos > trex.duckUntilX) {
                trex.ducking = false
                trex.duckUntilX = null
                updateTRexStatus(trex, 'RUNNING')
              }
              // also release duck if no obstacle is close
              else if (!globalClosest || globalMinDist > 150) {
                trex.ducking = false
                trex.duckUntilX = null
                updateTRexStatus(trex, 'RUNNING')
              }
            }
          }

          // keep panel visualization alive by feeding first t-rex inputs
          if (i === 0 && networkManager) {
            networkManager.processGameInputs({
              obstacleDistance: gameInputs.obstacleDistance,
              obstacleHeight: gameInputs.obstacleHeight,
              dinoYVelocity: gameInputs.dinoYVelocity,
              gameSpeed: gameInputs.gameSpeed,
              isOnGround: gameInputs.isOnGround,
              timeToImpact: gameInputs.timeToImpact,
              obstaclePresent: gameInputs.obstaclePresent,
              isPtero: gameInputs.isPtero,
              pteroRelHeight: gameInputs.pteroRelHeight,
              invDistance: gameInputs.invDistance,
              dDistance: gameInputs.dDistance,
              enhancedDuckSignal: gameInputs.enhancedDuckSignal,
            })
          }

          // base survival reward (time-based)
          gameData.fitness[i] += deltaTime * 0.1

          // get closest obstacle info
          const closest = globalClosest
          const minDist = Number.isFinite(globalMinDist)
            ? globalMinDist
            : Infinity

          if (closest) {
            // obstacle present - evaluate action
            const isClose = minDist < 100 // Close enough to matter

            if (isClose) {
              // determine correct action based on obstacle type and timing
              let correctAction = 2 // Default: run (safe choice)

              if (closest.type === 'PTERODACTYL') {
                // for pterodactyls: duck if low, jump if high
                const pteroBottom = closest.yPos + closest.height
                const tRexDuckTop = trex.groundYPos - TREX_CONFIG.HEIGHT_DUCK
                correctAction = pteroBottom > tRexDuckTop ? 1 : 0 // duck if ptero is low
              } else if (closest.type.includes('CACTUS')) {
                // for cacti: only jump if very close (timing matters)
                const timeToImpact =
                  minDist / ((gameData.currentSpeed * FPS) / 1000)
                if (timeToImpact < 0.3) {
                  // only jump when very close
                  correctAction = 0 // jump
                }
                // otherwise stay running (correctAction = 2)
              }

              // reward correct action, penalize wrong action
              if (actionIdx === correctAction) {
                if (correctAction === 1 && closest.type === 'PTERODACTYL') {
                  gameData.fitness[i] += 100 // massive reward for correct ducking
                } else {
                  gameData.fitness[i] += 20 // normal reward for other actions
                }
              } else {
                if (
                  correctAction === 1 &&
                  actionIdx !== 1 &&
                  closest.type === 'PTERODACTYL'
                ) {
                  gameData.fitness[i] -= 50 // heavy penalty for not ducking when should
                } else {
                  gameData.fitness[i] -= 15 // normal penalty
                }
              }
            } else {
              // far from obstacle - penalize unnecessary actions
              if (actionIdx === 0) {
                // jump
                gameData.fitness[i] -= 15 // heavy penalty for unnecessary jump
              } else if (actionIdx === 1) {
                // duck
                gameData.fitness[i] -= 2 // unnecessary duck
              }
              // running (actionIdx === 2) gets no penalty
            }
          } else {
            // no obstacle - reward running, penalize unnecessary actions
            if (actionIdx === 2) {
              // run
              gameData.fitness[i] += 3 // good - keep running
            } else if (actionIdx === 0) {
              // jump
              gameData.fitness[i] -= 20 // heavy penalty for unnecessary jump
            } else if (actionIdx === 1) {
              // duck
              gameData.fitness[i] -= 5 // unnecessary duck
            }
          }

          // obstacle pass reward (once per obstacle)
          for (const ob of gameData.obstacles) {
            if (ob.remove) continue
            const passed = ob.xPos + ob.width < trex.xPos
            if (passed) {
              const o = ob as Obstacle
              o.rewardedBy = o.rewardedBy || {}
              if (!o.rewardedBy[trex.id]) {
                gameData.fitness[i] += 30 // successfully passed obstacle
                o.rewardedBy[trex.id] = true
              }
            }
          }

          // speed bonus (surviving at higher speeds is harder)
          const speedBonus = (gameData.currentSpeed / GAME_CONFIG.MAX_SPEED) * 2
          gameData.fitness[i] += speedBonus
        }
      }

      // update clouds
      updateClouds(deltaTime)

      // update horizon scrolling
      updateHorizon(deltaTime)

      // update all t-rexes
      updateAllTRexes(deltaTime)

      // update obstacles
      updateObstacles(deltaTime)

      // check for collisions (only after clear time)
      if (gameData.runningTime > GAME_CONFIG.CLEAR_TIME) {
        checkCollisions()
      }

      // update score and hi-score
      const newScore = Math.ceil(gameData.distanceRan * 0.025)
      setScore(newScore)
      setHighScore(prev => (newScore > prev ? newScore : prev))

      // update remaining count
      const aliveCount = gameData.tRexes.filter(tRex => tRex.alive).length
      setRemainingCount(aliveCount)

      // check if all t-rexes are dead (generation end)
      if (aliveCount === 0) {
        // draw final frame before stopping
        if (gameData.ctx && canvasRef.current) {
          initializeCanvas(gameData.ctx, canvasRef.current)
        }

        gameData.playing = false
        gameData.crashed = true
        setGameState('crashed')
        console.log('All t-rexes died! Generation end')
        handleGenerationEnd()

        if (autoRunRef.current) {
          // auto start next round after generation handling
          setTimeout(() => {
            if (autoRunRef.current) handleStart()
          }, 0)
        }

        return
      }

      // redraw canvas
      if (gameData.ctx && canvasRef.current) {
        initializeCanvas(gameData.ctx, canvasRef.current)
      }
    }

    if (gameData.playing && !gameData.crashed) {
      animationFrameRef.current = requestAnimationFrame(update)
    }
  }

  const updateObstacles = (deltaTime: number) => {
    const gameData = gameDataRef.current

    // logic: after CLEAR_TIME, maintain obstacles via history and spacing
    if (gameData.runningTime > GAME_CONFIG.CLEAR_TIME) {
      const canvas = canvasRef.current

      if (!canvas) return

      if (gameData.obstacles.length === 0) {
        const newObs = createNewObstacle(canvas.width)

        if (newObs) gameData.obstacles.push(newObs)
      } else {
        const last = gameData.obstacles[gameData.obstacles.length - 1]

        if (
          last &&
          !last.followingObstacleCreated &&
          last.xPos + last.width + (last.gap || 0) < canvas.width
        ) {
          const next = createNewObstacle(canvas.width)

          if (next) {
            gameData.obstacles.push(next)
            last.followingObstacleCreated = true
          }
        }
      }
    }

    // update obstacle positions and animations
    gameData.obstacles.forEach(obstacle => {
      if (!obstacle.remove) {
        const effectiveSpeed =
          gameData.currentSpeed + (obstacle.speedOffset || 0)
        obstacle.xPos -= Math.floor(((effectiveSpeed * FPS) / 1000) * deltaTime)

        if (
          obstacle.type === 'PTERODACTYL' &&
          obstacle.numFrames &&
          obstacle.frameRate
        ) {
          obstacle.timer = (obstacle.timer || 0) + deltaTime
          if (obstacle.timer >= obstacle.frameRate) {
            obstacle.currentFrame =
              ((obstacle.currentFrame || 0) + 1) % (obstacle.numFrames || 1)
            obstacle.timer = 0
          }
        }

        // remove if off screen
        if (obstacle.xPos + obstacle.width < 0) {
          obstacle.remove = true
        }
      }
    })

    // clean up removed obstacles
    gameData.obstacles = gameData.obstacles.filter(obstacle => !obstacle.remove)
  }

  const createNewObstacle = (spawnX: number): Obstacle | null => {
    const gameData = gameDataRef.current
    // pick a type that meets minSpeed and duplication rules
    let chosen: ObstacleDefinition | null = null

    for (let attempts = 0; attempts < 10 && !chosen; attempts++) {
      const candidate =
        OBSTACLE_TYPES[Math.floor(Math.random() * OBSTACLE_TYPES.length)]
      const minSpeedOK = gameData.currentSpeed >= (candidate.minSpeed || 0)
      // prevent more than MAX_OBSTACLE_DUPLICATION of the same type in a row
      const recent = gameData.obstacleHistory.slice(
        0,
        GAME_CONFIG.MAX_OBSTACLE_DUPLICATION - 1
      )
      const duplicateOK = !(
        recent.length === GAME_CONFIG.MAX_OBSTACLE_DUPLICATION - 1 &&
        recent.every(t => t === candidate.type)
      )

      if (minSpeedOK && duplicateOK) chosen = candidate
    }
    if (!chosen) return null

    // y position selection for pterodactyl
    let yPos = 0

    if (Array.isArray(chosen.yPos)) {
      yPos = chosen.yPos[Math.floor(Math.random() * chosen.yPos.length)]
    } else {
      yPos = chosen.yPos
    }

    // decide obstacle size (1..MAX_OBSTACLE_LENGTH)
    let size = getRandomNum(1, GAME_CONFIG.MAX_OBSTACLE_LENGTH)

    if (
      size > 1 &&
      chosen.multipleSpeed != null &&
      gameData.currentSpeed < chosen.multipleSpeed
    ) {
      size = 1
    }

    const gap = getRandomNum(
      Math.round(
        chosen.width * size * gameData.currentSpeed +
          chosen.minGap * GAME_CONFIG.GAP_COEFFICIENT
      ),
      Math.round(
        Math.round(
          chosen.width * size * gameData.currentSpeed +
            chosen.minGap * GAME_CONFIG.GAP_COEFFICIENT
        ) * 1.5
      )
    )

    const obstacle: Obstacle = {
      xPos: spawnX,
      yPos,
      width: chosen.width * size,
      height: chosen.height,
      type: chosen.type,
      remove: false,
      collisionBoxes: [...chosen.collisionBoxes],
      currentFrame: 0,
      timer: 0,
      numFrames: chosen.numFrames,
      frameRate: chosen.frameRate,
      speedOffset:
        chosen.speedOffset != null
          ? Math.random() > 0.5
            ? chosen.speedOffset
            : -chosen.speedOffset
          : 0,
      gap,
      followingObstacleCreated: false,
      size,
    }

    // adjust collision boxes for multiples
    if (size > 1 && obstacle.collisionBoxes.length >= 3) {
      const left = obstacle.collisionBoxes[0]
      const middle = obstacle.collisionBoxes[1]
      const right = obstacle.collisionBoxes[2]
      middle.width = obstacle.width - left.width - right.width
      right.x = obstacle.width - right.width
      obstacle.collisionBoxes[1] = { ...middle }
      obstacle.collisionBoxes[2] = { ...right }
    }

    gameData.obstacleHistory.unshift(chosen.type)

    if (gameData.obstacleHistory.length > 3) {
      gameData.obstacleHistory.splice(3)
    }

    return obstacle
  }

  const checkCollisions = () => {
    const gameData = gameDataRef.current

    // check collision with first obstacle only
    if (gameData.obstacles.length > 0 && !gameData.obstacles[0].remove) {
      const obstacle = gameData.obstacles[0]

      // check each alive t-rex for collision
      gameData.tRexes.forEach(tRex => {
        if (!tRex.alive) return
        if (ENABLE_NOCLIP) return

        // create collision boxes with 1 pixel border adjustment
        // use correct height based on ducking state
        const tRexHeight = tRex.ducking
          ? TREX_CONFIG.HEIGHT_DUCK
          : TREX_CONFIG.HEIGHT
        const tRexBox = {
          x: tRex.xPos + 1,
          y: tRex.yPos + 1,
          width: TREX_CONFIG.WIDTH - 2,
          height: tRexHeight - 2,
        }

        const obstacleBox = {
          x: obstacle.xPos + 1,
          y: obstacle.yPos + 1,
          width: obstacle.width - 2,
          height: obstacle.height - 2,
        }

        // first do a simple outer bounds check
        if (
          tRexBox.x < obstacleBox.x + obstacleBox.width &&
          tRexBox.x + tRexBox.width > obstacleBox.x &&
          tRexBox.y < obstacleBox.y + obstacleBox.height &&
          tRexBox.y + tRexBox.height > obstacleBox.y
        ) {
          // get appropriate T-Rex collision boxes
          const tRexCollisionBoxes = tRex.ducking
            ? TREX_COLLISION_BOXES.DUCKING
            : TREX_COLLISION_BOXES.RUNNING // JUMPING uses same collision boxes as RUNNING

          // detailed collision check with multiple smaller boxes
          for (const tRexBox of tRexCollisionBoxes) {
            for (const obstBox of obstacle.collisionBoxes) {
              // adjust collision boxes to actual positions
              const adjTRexBox = {
                x: tRex.xPos + tRexBox.x,
                y: tRex.yPos + tRexBox.y,
                width: tRexBox.width,
                height: tRexBox.height,
              }

              const adjObstacleBox = {
                x: obstacle.xPos + obstBox.x,
                y: obstacle.yPos + obstBox.y,
                width: obstBox.width,
                height: obstBox.height,
              }

              // check if these specific boxes overlap
              if (
                adjTRexBox.x < adjObstacleBox.x + adjObstacleBox.width &&
                adjTRexBox.x + adjTRexBox.width > adjObstacleBox.x &&
                adjTRexBox.y < adjObstacleBox.y + adjObstacleBox.height &&
                adjTRexBox.y + adjTRexBox.height > adjObstacleBox.y
              ) {
                // kill this t-rex
                tRex.alive = false

                return
              }
            }
          }
        }
      })
    }
  }

  const scheduleNextUpdate = () => {
    animationFrameRef.current = requestAnimationFrame(update)
  }

  const getGameInputsForNN = (
    tRex: TRex,
    shared?: { closestObstacle: Obstacle | null; minDistance: number }
  ) => {
    const gameData = gameDataRef.current

    // use shared closest if provided, else compute
    let closestObstacle = shared?.closestObstacle || null
    let minDistance =
      shared && Number.isFinite(shared.minDistance)
        ? shared.minDistance
        : Infinity

    if (!closestObstacle) {
      for (const obstacle of gameData.obstacles) {
        if (obstacle.xPos > tRex.xPos) {
          const distance = obstacle.xPos - tRex.xPos

          if (distance < minDistance) {
            minDistance = distance
            closestObstacle = obstacle
          }
        }
      }
    }

    // base normalized inputs (near=1, far/no obstacle=0)
    const obstacleDistance = closestObstacle
      ? 1 - Math.min(minDistance / 300, 1)
      : 0
    // inverse-like distance consistent with near semantics
    const invDistance = closestObstacle ? 1 - Math.min(minDistance / 300, 1) : 0

    // calculate t-rex height based on current state (used for multiple calculations)
    const tRexHeight = tRex.ducking
      ? TREX_CONFIG.HEIGHT_DUCK
      : TREX_CONFIG.HEIGHT

    // calculate obstacle height relative to t-rex's current state
    const obstacleHeight = closestObstacle
      ? Math.min(closestObstacle.height / tRexHeight, 1)
      : 0
    const gameSpeed = gameData.currentSpeed / GAME_CONFIG.MAX_SPEED
    const dinoYVelocity = (tRex.jumpVelocity + 20) / 40
    const isOnGround = tRex.yPos >= tRex.groundYPos ? 1 : 0

    // derived inputs
    // time to impact (seconds) using px/s = currentSpeed * FPS
    const pxPerSecond = gameData.currentSpeed * FPS
    const timeToImpact = closestObstacle
      ? Math.min(minDistance / Math.max(pxPerSecond, 1e-3), 1)
      : 1
    const obstaclePresent = closestObstacle && minDistance < 100 ? 1 : 0
    const isPtero =
      closestObstacle && closestObstacle.type === 'PTERODACTYL' ? 1 : 0
    // calculate ptero relative height considering t-rex's current state
    // normalize to [0, 1] range: y=100 (ground) = 0, y=50 (highest) = 1
    const pteroRelHeight = isPtero
      ? Math.max(
          0,
          Math.min(
            (tRex.groundYPos - closestObstacle!.yPos) / (tRex.groundYPos - 50),
            1
          )
        )
      : 0

    // enhanced duck signal: only when low pterodactyl is close
    let enhancedDuckSignal = 0
    if (isPtero) {
      const pteroBottom = closestObstacle!.yPos + closestObstacle!.height
      const tRexDuckTop = tRex.groundYPos - TREX_CONFIG.HEIGHT_DUCK
      const isLow = pteroBottom > tRexDuckTop
      const isClose = minDistance < 120
      enhancedDuckSignal = isLow && isClose ? 1 : 0
    }

    // simple distance delta
    const stateKey = getGameInputsForNN as any
    stateKey._prevDist =
      typeof stateKey._prevDist === 'number' ? stateKey._prevDist : minDistance
    const prev = stateKey._prevDist as number
    // change in distance per second (px/s), normalized to [-1, 1]
    // >0 when approaching
    const deltaPerFrame = prev - minDistance // >0 when approaching
    const deltaPerSecond = deltaPerFrame * FPS
    const dDistance = closestObstacle
      ? Math.max(-1, Math.min(1, deltaPerSecond / 600)) // 600 px/s ≈ 1.0
      : 0
    stateKey._prevDist = closestObstacle ? minDistance : Infinity

    return {
      obstacleDistance,
      obstacleHeight,
      dinoYVelocity,
      gameSpeed,
      isOnGround,
      timeToImpact,
      obstaclePresent,
      isPtero,
      pteroRelHeight,
      invDistance,
      dDistance,
      enhancedDuckSignal,
    }
  }

  const handleStart = () => {
    console.log('game started')
    setGameState('playing')

    const gameData = gameDataRef.current
    gameData.playing = true
    gameData.crashed = false
    gameData.activated = true
    gameData.time = getTimeStamp()

    // start all t-rexes running
    gameData.tRexes.forEach(tRex => {
      updateTRexStatus(tRex, 'RUNNING')
    })

    scheduleNextUpdate()
  }

  const handleRestart = () => {
    console.log('game restarted/killed')
    setGameState('waiting')
    setScore(0)
    setRemainingCount(T_REX_COUNT)

    const gameData = gameDataRef.current
    gameData.playing = false
    gameData.crashed = false
    gameData.activated = false
    gameData.runningTime = 0
    gameData.distanceRan = 0
    gameData.currentSpeed = GAME_CONFIG.SPEED
    gameData.time = 0
    gameData.obstacles = []
    gameData.clouds = []

    // reset horizon
    gameData.horizon.xPos = [0, HORIZON_CONFIG.WIDTH]
    gameData.horizon.sourceXPos = [0, 0]

    // reset all t-rexes
    gameData.tRexes.forEach(tRex => {
      tRex.yPos = tRex.groundYPos
      tRex.jumping = false
      tRex.ducking = false
      tRex.duckUntilX = null
      tRex.jumpVelocity = 0
      tRex.currentFrame = 0
      tRex.timer = 0
      tRex.alive = true

      updateTRexStatus(tRex, 'WAITING')
      console.log(
        `T-Rex ${tRex.id} reset - ducking: ${tRex.ducking}, status: ${tRex.status}`
      )
    })

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
    }

    // redraw initial state
    if (gameData.ctx && canvasRef.current) {
      initializeCanvas(gameData.ctx, canvasRef.current)
    }
  }

  return (
    <div className="trex-game">
      <div className="game-controls">
        <button
          onClick={handleStart}
          disabled={gameState === 'playing' || gameState === 'crashed'}
          className="control-btn start-btn"
        >
          start
        </button>
        <button
          onClick={handleRestart}
          disabled={gameState === 'waiting'}
          className="control-btn restart-btn"
        >
          restart/kill
        </button>
        <button onClick={() => setAutoRun(v => !v)} className="control-btn">
          auto-run: {autoRun ? 'on' : 'off'}
        </button>
      </div>

      <div className="game-info">
        <span className="score">
          score: {score} | hi-score: {highScore}
        </span>
        <span className="status">status: {gameState}</span>
        <span className="remaining-count">remaining: {remainingCount}</span>
      </div>

      <div className="game-canvas-container">
        <canvas
          ref={canvasRef}
          width={width}
          height={height}
          className="game-canvas"
        />
      </div>
    </div>
  )
}

export default TRexGame
