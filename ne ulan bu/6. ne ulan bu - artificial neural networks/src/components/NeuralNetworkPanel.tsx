import React, { useRef, useEffect, useState } from 'react'
import { NeuralNetworkManager } from '../managers/NeuralNetworkManager'
import { NetworkVisualizationData } from '../types'
import './NeuralNetworkPanel.css'

// visualization config
const NN_CONFIG = {
  NODE_RADIUS: 25,
  LAYER_SPACING: 200,
  NODE_SPACING: 80,
  INPUT_NODE_SPACING: 48,
}

// static labels
const INPUT_LABELS = [
  'obstacleDistance',
  'obstacleHeight',
  'dinoYVelocity',
  'gameSpeed',
  'isOnGround',
  'timeToImpact',
  'obstaclePresent',
  'isPtero',
  'pteroRelHeight',
  'invDistance',
  'dDistance',
  'enhcdDuckSignal',
]
const OUTPUT_LABELS = ['jump', 'duck', 'run']

interface NeuralNetworkPanelProps {
  width?: number
  height?: number
  networkManager: NeuralNetworkManager
  generation?: number
}

const NeuralNetworkPanel: React.FC<NeuralNetworkPanelProps> = ({
  width = 1450,
  height = 700,
  networkManager,
  generation,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationFrameRef = useRef<number>(0)

  if (!networkManager) {
    throw new Error('NeuralNetworkPanel requires a networkManager prop')
  }
  const manager = networkManager

  const arch0 = manager.getArchitecture()
  const visualizationDataRef = useRef<NetworkVisualizationData>({
    inputs: new Array(arch0.inputSize).fill(0),
    hidden1: new Array(arch0.hidden1Size).fill(0),
    hidden2: new Array(arch0.hidden2Size).fill(0),
    outputs: new Array(arch0.outputSize).fill(0),
    totalWeights:
      arch0.inputSize * arch0.hidden1Size +
      arch0.hidden1Size * arch0.hidden2Size +
      arch0.hidden2Size * arch0.outputSize +
      arch0.hidden1Size +
      arch0.hidden2Size +
      arch0.outputSize,
    totalNeurons:
      arch0.inputSize +
      arch0.hidden1Size +
      arch0.hidden2Size +
      arch0.outputSize,
    totalBiases: arch0.hidden1Size + arch0.hidden2Size + arch0.outputSize,
    architecture: `${arch0.inputSize} → ${arch0.hidden1Size} → ${arch0.hidden2Size} → ${arch0.outputSize}`,
  })

  const [displayData, setDisplayData] = useState<NetworkVisualizationData>({
    inputs: new Array(arch0.inputSize).fill(0),
    hidden1: new Array(arch0.hidden1Size).fill(0),
    hidden2: new Array(arch0.hidden2Size).fill(0),
    outputs: new Array(arch0.outputSize).fill(0),
    totalWeights:
      arch0.inputSize * arch0.hidden1Size +
      arch0.hidden1Size * arch0.hidden2Size +
      arch0.hidden2Size * arch0.outputSize +
      arch0.hidden1Size +
      arch0.hidden2Size +
      arch0.outputSize,
    totalNeurons:
      arch0.inputSize +
      arch0.hidden1Size +
      arch0.hidden2Size +
      arch0.outputSize,
    totalBiases: arch0.hidden1Size + arch0.hidden2Size + arch0.outputSize,
    architecture: `${arch0.inputSize} → ${arch0.hidden1Size} → ${arch0.hidden2Size} → ${arch0.outputSize}`,
  })

  useEffect(() => {
    const handleUpdate = (data: NetworkVisualizationData) => {
      visualizationDataRef.current = data
    }

    manager.onUpdate(handleUpdate)

    return () => {
      manager.removeCallback(handleUpdate)
    }
  }, [manager])

  // update display data periodically for info panel
  useEffect(() => {
    const interval = setInterval(() => {
      setDisplayData(visualizationDataRef.current)
    }, 100)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current
      const ctx = canvas.getContext('2d')

      if (ctx) {
        initializeCanvas(ctx, canvas)
        startVisualization(ctx, canvas)
      }
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [])

  const initializeCanvas = (
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement
  ) => {
    // clear canvas
    ctx.fillStyle = '#f7f7f7'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
  }

  const calculateNodePositions = (canvas: HTMLCanvasElement) => {
    const arch = manager.getArchitecture()
    const centerY = canvas.height / 2

    // 4 equal columns with padding
    const padding = 40
    const availableWidth = canvas.width - padding * 2
    const columnWidth = availableWidth / 4

    // column centers
    const columnCenters = [
      padding + columnWidth * 0.5,
      padding + columnWidth * 1.5,
      padding + columnWidth * 2.5,
      padding + columnWidth * 3.5,
    ]

    const positions = {
      inputs: [] as Array<{ x: number; y: number }>,
      hidden1: [] as Array<{ x: number; y: number }>,
      hidden2: [] as Array<{ x: number; y: number }>,
      outputs: [] as Array<{ x: number; y: number }>,
    }

    // input layer positions
    const maxRows = Math.max(1, arch.inputSize - 1)
    const availableH = canvas.height - 80
    const dynamicInputSpacing = Math.min(
      NN_CONFIG.INPUT_NODE_SPACING,
      Math.floor(availableH / maxRows)
    )
    const inputStartY = centerY - (maxRows * dynamicInputSpacing) / 2

    for (let i = 0; i < arch.inputSize; i++) {
      positions.inputs.push({
        x: columnCenters[0],
        y: inputStartY + i * dynamicInputSpacing,
      })
    }

    // hidden1 positions
    const hidden1StartY =
      centerY - ((arch.hidden1Size - 1) * NN_CONFIG.NODE_SPACING) / 2

    for (let i = 0; i < arch.hidden1Size; i++) {
      positions.hidden1.push({
        x: columnCenters[1],
        y: hidden1StartY + i * NN_CONFIG.NODE_SPACING,
      })
    }

    // hidden2 positions
    const hidden2StartY =
      centerY - ((arch.hidden2Size - 1) * NN_CONFIG.NODE_SPACING) / 2

    for (let i = 0; i < arch.hidden2Size; i++) {
      positions.hidden2.push({
        x: columnCenters[2],
        y: hidden2StartY + i * NN_CONFIG.NODE_SPACING,
      })
    }

    // output positions
    const outputStartY =
      centerY - ((arch.outputSize - 1) * NN_CONFIG.NODE_SPACING) / 2

    for (let i = 0; i < arch.outputSize; i++) {
      positions.outputs.push({
        x: columnCenters[3],
        y: outputStartY + i * NN_CONFIG.NODE_SPACING,
      })
    }

    return positions
  }

  const drawConnections = (
    ctx: CanvasRenderingContext2D,
    fromPositions: Array<{ x: number; y: number }>,
    toPositions: Array<{ x: number; y: number }>,
    fromLayer: 'input' | 'hidden1' | 'hidden2',
    toLayer: 'hidden1' | 'hidden2' | 'output'
  ) => {
    fromPositions.forEach((fromPos, fromIndex) => {
      toPositions.forEach((toPos, toIndex) => {
        // real weight between nodes
        const weight = manager.getWeight(fromLayer, fromIndex, toLayer, toIndex)

        // weight-based visuals
        const absWeight = Math.abs(weight)
        const lineWidth = Math.max(0.5, absWeight * 3)
        const opacity = Math.max(0.2, absWeight * 0.8)

        // color by sign
        const color =
          weight >= 0
            ? `rgba(0, 150, 255, ${opacity})`
            : `rgba(255, 50, 50, ${opacity})`

        ctx.strokeStyle = color
        ctx.lineWidth = lineWidth
        ctx.beginPath()
        ctx.moveTo(fromPos.x, fromPos.y)
        ctx.lineTo(toPos.x, toPos.y)
        ctx.stroke()
      })
    })
  }

  const drawNode = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    activation: number,
    label?: string,
    opts?: { radius?: number; labelLeft?: boolean; hideValue?: boolean }
  ) => {
    // node circle with activation alpha
    const alpha = 0.3 + activation * 0.7
    const radius = opts?.radius ?? NN_CONFIG.NODE_RADIUS

    ctx.fillStyle = `rgba(0, 150, 255, ${alpha})`
    ctx.beginPath()
    ctx.arc(x, y, radius, 0, Math.PI * 2)
    ctx.fill()

    // node border
    ctx.strokeStyle = '#333333'
    ctx.lineWidth = 2
    ctx.stroke()

    // activation text
    if (!opts?.hideValue) {
      ctx.fillStyle = '#000000'
      ctx.font = '12px "Roboto Mono", monospace'
      ctx.textAlign = 'center'
      ctx.fillText(activation.toFixed(2), x, y + 4)
    }

    // label
    if (label) {
      ctx.fillStyle = '#333333'
      ctx.font = '13px "Roboto Mono", monospace'
      if (opts?.labelLeft) {
        ctx.textAlign = 'right'
        ctx.fillText(label, x - radius - 8, y + 4)
      } else {
        ctx.textAlign = 'center'
        ctx.fillText(label, x, y + radius + 18)
      }
    }
  }

  const drawNeuralNetwork = (
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement
  ) => {
    const visualizationData = visualizationDataRef.current
    const positions = calculateNodePositions(canvas)

    // clear
    initializeCanvas(ctx, canvas)

    // connections
    drawConnections(
      ctx,
      positions.inputs,
      positions.hidden1,
      'input',
      'hidden1'
    )
    drawConnections(
      ctx,
      positions.hidden1,
      positions.hidden2,
      'hidden1',
      'hidden2'
    )
    drawConnections(
      ctx,
      positions.hidden2,
      positions.outputs,
      'hidden2',
      'output'
    )

    // nodes
    // input layer (smaller radius and left-aligned labels)
    positions.inputs.forEach((pos, i) => {
      const val = visualizationData.inputs[i] || 0
      const baseLabel = INPUT_LABELS[i] || `in${i + 1}`
      const text = `${baseLabel} | ${val.toFixed(2)}`
      const smallRadius = Math.max(10, Math.floor(NN_CONFIG.NODE_RADIUS * 0.65))
      drawNode(ctx, pos.x, pos.y, val, text, {
        radius: smallRadius,
        labelLeft: true,
        hideValue: true,
      })
    })

    // hidden layers
    positions.hidden1.forEach((pos, i) => {
      drawNode(ctx, pos.x, pos.y, visualizationData.hidden1[i] || 0)
    })
    positions.hidden2.forEach((pos, i) => {
      drawNode(ctx, pos.x, pos.y, visualizationData.hidden2[i] || 0)
    })

    // output layer
    positions.outputs.forEach((pos, i) => {
      drawNode(
        ctx,
        pos.x,
        pos.y,
        visualizationData.outputs[i] || 0,
        OUTPUT_LABELS[i]
      )
    })

    // layer labels
    ctx.fillStyle = '#333333'
    ctx.font = '16px "Roboto Mono", monospace'
    ctx.textAlign = 'center'

    ctx.fillText('inputs', positions.inputs[0].x, 30)
    ctx.fillText('hidden 1', positions.hidden1[0].x, 30)
    ctx.fillText('hidden 2', positions.hidden2[0].x, 30)
    ctx.fillText('outputs', positions.outputs[0].x, 30)
  }

  const startVisualization = (
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement
  ) => {
    const animate = () => {
      drawNeuralNetwork(ctx, canvas)
      animationFrameRef.current = requestAnimationFrame(animate)
    }
    animate()
  }

  return (
    <div className="neural-network-panel-container">
      <div className="nn-scroll">
        <canvas
          ref={canvasRef}
          width={width}
          height={height}
          className="neural-network-canvas"
        />
      </div>
      <div className="network-info">
        <div>architecture: {displayData.architecture}</div>
        <div>
          neurons: {displayData.totalNeurons} | weights:{' '}
          {displayData.totalWeights} | biases: {displayData.totalBiases}
        </div>
        <div>
          outputs: jump={displayData.outputs[0]?.toFixed(3) || '0.000'} | duck=
          {displayData.outputs[1]?.toFixed(3) || '0.000'} | run=
          {displayData.outputs[2]?.toFixed(3) || '0.000'}
        </div>
        {typeof generation === 'number' && <div>generation: {generation}</div>}
      </div>
    </div>
  )
}

export default NeuralNetworkPanel
