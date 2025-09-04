import { NeuralNetwork, DEFAULT_ARCHITECTURE } from '../ai/NeuralNetwork'
import {
  IndividualCheckpoint,
  TrainingCheckpoint,
  BestWeightsPayload,
} from '../types/TrainingState.types'

// create initial training checkpoint with random population
export function buildInitialCheckpoint(
  populationSize: number
): TrainingCheckpoint {
  const individuals: IndividualCheckpoint[] = []

  for (let i = 0; i < populationSize; i++) {
    const net = new NeuralNetwork(DEFAULT_ARCHITECTURE)
    individuals.push({ id: i + 1, weights: net.getWeights() })
  }

  return {
    generation: 0,
    config: {
      populationSize,
      mutationRate: 0.1,
      crossoverRate: 0.7,
    },
    rngSeed: Math.floor(Math.random() * 1_000_000),
    population: individuals,
    highScore: 0,
  }
}

// convert flat weights array to structured payload
export function buildBestPayloadFromWeights(
  weights: number[]
): BestWeightsPayload {
  const net = new NeuralNetwork(DEFAULT_ARCHITECTURE)
  net.setWeights(weights)

  const arch = DEFAULT_ARCHITECTURE
  const now = new Date().toISOString()
  const state = net.getNetworkState()

  return {
    version: '1.0.0',
    architecture: arch,
    generation: 0,
    bestFitness: 0,
    weights: {
      inputToHidden1: state.weightsIH1.flat(),
      hidden1ToHidden2: state.weightsH1H2.flat(),
      hidden2ToOutput: state.weightsH2O.flat(),
      biasHidden1: state.biasH1,
      biasHidden2: state.biasH2,
      biasOutput: state.biasO,
    },
    metadata: {
      createdAt: now,
      lastUpdated: now,
      totalGenerations: 0,
      averageFitness: 0,
    },
  }
}

// save checkpoint to server
export async function saveCheckpoint(
  checkpoint: TrainingCheckpoint
): Promise<boolean> {
  try {
    const res = await fetch('/api/save-checkpoint', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(checkpoint),
    })
    return res.ok
  } catch {
    return false
  }
}

// reset training files with new checkpoint and best weights
export async function resetTrainingFiles(
  checkpoint: TrainingCheckpoint,
  best: BestWeightsPayload
): Promise<boolean> {
  try {
    const res = await fetch('/api/reset-training', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ checkpoint, best }),
    })
    return res.ok
  } catch {
    return false
  }
}
