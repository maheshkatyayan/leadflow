import { useState, useEffect, useCallback } from 'react'
import { leadsApi } from './api'
import LeadCard from './components/LeadCard'
import LeadTimeline from './components/LeadTimeline'
import AddLeadModal from './components/AddLeadModal'
import { STATUSES, isToday } from './utils'

const FILTERS = ['All', ...STATUSES]

export default function App() {
  const [leads, setLeads] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('All')
  const [search, setSearch] = useState('')
  const [selectedLead, setSelectedLead] = useState(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [error, setError] = useState('')

  const fetchLeads = useCallback(async () => {
    try {
      const params = {}
      if (filter !== 'All') params.status = filter
      if (search.trim()) params.search = search.trim()
      const res = await leadsApi.getAll(params)
      setLeads(res.data)
      setError('')
    } catch (err) {
      setError('Could not connect to server. Is the backend running?')
    } finally {
      setLoading(false)
    }
  }, [filter, search])

  useEffect(() => {
    setLoading(true)
    const t = setTimeout(fetchLeads, search ? 300 : 0)
    return () => clearTimeout(t)
  }, [fetchLeads])

  const todayLeads = leads.filter(l => isToday(l.followUpDate))
  const otherLeads = leads.filter(l => !isToday(l.followUpDate))

  function handleLeadUpdated(updated) {
    setLeads(prev => prev.map(l => l.id === updated.id ? { ...l, ...updated } : l))
    setSelectedLead(updated)
  }

  function handleLeadAdded(newLead) {
    setLeads(prev => [{ ...newLead, lastNote: 'Lead created.', lastNoteAt: newLead.createdAt }, ...prev])
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="logo">
          <span className="logo-icon">↗</span>
          LeadFlow
        </div>
        <button className="btn-primary add-btn" onClick={() => setShowAddModal(true)}>
          + Add New Lead
        </button>
      </header>

      <main className="app-main">
        <div className="search-bar">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search leads by name or company..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {search && (
            <button className="clear-search" onClick={() => setSearch('')}>×</button>
          )}
        </div>

        <div className="filter-row">
          <span className="filter-label">FILTERS:</span>
          <div className="filter-tabs">
            {FILTERS.map(f => (
              <button
                key={f}
                className={`filter-tab ${filter === f ? 'active' : ''}`}
                onClick={() => setFilter(f)}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {error && <div className="error-banner">⚠️ {error}</div>}

        {loading ? (
          <div className="loading-state">
            <div className="spinner" />
            <p>Loading leads...</p>
          </div>
        ) : (
          <>
            {todayLeads.length > 0 && (
              <section className="section">
                <h3 className="section-title">🚀 Today's Follow-ups</h3>
                <div className="lead-list">
                  {todayLeads.map(lead => (
                    <LeadCard key={lead.id} lead={lead} pinned onClick={() => setSelectedLead(lead)} />
                  ))}
                </div>
              </section>
            )}

            <section className="section">
              {todayLeads.length > 0 && <h3 className="section-title">All Leads</h3>}
              {otherLeads.length === 0 && todayLeads.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">📋</div>
                  <p>{search ? 'No leads match your search.' : 'No leads yet. Add your first lead!'}</p>
                  {!search && (
                    <button className="btn-primary" onClick={() => setShowAddModal(true)}>
                      + Add New Lead
                    </button>
                  )}
                </div>
              ) : (
                <div className="lead-list">
                  {otherLeads.map(lead => (
                    <LeadCard key={lead.id} lead={lead} onClick={() => setSelectedLead(lead)} />
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </main>

      {selectedLead && (
        <LeadTimeline
          lead={selectedLead}
          onClose={() => setSelectedLead(null)}
          onUpdated={handleLeadUpdated}
        />
      )}
      {showAddModal && (
        <AddLeadModal
          onClose={() => setShowAddModal(false)}
          onAdded={handleLeadAdded}
        />
      )}
    </div>
  )
}
