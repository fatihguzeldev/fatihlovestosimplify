import { NeuralNetworkManager } from '../managers/NeuralNetworkManager'

export interface TRexGameProps {
  width?: number
  height?: number
  networkManager?: NeuralNetworkManager
  onGenerationChange?: (generation: number) => void
}

export interface CollisionBox {
  x: number
  y: number
  width: number
  height: number
}

export interface ObstacleDefinition {
  type: 'CACTUS_SMALL' | 'CACTUS_LARGE' | 'PTERODACTYL'
  width: number
  height: number
  yPos: number | number[]
  minGap: number
  minSpeed: number
  collisionBoxes: CollisionBox[]
  multipleSpeed?: number
  numFrames?: number
  frameRate?: number
  speedOffset?: number
}

export interface Obstacle {
  xPos: number
  yPos: number
  width: number
  height: number
  type: ObstacleDefinition['type']
  remove: boolean
  collisionBoxes: CollisionBox[]
  currentFrame?: number
  timer?: number
  numFrames?: number
  frameRate?: number
  speedOffset?: number
  gap?: number
  followingObstacleCreated?: boolean
  size?: number
  // runtime helper for fitness rewards
  rewardedBy?: Record<number, boolean>
}

export interface TRex {
  id: number
  xPos: number
  yPos: number
  groundYPos: number
  minJumpHeight: number
  jumping: boolean
  ducking: boolean
  jumpVelocity: number
  reachedMinHeight: boolean
  speedDrop: boolean
  currentFrame: number
  timer: number
  msPerFrame: number
  currentAnimFrames: number[]
  status: 'WAITING' | 'RUNNING' | 'JUMPING' | 'DUCKING' | 'CRASHED'
  alive: boolean
  lastLandTime: number
  duckUntilX: number | null
}

// constants (readonly)
export const FPS = 60 as const
export const ENABLE_NOCLIP = false as const
export const T_REX_COUNT = 200 as const

export const GAME_CONFIG = {
  ACCELERATION: 0.001,
  BG_CLOUD_SPEED: 0.2,
  BOTTOM_PAD: 10,
  CLEAR_TIME: 3000,
  CLOUD_FREQUENCY: 0.5,
  GAMEOVER_CLEAR_TIME: 750,
  GAP_COEFFICIENT: 0.6,
  GRAVITY: 0.6,
  INITIAL_JUMP_VELOCITY: 12,
  MAX_BLINK_COUNT: 3,
  MAX_CLOUDS: 6,
  MAX_OBSTACLE_LENGTH: 3,
  MAX_OBSTACLE_DUPLICATION: 2,
  MAX_SPEED: 13,
  MIN_JUMP_HEIGHT: 35,
  SPEED: 6,
  SPEED_DROP_COEFFICIENT: 3,
} as const

export const SPRITE_DEFINITION = {
  LDPI: {
    CACTUS_LARGE: { x: 332, y: 2 },
    CACTUS_SMALL: { x: 228, y: 2 },
    CLOUD: { x: 86, y: 2 },
    HORIZON: { x: 2, y: 54 },
    MOON: { x: 484, y: 2 },
    PTERODACTYL: { x: 134, y: 2 },
    RESTART: { x: 2, y: 2 },
    TEXT_SPRITE: { x: 655, y: 2 },
    TREX: { x: 848, y: 2 },
    STAR: { x: 645, y: 2 },
  },
  HDPI: {
    CACTUS_LARGE: { x: 652, y: 2 },
    CACTUS_SMALL: { x: 446, y: 2 },
    CLOUD: { x: 166, y: 2 },
    HORIZON: { x: 2, y: 104 },
    MOON: { x: 954, y: 2 },
    PTERODACTYL: { x: 260, y: 2 },
    RESTART: { x: 2, y: 2 },
    TEXT_SPRITE: { x: 1294, y: 2 },
    TREX: { x: 1678, y: 2 },
    STAR: { x: 1276, y: 2 },
  },
} as const

export const TREX_CONFIG = {
  DROP_VELOCITY: -5,
  GRAVITY: 0.6,
  HEIGHT: 47,
  HEIGHT_DUCK: 25,
  INIITAL_JUMP_VELOCITY: -10,
  INTRO_DURATION: 1500,
  MAX_JUMP_HEIGHT: 30,
  MIN_JUMP_HEIGHT: 30,
  SPEED_DROP_COEFFICIENT: 3,
  SPRITE_WIDTH: 262,
  START_X_POS: 50,
  WIDTH: 44,
  WIDTH_DUCK: 59,
} as const

export const TREX_COLLISION_BOXES = {
  RUNNING: [
    { x: 22, y: 0, width: 17, height: 16 },
    { x: 1, y: 18, width: 30, height: 9 },
    { x: 10, y: 35, width: 14, height: 8 },
    { x: 1, y: 24, width: 29, height: 5 },
    { x: 5, y: 30, width: 21, height: 4 },
    { x: 9, y: 34, width: 15, height: 4 },
  ],
  DUCKING: [{ x: 1, y: 18, width: 55, height: 25 }],
} as const

export const TREX_ANIM_FRAMES = {
  WAITING: { frames: [44, 0], msPerFrame: 1000 / 3 },
  RUNNING: { frames: [88, 132], msPerFrame: 1000 / 12 },
  CRASHED: { frames: [220], msPerFrame: 1000 / 60 },
  JUMPING: { frames: [0], msPerFrame: 1000 / 60 },
  DUCKING: { frames: [264, 323], msPerFrame: 1000 / 8 },
} as const

export const HORIZON_CONFIG = {
  WIDTH: 600,
  HEIGHT: 12,
  YPOS: 127,
  BUMP_THRESHOLD: 0.5,
} as const

export const CLOUD_CONFIG = {
  HEIGHT: 14,
  MAX_CLOUD_GAP: 400,
  MAX_SKY_LEVEL: 30,
  MIN_CLOUD_GAP: 100,
  MIN_SKY_LEVEL: 71,
  WIDTH: 46,
} as const

export const OBSTACLE_TYPES: Readonly<ObstacleDefinition[]> = [
  {
    type: 'CACTUS_SMALL',
    width: 17,
    height: 35,
    yPos: 105,
    multipleSpeed: 4,
    minGap: 120,
    minSpeed: 0,
    collisionBoxes: [
      { x: 0, y: 7, width: 5, height: 27 },
      { x: 4, y: 0, width: 6, height: 34 },
      { x: 10, y: 4, width: 7, height: 14 },
    ],
  },
  {
    type: 'CACTUS_LARGE',
    width: 25,
    height: 50,
    yPos: 90,
    multipleSpeed: 7,
    minGap: 120,
    minSpeed: 0,
    collisionBoxes: [
      { x: 0, y: 12, width: 7, height: 38 },
      { x: 8, y: 0, width: 7, height: 49 },
      { x: 13, y: 10, width: 10, height: 38 },
    ],
  },
  {
    type: 'PTERODACTYL',
    width: 46,
    height: 40,
    yPos: [50, 100],
    minGap: 150,
    minSpeed: 8.5,
    numFrames: 2,
    frameRate: 1000 / 6,
    speedOffset: 0.8,
    collisionBoxes: [
      { x: 15, y: 15, width: 16, height: 5 },
      { x: 18, y: 21, width: 24, height: 6 },
      { x: 2, y: 14, width: 4, height: 3 },
      { x: 6, y: 10, width: 4, height: 7 },
      { x: 10, y: 8, width: 6, height: 9 },
    ],
  },
] as const
