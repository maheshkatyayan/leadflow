import { useState } from 'react'
import { leadsApi } from '../api'

export default function AddLeadModal({ onClose, onAdded }) {
  const [name, setName] = useState('')
  const [company, setCompany] = useState('')
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    if (!name.trim()) return setError('Full name is required')
    setLoading(true)
    setError('')
    try {
      const res = await leadsApi.create({ name, company, phone })
      onAdded(res.data)
      onClose()
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create lead')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()} style={{ maxWidth: 440 }}>
        <div className="modal-header">
          <h2>Add New Lead</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '24px' }}>
          <div className="field">
            <label>Full Name <span style={{ color: '#e53e3e' }}>*</span></label>
            <input
              type="text"
              placeholder="e.g., John Doe"
              value={name}
              onChange={e => setName(e.target.value)}
              autoFocus
            />
          </div>
          <div className="field">
            <label>Company <span style={{ color: '#999', fontWeight: 400 }}>(Optional)</span></label>
            <input
              type="text"
              placeholder="e.g., Stark Industries"
              value={company}
              onChange={e => setCompany(e.target.value)}
            />
          </div>
          <div className="field">
            <label>Phone <span style={{ color: '#999', fontWeight: 400 }}>(Optional)</span></label>
            <input
              type="text"
              placeholder="e.g., 555-0123"
              value={phone}
              onChange={e => setPhone(e.target.value)}
            />
          </div>

          {error && <p style={{ color: '#e53e3e', fontSize: 13, margin: '0 0 12px' }}>{error}</p>}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 8 }}>
            <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Saving...' : 'Save Lead'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
