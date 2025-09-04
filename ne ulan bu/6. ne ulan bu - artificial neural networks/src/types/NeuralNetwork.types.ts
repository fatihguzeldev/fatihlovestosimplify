// neural network architecture definition
export interface NetworkArchitecture {
  inputSize: number
  hidden1Size: number
  hidden2Size: number
  outputSize: number
}

// snapshot of network state for visualization
export interface NetworkState {
  inputs: number[]
  hidden1: number[]
  hidden2: number[]
  outputs: number[]
  weightsIH1: number[][]
  weightsH1H2: number[][]
  weightsH2O: number[][]
  biasH1: number[]
  biasH2: number[]
  biasO: number[]
}
