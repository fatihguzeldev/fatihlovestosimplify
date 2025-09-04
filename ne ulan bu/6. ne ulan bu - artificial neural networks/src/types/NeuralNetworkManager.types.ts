import { NetworkWeights } from './TrainingState.types'

// data used by the nn panel
export interface NetworkVisualizationData {
  inputs: number[]
  hidden1: number[]
  hidden2: number[]
  outputs: number[]
  totalWeights: number
  totalNeurons: number
  totalBiases: number
  architecture: string
}

// normalized game inputs fed into the network
export interface GameInputs {
  obstacleDistance: number
  obstacleHeight: number
  dinoYVelocity: number
  gameSpeed: number
  isOnGround: number
  timeToImpact: number
  obstaclePresent: number
  isPtero: number
  pteroRelHeight: number
  invDistance: number
  dDistance: number
  enhancedDuckSignal: number
}

// minimal schema of weights file used on load
export interface WeightsFile {
  weights: NetworkWeights
}
