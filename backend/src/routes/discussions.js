import { Router } from 'express'
import { v4 as uuidv4 } from 'uuid'
import { db } from '../db.js'

const router = Router({ mergeParams: true })

// GET /api/leads/:leadId/discussions
router.get('/', async (req, res) => {
  try {
    await db.read()
    const { leadId } = req.params
    const lead = db.data.leads.find(l => l.id === leadId)
    if (!lead) return res.status(404).json({ error: 'Lead not found' })

    const discussions = db.data.discussions
      .filter(d => d.leadId === leadId)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

    res.json(discussions)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// POST /api/leads/:leadId/discussions
router.post('/', async (req, res) => {
  try {
    await db.read()
    const { leadId } = req.params
    const { note, followUpDate, followUpTime } = req.body

    if (!note || !note.trim()) {
      return res.status(400).json({ error: 'Note is required' })
    }

    const leadIdx = db.data.leads.findIndex(l => l.id === leadId)
    if (leadIdx === -1) return res.status(404).json({ error: 'Lead not found' })

    const discussion = {
      id: uuidv4(),
      leadId,
      note: note.trim(),
      followUpDate: followUpDate || null,
      followUpTime: followUpTime || null,
      createdAt: new Date().toISOString(),
    }

    db.data.discussions.push(discussion)

    // Update lead's followup if provided
    if (followUpDate) {
      db.data.leads[leadIdx].followUpDate = followUpDate
      db.data.leads[leadIdx].followUpTime = followUpTime || null
    }
    db.data.leads[leadIdx].updatedAt = new Date().toISOString()

    await db.write()
    res.status(201).json(discussion)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default router
