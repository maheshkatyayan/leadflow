import StatusBadge from './StatusBadge'
import { timeAgo, formatFollowUp, isOverdue, isToday } from '../utils'

export default function LeadCard({ lead, onClick, pinned = false }) {
  const overdue = isOverdue(lead)
  const today = isToday(lead.followUpDate)
  const followUpLabel = lead.followUpDate ? formatFollowUp(lead.followUpDate, lead.followUpTime) : null

  return (
    <div
      className={`lead-card ${pinned ? 'pinned' : ''} ${overdue ? 'overdue' : ''}`}
      onClick={onClick}
    >
      <div className="lead-card-main">
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="lead-name">
            {lead.name}
            {lead.company && (
              <span className="lead-company"> ({lead.company})</span>
            )}
          </div>
          {lead.lastNote && (
            <div className="lead-last-note">
              <span style={{ fontWeight: 600, color: '#555' }}>Last Note:</span>{' '}
              <span>{lead.lastNote.length > 80 ? lead.lastNote.slice(0, 80) + '...' : lead.lastNote}</span>
              {lead.lastNoteAt && (
                <span className="note-time"> {timeAgo(lead.lastNoteAt)}</span>
              )}
            </div>
          )}
        </div>
        <StatusBadge status={lead.status} />
      </div>

      {followUpLabel && (
        <div className={`card-followup ${overdue ? 'overdue-text' : today ? 'today-text' : ''}`}>
          {overdue ? '🔴 Overdue: ' : '⚠️ '}
          <strong>{overdue ? followUpLabel : `Follow-up ${today ? 'today' : ''} at ${followUpLabel.split(' at ')[1] || followUpLabel}`}</strong>
        </div>
      )}
    </div>
  )
}
