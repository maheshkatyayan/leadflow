import { useState, useEffect, useRef } from 'react'
import { discussionsApi, leadsApi } from '../api'
import StatusBadge from './StatusBadge'
import { STATUSES, formatDiscussionTime, formatFollowUp, isOverdue, timeAgo } from '../utils'

export default function LeadTimeline({ lead, onClose, onUpdated }) {
  const [discussions, setDiscussions] = useState([])
  const [note, setNote] = useState('')
  const [setFollowUp, setSetFollowUp] = useState(false)
  const [followUpDate, setFollowUpDate] = useState('')
  const [followUpTime, setFollowUpTime] = useState('')
  const [saving, setSaving] = useState(false)
  const [statusOpen, setStatusOpen] = useState(false)
  const [loadingDiscussions, setLoadingDiscussions] = useState(true)
  const statusRef = useRef(null)

  useEffect(() => {
    loadDiscussions()
  }, [lead.id])

  useEffect(() => {
    function handleClick(e) {
      if (statusRef.current && !statusRef.current.contains(e.target)) {
        setStatusOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  async function loadDiscussions() {
    setLoadingDiscussions(true)
    try {
      const res = await discussionsApi.getByLead(lead.id)
      setDiscussions(res.data)
    } finally {
      setLoadingDiscussions(false)
    }
  }

  async function handleSaveNote(e) {
    e.preventDefault()
    if (!note.trim()) return
    setSaving(true)
    try {
      const payload = {
        note,
        followUpDate: setFollowUp ? followUpDate : null,
        followUpTime: setFollowUp ? followUpTime : null,
      }
      const res = await discussionsApi.create(lead.id, payload)
      setDiscussions(prev => [res.data, ...prev])
      setNote('')
      setSetFollowUp(false)
      setFollowUpDate('')
      setFollowUpTime('')

      // Update lead's follow-up in parent
      const updatedLead = {
        ...lead,
        lastNote: note,
        lastNoteAt: res.data.createdAt,
        followUpDate: setFollowUp ? followUpDate : lead.followUpDate,
        followUpTime: setFollowUp ? followUpTime : lead.followUpTime,
      }
      onUpdated(updatedLead)
    } finally {
      setSaving(false)
    }
  }

  async function handleStatusChange(status) {
    setStatusOpen(false)
    await leadsApi.update(lead.id, { status })
    onUpdated({ ...lead, status })
  }

  const overdue = isOverdue(lead)
  const followUpLabel = lead.followUpDate ? formatFollowUp(lead.followUpDate, lead.followUpTime) : null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box timeline-modal" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="timeline-header">
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <h2 style={{ margin: 0 }}>
                {lead.name}
                {lead.company && (
                  <span style={{ fontWeight: 400, color: '#666', fontSize: '0.85em', marginLeft: 6 }}>
                    ({lead.company})
                  </span>
                )}
              </h2>
            </div>
            {lead.phone && (
              <p style={{ margin: '4px 0 0', color: '#666', fontSize: 14 }}>📞 {lead.phone}</p>
            )}
          </div>

          {/* Status dropdown */}
          <div style={{ position: 'relative' }} ref={statusRef}>
            <button
              className="status-trigger"
              onClick={() => setStatusOpen(o => !o)}
            >
              <StatusBadge status={lead.status} />
              <span style={{ fontSize: 10, color: '#999', marginLeft: 2 }}>▾</span>
            </button>
            {statusOpen && (
              <div className="status-dropdown">
                {STATUSES.map(s => (
                  <button
                    key={s}
                    className={`status-option ${s === lead.status ? 'active' : ''}`}
                    onClick={() => handleStatusChange(s)}
                  >
                    {s === lead.status && <span style={{ marginRight: 6 }}>✓</span>}
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        {/* Follow-up notice */}
        {followUpLabel && (
          <div className={`followup-banner ${overdue ? 'overdue' : ''}`}>
            {overdue ? '🔴' : '📅'} Follow-up: <strong>{followUpLabel}</strong>
            {overdue && ' (Overdue)'}
          </div>
        )}

        {/* Discussion history */}
        <div className="timeline-body">
          {loadingDiscussions ? (
            <div style={{ textAlign: 'center', padding: 32, color: '#999' }}>Loading...</div>
          ) : discussions.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 32, color: '#bbb' }}>No discussions yet.</div>
          ) : (
            <div className="timeline-list">
              {discussions.map((d, i) => (
                <div key={d.id} className="timeline-item">
                  <div className={`timeline-dot ${i === 0 ? 'active' : ''}`} />
                  <div className="timeline-content">
                    <div className="timeline-time">
                      {formatDiscussionTime(d.createdAt)}
                      <span style={{ color: '#bbb', marginLeft: 8 }}>({timeAgo(d.createdAt)})</span>
                    </div>
                    <div className="timeline-note">{d.note}</div>
                    {d.followUpDate && (
                      <div className="timeline-followup">
                        📅 Follow-up set for: {formatFollowUp(d.followUpDate, d.followUpTime)}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Add note form */}
        <div className="timeline-footer">
          <form onSubmit={handleSaveNote}>
            <textarea
              placeholder="Log a new discussion..."
              value={note}
              onChange={e => setNote(e.target.value)}
              rows={3}
            />
            <div className="note-actions">
              <label className="followup-check">
                <input
                  type="checkbox"
                  checked={setFollowUp}
                  onChange={e => setSetFollowUp(e.target.checked)}
                />
                Set Follow-up
              </label>
              {setFollowUp && (
                <>
                  <input
                    type="date"
                    value={followUpDate}
                    onChange={e => setFollowUpDate(e.target.value)}
                    className="date-input"
                  />
                  <input
                    type="time"
                    value={followUpTime}
                    onChange={e => setFollowUpTime(e.target.value)}
                    className="date-input"
                  />
                </>
              )}
              <button
                type="submit"
                className="btn-primary"
                disabled={saving || !note.trim()}
                style={{ marginLeft: 'auto' }}
              >
                {saving ? 'Saving...' : 'Save Note'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
