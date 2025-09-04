import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'save-weights',
      configureServer(server) {
        server.middlewares.use('/api/save-weights', (req, res, next) => {
          if (req.method === 'POST') {
            let body = ''
            req.on('data', chunk => {
              body += chunk.toString()
            })
            req.on('end', () => {
              try {
                const weightsData = JSON.parse(body)
                const filePath = path.join(
                  process.cwd(),
                  'public',
                  'neural-network-weights.json'
                )
                const dir = path.dirname(filePath)
                fs.mkdirSync(dir, { recursive: true })
                fs.writeFileSync(filePath, JSON.stringify(weightsData, null, 2))
                res.writeHead(200, { 'Content-Type': 'application/json' })
                res.end(JSON.stringify({ success: true }))
              } catch (error) {
                res.writeHead(500, { 'Content-Type': 'application/json' })
                res.end(JSON.stringify({ error: 'Failed to save' }))
              }
            })
          } else {
            next()
          }
        })

        // save training checkpoint to public/training-checkpoint.json
        server.middlewares.use('/api/save-checkpoint', (req, res, next) => {
          if (req.method === 'POST') {
            let body = ''
            req.on('data', chunk => {
              body += chunk.toString()
            })
            req.on('end', () => {
              try {
                const checkpoint = JSON.parse(body)
                const filePath = path.join(
                  process.cwd(),
                  'public',
                  'training-checkpoint.json'
                )
                const dir = path.dirname(filePath)
                fs.mkdirSync(dir, { recursive: true })
                fs.writeFileSync(filePath, JSON.stringify(checkpoint, null, 2))
                res.writeHead(200, { 'Content-Type': 'application/json' })
                res.end(JSON.stringify({ success: true }))
              } catch (error) {
                res.writeHead(500, { 'Content-Type': 'application/json' })
                res.end(JSON.stringify({ error: 'Failed to save checkpoint' }))
              }
            })
          } else {
            next()
          }
        })

        // reset training: expects JSON { checkpoint: {...}, best: {...} }
        server.middlewares.use('/api/reset-training', (req, res, next) => {
          if (req.method === 'POST') {
            let body = ''
            req.on('data', chunk => {
              body += chunk.toString()
            })
            req.on('end', () => {
              try {
                const payload = JSON.parse(body)
                const checkpointPath = path.join(
                  process.cwd(),
                  'public',
                  'training-checkpoint.json'
                )
                const bestPath = path.join(
                  process.cwd(),
                  'public',
                  'neural-network-weights.json'
                )

                if (!payload || !payload.checkpoint || !payload.best) {
                  res.writeHead(400, { 'Content-Type': 'application/json' })
                  res.end(
                    JSON.stringify({
                      error: 'Missing checkpoint or best payload',
                    })
                  )
                  return
                }

                const dir1 = path.dirname(checkpointPath)
                const dir2 = path.dirname(bestPath)
                fs.mkdirSync(dir1, { recursive: true })
                fs.mkdirSync(dir2, { recursive: true })

                fs.writeFileSync(
                  checkpointPath,
                  JSON.stringify(payload.checkpoint, null, 2)
                )
                fs.writeFileSync(
                  bestPath,
                  JSON.stringify(payload.best, null, 2)
                )

                res.writeHead(200, { 'Content-Type': 'application/json' })
                res.end(JSON.stringify({ success: true }))
              } catch (error) {
                res.writeHead(500, { 'Content-Type': 'application/json' })
                res.end(JSON.stringify({ error: 'Failed to reset training' }))
              }
            })
          } else {
            next()
          }
        })
      },
    },
  ],
})
