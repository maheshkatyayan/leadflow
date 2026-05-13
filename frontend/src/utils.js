export const STATUSES = ['New', 'Contacted', 'Qualified', 'Proposal Sent', 'Won', 'Lost']

export const STATUS_STYLES = {
  New:           { bg: '#E8F5E9', color: '#2E7D32', dot: '#4CAF50' },
  Contacted:     { bg: '#E3F2FD', color: '#1565C0', dot: '#2196F3' },
  Qualified:     { bg: '#FFF3E0', color: '#E65100', dot: '#FF9800' },
  'Proposal Sent': { bg: '#F3E5F5', color: '#6A1B9A', dot: '#9C27B0' },
  Won:           { bg: '#E8F5E9', color: '#1B5E20', dot: '#388E3C' },
  Lost:          { bg: '#FAFAFA', color: '#757575', dot: '#9E9E9E' },
}

export function timeAgo(dateStr) {
  if (!dateStr) return ''
  const now = new Date()
  const date = new Date(dateStr)
  const diff = Math.floor((now - date) / 1000)

  if (diff < 60) return 'just now'
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`
  if (diff < 2592000) return `${Math.floor(diff / 604800)}w ago`
  return date.toLocaleDateString()
}

export function isToday(dateStr) {
  if (!dateStr) return false
  const today = new Date().toISOString().split('T')[0]
  return dateStr.split('T')[0] === today
}

export function isOverdue(lead) {
  if (!lead.followUpDate) return false
  const today = new Date().toISOString().split('T')[0]
  return lead.followUpDate < today
}

export function formatFollowUp(date, time) {
  if (!date) return null
  const d = new Date(`${date}T${time || '00:00'}`)
  const today = new Date().toISOString().split('T')[0]
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0]

  let prefix = date === today ? 'Today' : date === tomorrow ? 'Tomorrow' : d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  if (time) prefix += ` at ${formatTime(time)}`
  return prefix
}

function formatTime(t) {
  if (!t) return ''
  const [h, m] = t.split(':').map(Number)
  const ampm = h >= 12 ? 'PM' : 'AM'
  return `${h % 12 || 12}:${String(m).padStart(2, '0')} ${ampm}`
}

export function formatDiscussionTime(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return d.toLocaleString('en-US', {
    month: 'short', day: 'numeric',
    hour: 'numeric', minute: '2-digit',
    hour12: true
  })
}
