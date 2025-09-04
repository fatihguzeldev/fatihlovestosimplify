import { DEFAULT_ARCHITECTURE } from '../ai/NeuralNetwork'

// training checkpoint interfaces
export interface IndividualCheckpoint {
  id: number
  weights: number[]
}

export interface TrainingConfig {
  populationSize: number
  mutationRate: number
  crossoverRate: number
}

export interface TrainingCheckpoint {
  generation: number
  config: TrainingConfig
  rngSeed?: number
  population: IndividualCheckpoint[]
  highScore?: number
}

// neural network weights structure
export interface NetworkWeights {
  inputToHidden1: number[]
  hidden1ToHidden2: number[]
  hidden2ToOutput: number[]
  biasHidden1: number[]
  biasHidden2: number[]
  biasOutput: number[]
}

export interface NetworkMetadata {
  createdAt: string
  lastUpdated: string
  totalGenerations: number
  averageFitness: number
}

export interface BestWeightsPayload {
  version: string
  architecture: typeof DEFAULT_ARCHITECTURE
  generation: number
  bestFitness: number
  weights: NetworkWeights
  metadata: NetworkMetadata
}
