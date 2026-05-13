import { db, initDb } from './db.js'
import { v4 as uuidv4 } from 'uuid'

const now = new Date()
const daysAgo = (n) => new Date(now - n * 24 * 60 * 60 * 1000).toISOString()
const hoursAgo = (n) => new Date(now - n * 60 * 60 * 1000).toISOString()

const leads = [
  {
    id: uuidv4(),
    name: 'Sarah Connor',
    company: 'Acme Corp',
    phone: '555-0199',
    status: 'Proposal Sent',
    followUpDate: now.toISOString().split('T')[0],
    followUpTime: '14:00',
    createdAt: daysAgo(6),
    updatedAt: daysAgo(2),
  },
  {
    id: uuidv4(),
    name: 'Hank Scorpio',
    company: 'Globex',
    phone: '555-0142',
    status: 'New',
    followUpDate: null,
    followUpTime: null,
    createdAt: hoursAgo(2),
    updatedAt: hoursAgo(2),
  },
  {
    id: uuidv4(),
    name: 'Bill Lumbergh',
    company: 'Initech',
    phone: '555-0167',
    status: 'Contacted',
    followUpDate: null,
    followUpTime: null,
    createdAt: daysAgo(10),
    updatedAt: daysAgo(7),
  },
  {
    id: uuidv4(),
    name: 'Bruce Wayne',
    company: 'Wayne Enterprises',
    phone: '555-0188',
    status: 'Won',
    followUpDate: null,
    followUpTime: null,
    createdAt: daysAgo(30),
    updatedAt: daysAgo(21),
  },
  {
    id: uuidv4(),
    name: 'Regina Phalange',
    company: 'Phalange Inc',
    phone: '555-0134',
    status: 'Qualified',
    followUpDate: daysAgo(-1).split('T')[0], // tomorrow
    followUpTime: '10:00',
    createdAt: daysAgo(5),
    updatedAt: daysAgo(1),
  },
  {
    id: uuidv4(),
    name: 'Walter White',
    company: 'Gray Matter Tech',
    phone: '505-0101',
    status: 'Lost',
    followUpDate: null,
    followUpTime: null,
    createdAt: daysAgo(20),
    updatedAt: daysAgo(14),
  },
]

const discussions = [
  // Sarah Connor
  {
    id: uuidv4(),
    leadId: leads[0].id,
    note: 'Lead created via web form.',
    followUpDate: null,
    followUpTime: null,
    createdAt: daysAgo(6),
  },
  {
    id: uuidv4(),
    leadId: leads[0].id,
    note: 'Initial discovery call. They need a CRM for 50 reps. Pain points include dropping leads and no follow-up tracking.',
    followUpDate: null,
    followUpTime: null,
    createdAt: daysAgo(5),
  },
  {
    id: uuidv4(),
    leadId: leads[0].id,
    note: 'Sent pricing tier PDF. Said she would review with her boss.',
    followUpDate: now.toISOString().split('T')[0],
    followUpTime: '14:00',
    createdAt: daysAgo(2),
  },
  // Hank Scorpio
  {
    id: uuidv4(),
    leadId: leads[1].id,
    note: 'Inbound lead from website contact form.',
    followUpDate: null,
    followUpTime: null,
    createdAt: hoursAgo(2),
  },
  // Bill Lumbergh
  {
    id: uuidv4(),
    leadId: leads[2].id,
    note: 'Lead created.',
    followUpDate: null,
    followUpTime: null,
    createdAt: daysAgo(10),
  },
  {
    id: uuidv4(),
    leadId: leads[2].id,
    note: 'Left a voicemail with his assistant. Waiting for callback.',
    followUpDate: null,
    followUpTime: null,
    createdAt: daysAgo(7),
  },
  // Bruce Wayne
  {
    id: uuidv4(),
    leadId: leads[3].id,
    note: 'Lead created via partner referral.',
    followUpDate: null,
    followUpTime: null,
    createdAt: daysAgo(30),
  },
  {
    id: uuidv4(),
    leadId: leads[3].id,
    note: 'Demo call went great. They loved the kanban pipeline view.',
    followUpDate: null,
    followUpTime: null,
    createdAt: daysAgo(28),
  },
  {
    id: uuidv4(),
    leadId: leads[3].id,
    note: 'Contract signed! Sending welcome package.',
    followUpDate: null,
    followUpTime: null,
    createdAt: daysAgo(21),
  },
  // Regina Phalange
  {
    id: uuidv4(),
    leadId: leads[4].id,
    note: 'Cold outreach via LinkedIn. Responded positively.',
    followUpDate: null,
    followUpTime: null,
    createdAt: daysAgo(5),
  },
  {
    id: uuidv4(),
    leadId: leads[4].id,
    note: 'Qualification call done. Budget confirmed at $2k/mo. Moving to proposal stage next week.',
    followUpDate: daysAgo(-1).split('T')[0],
    followUpTime: '10:00',
    createdAt: daysAgo(1),
  },
  // Walter White
  {
    id: uuidv4(),
    leadId: leads[5].id,
    note: 'Reached out but he seems preoccupied with other business.',
    followUpDate: null,
    followUpTime: null,
    createdAt: daysAgo(20),
  },
  {
    id: uuidv4(),
    leadId: leads[5].id,
    note: 'No response after 3 follow-ups. Marking as lost.',
    followUpDate: null,
    followUpTime: null,
    createdAt: daysAgo(14),
  },
]

await initDb()
db.data.leads = leads
db.data.discussions = discussions
await db.write()
console.log(`✅ Seeded ${leads.length} leads and ${discussions.length} discussions`)
