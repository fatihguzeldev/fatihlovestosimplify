import { NeuralNetwork, DEFAULT_ARCHITECTURE } from '../ai/NeuralNetwork'
import { NetworkVisualizationData, GameInputs, WeightsFile } from '../types'

export class NeuralNetworkManager {
  private neuralNetwork: NeuralNetwork
  private updateCallbacks: Array<(data: NetworkVisualizationData) => void> = []

  constructor() {
    this.neuralNetwork = new NeuralNetwork(DEFAULT_ARCHITECTURE)
    this.loadWeights()
  }

  public onUpdate(callback: (data: NetworkVisualizationData) => void): void {
    this.updateCallbacks.push(callback)
  }

  public removeCallback(
    callback: (data: NetworkVisualizationData) => void
  ): void {
    const index = this.updateCallbacks.indexOf(callback)

    if (index > -1) {
      this.updateCallbacks.splice(index, 1)
    }
  }

  public processGameInputs(inputs: GameInputs): {
    jump: number
    duck: number
    run: number
  } {
    const arch = DEFAULT_ARCHITECTURE

    // build input vector compatible with current architecture size
    const inputArray = new Array(arch.inputSize).fill(0)
    inputArray[0] = inputs.obstacleDistance
    inputArray[1] = inputs.obstacleHeight
    inputArray[2] = inputs.dinoYVelocity
    inputArray[3] = inputs.gameSpeed
    inputArray[4] = inputs.isOnGround
    inputArray[5] = inputs.timeToImpact
    inputArray[6] = inputs.obstaclePresent
    inputArray[7] = inputs.isPtero
    inputArray[8] = inputs.pteroRelHeight
    inputArray[9] = inputs.invDistance
    inputArray[10] = inputs.dDistance
    inputArray[11] = inputs.enhancedDuckSignal

    const outputs = this.neuralNetwork.predict(inputArray)
    const visualizationData = this.getVisualizationData()

    this.updateCallbacks.forEach(callback => callback(visualizationData))

    return { jump: outputs[0], duck: outputs[1], run: outputs[2] }
  }

  public getVisualizationData(): NetworkVisualizationData {
    const arch = DEFAULT_ARCHITECTURE

    return {
      inputs: [...this.neuralNetwork.lastInputs],
      hidden1: [...this.neuralNetwork.lastHidden1],
      hidden2: [...this.neuralNetwork.lastHidden2],
      outputs: [...this.neuralNetwork.lastOutputs],
      totalWeights: this.neuralNetwork.getTotalWeights(),
      totalNeurons:
        arch.inputSize + arch.hidden1Size + arch.hidden2Size + arch.outputSize,
      totalBiases: arch.hidden1Size + arch.hidden2Size + arch.outputSize,
      architecture: `${arch.inputSize} → ${arch.hidden1Size} → ${arch.hidden2Size} → ${arch.outputSize}`,
    }
  }

  public getWeight(
    fromLayer: 'input' | 'hidden1' | 'hidden2',
    fromIndex: number,
    toLayer: 'hidden1' | 'hidden2' | 'output',
    toIndex: number
  ): number {
    return this.neuralNetwork.getWeight(fromLayer, fromIndex, toLayer, toIndex)
  }

  private updateWeightsFile(): void {
    const flatWeights = this.neuralNetwork.getWeights()
    const arch = DEFAULT_ARCHITECTURE

    // slice the flat array into structured parts
    const inputToHidden1 = flatWeights.slice(
      0,
      arch.inputSize * arch.hidden1Size
    )
    const hidden1ToHidden2 = flatWeights.slice(
      arch.inputSize * arch.hidden1Size,
      arch.inputSize * arch.hidden1Size + arch.hidden1Size * arch.hidden2Size
    )
    const hidden2ToOutput = flatWeights.slice(
      arch.inputSize * arch.hidden1Size + arch.hidden1Size * arch.hidden2Size,
      arch.inputSize * arch.hidden1Size +
        arch.hidden1Size * arch.hidden2Size +
        arch.hidden2Size * arch.outputSize
    )
    const biasHidden1 = flatWeights.slice(
      arch.inputSize * arch.hidden1Size +
        arch.hidden1Size * arch.hidden2Size +
        arch.hidden2Size * arch.outputSize,
      arch.inputSize * arch.hidden1Size +
        arch.hidden1Size * arch.hidden2Size +
        arch.hidden2Size * arch.outputSize +
        arch.hidden1Size
    )
    const biasHidden2 = flatWeights.slice(
      arch.inputSize * arch.hidden1Size +
        arch.hidden1Size * arch.hidden2Size +
        arch.hidden2Size * arch.outputSize +
        arch.hidden1Size,
      arch.inputSize * arch.hidden1Size +
        arch.hidden1Size * arch.hidden2Size +
        arch.hidden2Size * arch.outputSize +
        arch.hidden1Size +
        arch.hidden2Size
    )
    const biasOutput = flatWeights.slice(
      arch.inputSize * arch.hidden1Size +
        arch.hidden1Size * arch.hidden2Size +
        arch.hidden2Size * arch.outputSize +
        arch.hidden1Size +
        arch.hidden2Size
    )

    // build payload
    const weightsData = {
      version: '1.0.0',
      architecture: {
        inputSize: arch.inputSize,
        hidden1Size: arch.hidden1Size,
        hidden2Size: arch.hidden2Size,
        outputSize: arch.outputSize,
      },
      generation: 0,
      bestFitness: 0,
      weights: {
        inputToHidden1: inputToHidden1.map(w => Number(w.toFixed(3))),
        hidden1ToHidden2: hidden1ToHidden2.map(w => Number(w.toFixed(3))),
        hidden2ToOutput: hidden2ToOutput.map(w => Number(w.toFixed(3))),
        biasHidden1: biasHidden1.map(w => Number(w.toFixed(3))),
        biasHidden2: biasHidden2.map(w => Number(w.toFixed(3))),
        biasOutput: biasOutput.map(w => Number(w.toFixed(3))),
      },
      metadata: {
        createdAt: new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
        totalGenerations: 0,
        averageFitness: 0,
      },
    }

    // save to file
    fetch('/api/save-weights', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(weightsData),
    }).catch(() => {})
  }

  public getArchitecture() {
    return DEFAULT_ARCHITECTURE
  }

  private async loadWeights(): Promise<void> {
    try {
      const response = await fetch('/neural-network-weights.json')
      if (response.ok) {
        const data: WeightsFile = await response.json()
        if (data.weights) {
          const flatWeights = [
            ...data.weights.inputToHidden1,
            ...data.weights.hidden1ToHidden2,
            ...data.weights.hidden2ToOutput,
            ...data.weights.biasHidden1,
            ...data.weights.biasHidden2,
            ...data.weights.biasOutput,
          ]
          this.neuralNetwork.setWeights(flatWeights)
          // init activations
          this.neuralNetwork.predict(
            new Array(DEFAULT_ARCHITECTURE.inputSize).fill(0)
          )
        }
      }
    } catch {
      // if file missing, create with current random weights
      this.updateWeightsFile()
    }

    // ensure activations initialized
    this.neuralNetwork.predict(
      new Array(DEFAULT_ARCHITECTURE.inputSize).fill(0)
    )

    // notify listeners
    const visualizationData = this.getVisualizationData()
    this.updateCallbacks.forEach(callback => callback(visualizationData))
  }

  // set current network weights and notify listeners
  public setNetworkFromFlatWeights(weights: number[]): void {
    this.neuralNetwork.setWeights(weights)
    const visualizationData = this.getVisualizationData()
    this.updateCallbacks.forEach(callback => callback(visualizationData))
  }
}
