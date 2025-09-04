import { NeuralNetworkManager } from '../managers/NeuralNetworkManager'

export interface NeuralNetworkPanelProps {
  width?: number
  height?: number
  networkManager: NeuralNetworkManager
  generation?: number
}
