import { NetworkArchitecture, NetworkState } from '../types'

export class NeuralNetwork {
  private architecture: NetworkArchitecture
  private weightsIH1: number[][] = []
  private weightsH1H2: number[][] = []
  private weightsH2O: number[][] = []
  private biasH1: number[] = []
  private biasH2: number[] = []
  private biasO: number[] = []
  public lastInputs: number[] = []
  public lastHidden1: number[] = []
  public lastHidden2: number[] = []
  public lastOutputs: number[] = []

  constructor(architecture: NetworkArchitecture) {
    this.architecture = architecture
    this.initializeWeights()
  }

  // init weights and biases
  private initializeWeights(): void {
    this.weightsIH1 = []
    for (let i = 0; i < this.architecture.inputSize; i++) {
      this.weightsIH1[i] = []
      for (let j = 0; j < this.architecture.hidden1Size; j++) {
        this.weightsIH1[i][j] = this.randomWeight()
      }
    }

    this.weightsH1H2 = []
    for (let i = 0; i < this.architecture.hidden1Size; i++) {
      this.weightsH1H2[i] = []
      for (let j = 0; j < this.architecture.hidden2Size; j++) {
        this.weightsH1H2[i][j] = this.randomWeight()
      }
    }

    this.weightsH2O = []
    for (let i = 0; i < this.architecture.hidden2Size; i++) {
      this.weightsH2O[i] = []
      for (let j = 0; j < this.architecture.outputSize; j++) {
        this.weightsH2O[i][j] = this.randomWeight()
      }
    }

    this.biasH1 = Array(this.architecture.hidden1Size)
      .fill(0)
      .map(() => this.randomWeight())
    this.biasH2 = Array(this.architecture.hidden2Size)
      .fill(0)
      .map(() => this.randomWeight())
    this.biasO = Array(this.architecture.outputSize)
      .fill(0)
      .map(() => this.randomWeight())
  }

  // uniform random weight in [-1, 1]
  private randomWeight(): number {
    return Math.random() * 2 - 1
  }

  private sigmoid(x: number): number {
    return 1 / (1 + Math.exp(-x))
  }

  // forward pass
  public predict(inputs: number[]): number[] {
    if (inputs.length !== this.architecture.inputSize) {
      throw new Error(
        `expected ${this.architecture.inputSize} inputs, got ${inputs.length}`
      )
    }

    this.lastInputs = [...inputs]
    const hidden1: number[] = []
    for (let j = 0; j < this.architecture.hidden1Size; j++) {
      let sum = this.biasH1[j]
      for (let i = 0; i < this.architecture.inputSize; i++) {
        sum += inputs[i] * this.weightsIH1[i][j]
      }
      hidden1[j] = this.sigmoid(sum)
    }
    this.lastHidden1 = [...hidden1]

    // hidden2 layer
    const hidden2: number[] = []
    for (let j = 0; j < this.architecture.hidden2Size; j++) {
      let sum = this.biasH2[j]
      for (let i = 0; i < this.architecture.hidden1Size; i++) {
        sum += hidden1[i] * this.weightsH1H2[i][j]
      }
      hidden2[j] = this.sigmoid(sum)
    }
    this.lastHidden2 = [...hidden2]

    // output layer
    const outputs: number[] = []
    for (let j = 0; j < this.architecture.outputSize; j++) {
      let sum = this.biasO[j]
      for (let i = 0; i < this.architecture.hidden2Size; i++) {
        sum += hidden2[i] * this.weightsH2O[i][j]
      }
      outputs[j] = this.sigmoid(sum)
    }
    this.lastOutputs = [...outputs]

    return outputs
  }

  // flatten weights and biases
  public getWeights(): number[] {
    const weights: number[] = []

    for (let i = 0; i < this.architecture.inputSize; i++) {
      for (let j = 0; j < this.architecture.hidden1Size; j++) {
        weights.push(this.weightsIH1[i][j])
      }
    }

    for (let i = 0; i < this.architecture.hidden1Size; i++) {
      for (let j = 0; j < this.architecture.hidden2Size; j++) {
        weights.push(this.weightsH1H2[i][j])
      }
    }

    for (let i = 0; i < this.architecture.hidden2Size; i++) {
      for (let j = 0; j < this.architecture.outputSize; j++) {
        weights.push(this.weightsH2O[i][j])
      }
    }

    weights.push(...this.biasH1)
    weights.push(...this.biasH2)
    weights.push(...this.biasO)

    return weights
  }

  // set from flattened weights
  public setWeights(weights: number[]): void {
    let index = 0

    for (let i = 0; i < this.architecture.inputSize; i++) {
      for (let j = 0; j < this.architecture.hidden1Size; j++) {
        this.weightsIH1[i][j] = weights[index++]
      }
    }

    for (let i = 0; i < this.architecture.hidden1Size; i++) {
      for (let j = 0; j < this.architecture.hidden2Size; j++) {
        this.weightsH1H2[i][j] = weights[index++]
      }
    }

    for (let i = 0; i < this.architecture.hidden2Size; i++) {
      for (let j = 0; j < this.architecture.outputSize; j++) {
        this.weightsH2O[i][j] = weights[index++]
      }
    }

    for (let i = 0; i < this.architecture.hidden1Size; i++) {
      this.biasH1[i] = weights[index++]
    }
    for (let i = 0; i < this.architecture.hidden2Size; i++) {
      this.biasH2[i] = weights[index++]
    }
    for (let i = 0; i < this.architecture.outputSize; i++) {
      this.biasO[i] = weights[index++]
    }
  }

  // total weights and biases count
  public getTotalWeights(): number {
    const ih1 = this.architecture.inputSize * this.architecture.hidden1Size
    const h1h2 = this.architecture.hidden1Size * this.architecture.hidden2Size
    const h2o = this.architecture.hidden2Size * this.architecture.outputSize
    const biases =
      this.architecture.hidden1Size +
      this.architecture.hidden2Size +
      this.architecture.outputSize
    return ih1 + h1h2 + h2o + biases
  }

  // clone network
  public clone(): NeuralNetwork {
    const clone = new NeuralNetwork(this.architecture)
    clone.setWeights(this.getWeights())
    return clone
  }

  // current state for visualization
  public getNetworkState(): NetworkState {
    return {
      inputs: [...this.lastInputs],
      hidden1: [...this.lastHidden1],
      hidden2: [...this.lastHidden2],
      outputs: [...this.lastOutputs],
      weightsIH1: this.weightsIH1.map(row => [...row]),
      weightsH1H2: this.weightsH1H2.map(row => [...row]),
      weightsH2O: this.weightsH2O.map(row => [...row]),
      biasH1: [...this.biasH1],
      biasH2: [...this.biasH2],
      biasO: [...this.biasO],
    }
  }

  // weight lookup between two nodes
  public getWeight(
    fromLayer: 'input' | 'hidden1' | 'hidden2',
    fromIndex: number,
    toLayer: 'hidden1' | 'hidden2' | 'output',
    toIndex: number
  ): number {
    if (fromLayer === 'input' && toLayer === 'hidden1') {
      return this.weightsIH1[fromIndex][toIndex]
    } else if (fromLayer === 'hidden1' && toLayer === 'hidden2') {
      return this.weightsH1H2[fromIndex][toIndex]
    } else if (fromLayer === 'hidden2' && toLayer === 'output') {
      return this.weightsH2O[fromIndex][toIndex]
    }
    return 0
  }
}

export const DEFAULT_ARCHITECTURE: NetworkArchitecture = {
  inputSize: 12,
  hidden1Size: 8,
  hidden2Size: 6,
  outputSize: 3,
}
