import React, { useEffect, useRef, useState } from 'react'
import TRexGame from './components/TRexGame'
import NeuralNetworkPanel from './components/NeuralNetworkPanel'
import { NeuralNetworkManager } from './managers/NeuralNetworkManager'
import {
  buildBestPayloadFromWeights,
  buildInitialCheckpoint,
  resetTrainingFiles,
} from './managers/TrainingState'
import './App.css'

function App() {
  // create a single shared neural network manager
  const networkManagerRef = useRef<NeuralNetworkManager>(
    new NeuralNetworkManager()
  )
  const [generation, setGeneration] = useState<number | null>(null)

  useEffect(() => {
    // try to load current generation from checkpoint if present
    ;(async () => {
      try {
        const res = await fetch('/training-checkpoint.json')
        if (res.ok) {
          const data = await res.json()
          if (typeof data?.generation === 'number') {
            setGeneration(data.generation)
          }
        }
      } catch {}
    })()
  }, [])

  return (
    <div className="app">
      <div className="neural-network-panel">
        <div className="panel-title-row">
          <h2>neural network</h2>
          <button
            className="reset-training-btn"
            onClick={async () => {
              // build fresh checkpoint and best from a new random network
              // use desired population size for a clean reset (match T_REX_COUNT)
              const checkpoint = buildInitialCheckpoint(200)
              const best = buildBestPayloadFromWeights(
                checkpoint.population[0].weights
              )
              const ok = await resetTrainingFiles(checkpoint, best)
              if (!ok) {
                console.error('reset training failed')
              } else {
                console.log('training reset complete')
                networkManagerRef.current.setNetworkFromFlatWeights(
                  checkpoint.population[0].weights
                )
                setGeneration(checkpoint.generation)
              }
            }}
          >
            reset training
          </button>
        </div>
        <NeuralNetworkPanel
          networkManager={networkManagerRef.current}
          generation={generation ?? undefined}
        />
      </div>

      <div className="game-panel">
        <h2>t-rex game</h2>
        <TRexGame
          networkManager={networkManagerRef.current}
          onGenerationChange={setGeneration}
        />
      </div>
    </div>
  )
}

export default App
