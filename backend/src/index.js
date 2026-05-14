import express from 'express'
import cors from 'cors'
import { initDb } from './db.js'
import leadsRouter from './routes/leads.js'
import discussionsRouter from './routes/discussions.js'

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}))
app.use(express.json())

// Routes
app.use('/api/leads', leadsRouter)
app.use('/api/leads/:leadId/discussions', discussionsRouter)

// Health check
app.get('/api/health', (_req, res) => res.json({ status: 'ok' }))

// 404
app.use((_req, res) => res.status(404).json({ error: 'Not found' }))

// Error handler
app.use((err, _req, res, _next) => {
  console.error(err)
  res.status(500).json({ error: 'Internal server error' })
})

async function start() {
  await initDb()
  app.listen(PORT, () => {
    console.log(`server is running on http://localhost:${PORT}`)
  })
}

start()
