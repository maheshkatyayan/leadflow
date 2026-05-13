import { Router } from 'express'
import { v4 as uuidv4 } from 'uuid'
import { db } from '../db.js'

const router = Router()

// GET /api/leads - list all leads (with optional status filter & search)
router.get('/', async (req, res) => {
  try {
    await db.read()
    let leads = db.data.leads

    const { status, search } = req.query

    if (status && status !== 'All') {
      leads = leads.filter(l => l.status === status)
    }

    if (search) {
      const q = search.toLowerCase()
      leads = leads.filter(l =>
        l.name.toLowerCase().includes(q) ||
        (l.company || '').toLowerCase().includes(q)
      )
    }

    // Attach last discussion note to each lead
    const discussions = db.data.discussions
    const leadsWithNotes = leads.map(lead => {
      const leadDiscussions = discussions
        .filter(d => d.leadId === lead.id)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

      return {
        ...lead,
        lastNote: leadDiscussions[0]?.note || null,
        lastNoteAt: leadDiscussions[0]?.createdAt || null,
      }
    })

    res.json(leadsWithNotes)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// POST /api/leads - create lead
router.post('/', async (req, res) => {
  try {
    const { name, company, phone } = req.body
    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Name is required' })
    }

    await db.read()
    const lead = {
      id: uuidv4(),
      name: name.trim(),
      company: company?.trim() || null,
      phone: phone?.trim() || null,
      status: 'New',
      followUpDate: null,
      followUpTime: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    db.data.leads.push(lead)

    // Auto-create initial discussion
    const initNote = {
      id: uuidv4(),
      leadId: lead.id,
      note: 'Lead created.',
      followUpDate: null,
      followUpTime: null,
      createdAt: new Date().toISOString(),
    }
    db.data.discussions.push(initNote)

    await db.write()
    res.status(201).json(lead)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// PATCH /api/leads/:id - update status / followup
router.patch('/:id', async (req, res) => {
  try {
    await db.read()
    const idx = db.data.leads.findIndex(l => l.id === req.params.id)
    if (idx === -1) return res.status(404).json({ error: 'Lead not found' })

    const allowed = ['status', 'followUpDate', 'followUpTime', 'name', 'company', 'phone']
    allowed.forEach(key => {
      if (req.body[key] !== undefined) {
        db.data.leads[idx][key] = req.body[key]
      }
    })
    db.data.leads[idx].updatedAt = new Date().toISOString()

    await db.write()
    res.json(db.data.leads[idx])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// DELETE /api/leads/:id
router.delete('/:id', async (req, res) => {
  try {
    await db.read()
    const idx = db.data.leads.findIndex(l => l.id === req.params.id)
    if (idx === -1) return res.status(404).json({ error: 'Lead not found' })

    db.data.leads.splice(idx, 1)
    db.data.discussions = db.data.discussions.filter(d => d.leadId !== req.params.id)
    await db.write()
    res.status(204).end()
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default router
