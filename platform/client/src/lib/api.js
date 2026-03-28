const API_BASE = '/api'

async function fetchApi(endpoint, options = {}) {
  const token = localStorage.getItem('auth_token')

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }))
    throw new Error(error.message || 'Request failed')
  }

  return response.json()
}

export const api = {
  // ============ Public API ============

  // Config
  getConfig: () => fetchApi('/config'),

  // Listings
  getListings: (params = {}) => {
    const query = new URLSearchParams(params).toString()
    return fetchApi(`/listings${query ? `?${query}` : ''}`)
  },
  getListing: (slug) => fetchApi(`/listings/${slug}`),

  // Subdomains
  getSubdomains: (params = {}) => {
    const query = new URLSearchParams(params).toString()
    return fetchApi(`/subdomains${query ? `?${query}` : ''}`)
  },
  getSubdomain: (subdomain) => fetchApi(`/subdomains/${subdomain}`),

  // Articles
  getArticles: (params = {}) => {
    const query = new URLSearchParams(params).toString()
    return fetchApi(`/articles${query ? `?${query}` : ''}`)
  },
  getArticle: (slug) => fetchApi(`/articles/${slug}`),

  // Leads
  submitLead: (data) => fetchApi('/leads', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  // Stats
  getStats: () => fetchApi('/stats'),

  // Context
  getContext: () => fetchApi('/context'),

  // ============ Admin API ============

  // Auth
  login: (email, password) => fetchApi('/admin/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  }),
  verifyAuth: () => fetchApi('/admin/verify'),

  // Dashboard
  getAdminStats: () => fetchApi('/admin/dashboard'),

  // Leads (admin)
  getLeads: (params = {}) => {
    const query = new URLSearchParams(params).toString()
    return fetchApi(`/admin/leads${query ? `?${query}` : ''}`)
  },
  updateLead: (id, data) => fetchApi(`/admin/leads/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  }),
  deleteLead: (id) => fetchApi(`/admin/leads/${id}`, { method: 'DELETE' }),

  // Listings (admin)
  createListing: (data) => fetchApi('/admin/listings', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  updateListing: (id, data) => fetchApi(`/admin/listings/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  }),
  deleteListing: (id) => fetchApi(`/admin/listings/${id}`, { method: 'DELETE' }),

  // Outbound
  getOutbound: (params = {}) => {
    const query = new URLSearchParams(params).toString()
    return fetchApi(`/admin/outbound${query ? `?${query}` : ''}`)
  },
  createOutbound: (data) => fetchApi('/admin/outbound', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  updateOutbound: (id, data) => fetchApi(`/admin/outbound/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  }),
  deleteOutbound: (id) => fetchApi(`/admin/outbound/${id}`, { method: 'DELETE' }),

  // Analytics
  getAnalytics: () => fetchApi('/admin/analytics'),

  // ============ Owner API ============

  // Owner Dashboard
  getOwnerDashboard: () => fetchApi('/owner/dashboard'),

  // Config
  getOwnerConfig: () => fetchApi('/owner/config'),
  updateConfig: (data) => fetchApi('/owner/config', {
    method: 'PATCH',
    body: JSON.stringify(data),
  }),
  resetConfig: (section) => fetchApi(`/owner/config/reset${section ? `/${section}` : ''}`, {
    method: 'POST',
  }),

  // Templates
  getTemplates: () => fetchApi('/owner/templates'),

  // File Upload
  uploadFile: async (file, type) => {
    const formData = new FormData()
    formData.append('file', file)
    if (type) formData.append('type', type)

    const token = localStorage.getItem('auth_token')
    const response = await fetch(`${API_BASE}/owner/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    })

    if (!response.ok) {
      throw new Error('Upload failed')
    }

    return response.json()
  },
  deleteFile: (filename) => fetchApi(`/owner/upload/${filename}`, { method: 'DELETE' }),
}

export default api
