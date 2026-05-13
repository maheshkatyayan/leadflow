import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
})

export const leadsApi = {
  getAll: (params = {}) => api.get('/leads', { params }),
  create: (data) => api.post('/leads', data),
  update: (id, data) => api.patch(`/leads/${id}`, data),
  delete: (id) => api.delete(`/leads/${id}`),
}

export const discussionsApi = {
  getByLead: (leadId) => api.get(`/leads/${leadId}/discussions`),
  create: (leadId, data) => api.post(`/leads/${leadId}/discussions`, data),
}

export default api
