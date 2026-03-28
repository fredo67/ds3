import { useState, useEffect } from 'react'
import {
  Settings, Palette, Type, Image, Globe, Layers, Save, RefreshCw, Eye, ExternalLink,
  BarChart3, DollarSign, Users, Inbox, TrendingUp, Upload, X
} from 'lucide-react'
import { api } from '../lib/api'
import { useSiteConfig } from '../hooks/useSiteConfig'
import { DOMAIN_CONFIG, DOMA_APP_URL } from '../lib/constants'

export default function OwnerDashboard() {
  const { config, refreshConfig } = useSiteConfig()
  const [localConfig, setLocalConfig] = useState({})
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')
  const [templates, setTemplates] = useState([])
  const [dashboardData, setDashboardData] = useState(null)
  const [uploading, setUploading] = useState(false)

  const domain = config?.['site.domain'] || DOMAIN_CONFIG.domain

  useEffect(() => {
    if (config) {
      setLocalConfig(config)
    }
  }, [config])

  useEffect(() => {
    api.getTemplates().then(setTemplates).catch(() => {})
    api.getOwnerDashboard().then(setDashboardData).catch(() => {})
  }, [])

  const handleFileUpload = async (e, configKey) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const result = await api.uploadFile(file)
      handleChange(configKey, result.url)
    } catch (err) {
      alert('Failed to upload file')
    } finally {
      setUploading(false)
    }
  }

  const handleChange = (key, value) => {
    setLocalConfig(prev => ({ ...prev, [key]: value }))
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await api.updateConfig(localConfig)
      await refreshConfig()
      alert('Configuration saved!')
    } catch (err) {
      alert('Failed to save configuration')
    } finally {
      setSaving(false)
    }
  }

  const handleReset = async (section) => {
    if (!confirm(`Reset ${section} settings to defaults?`)) return

    try {
      await api.resetConfig(section)
      await refreshConfig()
      alert(`${section} settings reset!`)
    } catch (err) {
      alert('Failed to reset configuration')
    }
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'site', label: 'Site Settings', icon: Globe },
    { id: 'design', label: 'Design', icon: Palette },
    { id: 'copy', label: 'Copy', icon: Type },
    { id: 'features', label: 'Features', icon: Layers },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display font-bold text-2xl text-white">Owner Dashboard</h1>
        <div className="flex items-center gap-3">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 border border-border text-gray-400 rounded-lg hover:bg-border flex items-center gap-2"
          >
            <Eye className="w-4 h-4" />
            Preview Site
          </a>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 bg-primary text-background font-bold rounded-lg hover:bg-primary/90 disabled:opacity-50 flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-border">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`
              flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 -mb-px transition-colors
              ${activeTab === tab.id
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-400 hover:text-white'
              }
            `}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="bg-surface rounded-lg border border-border p-6">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <h2 className="font-bold text-lg text-white">Domain Overview</h2>

            {/* Revenue Cards */}
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-background rounded-lg border border-border p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Parking Revenue</p>
                    <p className="text-white font-mono font-bold">{dashboardData?.revenue?.parking || '—'}</p>
                  </div>
                </div>
                <p className="text-xs text-gray-500">Connect your parking provider for unified view</p>
              </div>

              <div className="bg-background rounded-lg border border-border p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
                    <Globe className="w-5 h-5 text-secondary" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Subdomain Revenue</p>
                    <p className="text-white font-mono font-bold">{dashboardData?.revenue?.subdomains || '$0'}</p>
                  </div>
                </div>
                <a href={DOMA_APP_URL} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline">
                  View on DOMA →
                </a>
              </div>

              <div className="bg-background rounded-lg border border-border p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-success" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Fractional Fees</p>
                    <p className="text-white font-mono font-bold">{dashboardData?.revenue?.fractional || '$0'}</p>
                  </div>
                </div>
                <a href={DOMA_APP_URL} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline">
                  View on DOMA →
                </a>
              </div>
            </div>

            {/* Stats Row */}
            <div className="grid md:grid-cols-4 gap-4">
              <div className="bg-background rounded-lg border border-border p-4 text-center">
                <p className="text-3xl font-bold font-mono text-white">{dashboardData?.leads?.total || 0}</p>
                <p className="text-gray-400 text-sm">Total Leads</p>
              </div>
              <div className="bg-background rounded-lg border border-border p-4 text-center">
                <p className="text-3xl font-bold font-mono text-accent">{dashboardData?.leads?.acquisition || 0}</p>
                <p className="text-gray-400 text-sm">Acquisition Inquiries</p>
              </div>
              <div className="bg-background rounded-lg border border-border p-4 text-center">
                <p className="text-3xl font-bold font-mono text-secondary">{dashboardData?.subdomains?.claimed || 0}</p>
                <p className="text-gray-400 text-sm">Subdomains Claimed</p>
              </div>
              <div className="bg-background rounded-lg border border-border p-4 text-center">
                <p className="text-3xl font-bold font-mono text-success">{dashboardData?.subdomains?.available || 0}</p>
                <p className="text-gray-400 text-sm">Available</p>
              </div>
            </div>

            {/* BIN Price */}
            <div className="bg-background rounded-lg border border-accent/30 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm mb-1">Current BIN Price</p>
                  <p className="text-2xl font-bold font-mono text-white">{dashboardData?.binPrice || 'Not set'}</p>
                </div>
                <button
                  onClick={() => setActiveTab('site')}
                  className="px-4 py-2 border border-border text-gray-400 rounded-lg hover:bg-border text-sm"
                >
                  Edit BIN Price
                </button>
              </div>
            </div>

            {/* Recent Leads */}
            <div>
              <h3 className="font-bold text-white mb-3">Recent Leads</h3>
              {dashboardData?.recentLeads?.length > 0 ? (
                <div className="space-y-2">
                  {dashboardData.recentLeads.slice(0, 5).map(lead => (
                    <div key={lead.id} className="flex items-center justify-between p-3 bg-background rounded-lg border border-border">
                      <div className="flex items-center gap-3">
                        <Inbox className="w-4 h-4 text-gray-400" />
                        <div>
                          <p className="text-white text-sm">{lead.contact_name || lead.email}</p>
                          <p className="text-gray-500 text-xs">{lead.lead_type} • {new Date(lead.created_at).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded ${
                        lead.status === 'new' ? 'bg-primary/20 text-primary' :
                        lead.status === 'contacted' ? 'bg-secondary/20 text-secondary' :
                        'bg-border text-gray-400'
                      }`}>
                        {lead.status}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">No leads yet</p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'site' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-lg text-white">Site Settings</h2>
              <button
                onClick={() => handleReset('site')}
                className="text-gray-400 hover:text-white text-sm flex items-center gap-1"
              >
                <RefreshCw className="w-4 h-4" /> Reset
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Domain</label>
                <input
                  type="text"
                  value={localConfig['site.domain'] || ''}
                  onChange={(e) => handleChange('site.domain', e.target.value)}
                  className="w-full px-4 py-2 bg-background border border-border rounded-lg text-white"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Display Name</label>
                <input
                  type="text"
                  value={localConfig['site.display_name'] || ''}
                  onChange={(e) => handleChange('site.display_name', e.target.value)}
                  className="w-full px-4 py-2 bg-background border border-border rounded-lg text-white"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Tagline</label>
                <input
                  type="text"
                  value={localConfig['site.tagline'] || ''}
                  onChange={(e) => handleChange('site.tagline', e.target.value)}
                  className="w-full px-4 py-2 bg-background border border-border rounded-lg text-white"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Vertical</label>
                <select
                  value={localConfig['site.vertical'] || ''}
                  onChange={(e) => handleChange('site.vertical', e.target.value)}
                  className="w-full px-4 py-2 bg-background border border-border rounded-lg text-white"
                >
                  <option value="defense">Defense</option>
                  <option value="finance">Finance</option>
                  <option value="legal">Legal</option>
                  <option value="tech">Tech</option>
                  <option value="generic">Generic</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm text-gray-400 mb-1">Subtitle</label>
                <input
                  type="text"
                  value={localConfig['site.subtitle'] || ''}
                  onChange={(e) => handleChange('site.subtitle', e.target.value)}
                  className="w-full px-4 py-2 bg-background border border-border rounded-lg text-white"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Contact Email</label>
                <input
                  type="email"
                  value={localConfig['site.contact_email'] || ''}
                  onChange={(e) => handleChange('site.contact_email', e.target.value)}
                  className="w-full px-4 py-2 bg-background border border-border rounded-lg text-white"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">BIN Price</label>
                <input
                  type="text"
                  value={localConfig['domain.bin_price'] || ''}
                  onChange={(e) => handleChange('domain.bin_price', e.target.value)}
                  className="w-full px-4 py-2 bg-background border border-border rounded-lg text-white"
                  placeholder="$500,000"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'design' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-lg text-white">Design Settings</h2>
              <button
                onClick={() => handleReset('design')}
                className="text-gray-400 hover:text-white text-sm flex items-center gap-1"
              >
                <RefreshCw className="w-4 h-4" /> Reset
              </button>
            </div>

            {/* Branding */}
            <div>
              <label className="block text-sm text-gray-400 mb-3">Branding</label>
              <div className="grid md:grid-cols-2 gap-4">
                {/* Logo Upload */}
                <div className="p-4 border border-border rounded-lg">
                  <p className="text-xs text-gray-500 mb-2">Logo</p>
                  {localConfig['design.logo_url'] ? (
                    <div className="relative">
                      <img
                        src={localConfig['design.logo_url']}
                        alt="Logo"
                        className="h-16 object-contain bg-background rounded p-2"
                      />
                      <button
                        onClick={() => handleChange('design.logo_url', '')}
                        className="absolute top-0 right-0 p-1 bg-accent/20 text-accent rounded-full hover:bg-accent/30"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <label className="flex items-center justify-center gap-2 p-4 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary/50">
                      <Upload className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-400 text-sm">{uploading ? 'Uploading...' : 'Upload Logo'}</span>
                      <input
                        type="file"
                        accept="image/png,image/jpeg,image/svg+xml,image/webp"
                        onChange={(e) => handleFileUpload(e, 'design.logo_url')}
                        className="hidden"
                        disabled={uploading}
                      />
                    </label>
                  )}
                </div>

                {/* Favicon Upload */}
                <div className="p-4 border border-border rounded-lg">
                  <p className="text-xs text-gray-500 mb-2">Favicon</p>
                  {localConfig['design.favicon_url'] ? (
                    <div className="relative inline-block">
                      <img
                        src={localConfig['design.favicon_url']}
                        alt="Favicon"
                        className="w-8 h-8 object-contain bg-background rounded p-1"
                      />
                      <button
                        onClick={() => handleChange('design.favicon_url', '')}
                        className="absolute -top-1 -right-1 p-1 bg-accent/20 text-accent rounded-full hover:bg-accent/30"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <label className="flex items-center justify-center gap-2 p-4 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary/50">
                      <Upload className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-400 text-sm">{uploading ? 'Uploading...' : 'Upload Favicon'}</span>
                      <input
                        type="file"
                        accept="image/png,image/svg+xml,image/x-icon"
                        onChange={(e) => handleFileUpload(e, 'design.favicon_url')}
                        className="hidden"
                        disabled={uploading}
                      />
                    </label>
                  )}
                  <p className="text-xs text-gray-500 mt-2">32x32 or 64x64 recommended</p>
                </div>
              </div>
            </div>

            {/* Template Selection */}
            <div>
              <label className="block text-sm text-gray-400 mb-3">Template</label>
              <div className="grid md:grid-cols-3 gap-4">
                {templates.map(template => (
                  <button
                    key={template.id}
                    onClick={() => handleChange('design.template', template.id)}
                    className={`
                      p-4 rounded-lg border text-left transition-colors
                      ${localConfig['design.template'] === template.id
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-gray-500'
                      }
                    `}
                  >
                    <h4 className="font-bold text-white mb-1">{template.name}</h4>
                    <p className="text-gray-400 text-xs mb-2">{template.description}</p>
                    <p className="text-gray-500 text-xs">{template.bestFor}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Colors */}
            <div>
              <label className="block text-sm text-gray-400 mb-3">Colors</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { key: 'design.color_primary', label: 'Primary' },
                  { key: 'design.color_secondary', label: 'Secondary' },
                  { key: 'design.color_accent', label: 'Accent' },
                  { key: 'design.color_success', label: 'Success' },
                  { key: 'design.color_background', label: 'Background' },
                  { key: 'design.color_surface', label: 'Surface' },
                  { key: 'design.color_border', label: 'Border' },
                  { key: 'design.color_text', label: 'Text' },
                ].map(color => (
                  <div key={color.key}>
                    <label className="block text-xs text-gray-500 mb-1">{color.label}</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={localConfig[color.key] || '#000000'}
                        onChange={(e) => handleChange(color.key, e.target.value)}
                        className="w-10 h-10 rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value={localConfig[color.key] || ''}
                        onChange={(e) => handleChange(color.key, e.target.value)}
                        className="flex-1 px-2 py-1 bg-background border border-border rounded text-white text-sm font-mono"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Fonts */}
            <div>
              <label className="block text-sm text-gray-400 mb-3">Typography</label>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Display Font</label>
                  <input
                    type="text"
                    value={localConfig['design.font_display'] || ''}
                    onChange={(e) => handleChange('design.font_display', e.target.value)}
                    className="w-full px-4 py-2 bg-background border border-border rounded-lg text-white"
                    placeholder="Rajdhani"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Body Font</label>
                  <input
                    type="text"
                    value={localConfig['design.font_body'] || ''}
                    onChange={(e) => handleChange('design.font_body', e.target.value)}
                    className="w-full px-4 py-2 bg-background border border-border rounded-lg text-white"
                    placeholder="Inter"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Mono Font</label>
                  <input
                    type="text"
                    value={localConfig['design.font_mono'] || ''}
                    onChange={(e) => handleChange('design.font_mono', e.target.value)}
                    className="w-full px-4 py-2 bg-background border border-border rounded-lg text-white"
                    placeholder="JetBrains Mono"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'copy' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-lg text-white">Copy Settings</h2>
              <button
                onClick={() => handleReset('copy')}
                className="text-gray-400 hover:text-white text-sm flex items-center gap-1"
              >
                <RefreshCw className="w-4 h-4" /> Reset
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Hero Tagline</label>
                <input
                  type="text"
                  value={localConfig['copy.hero_tagline'] || ''}
                  onChange={(e) => handleChange('copy.hero_tagline', e.target.value)}
                  className="w-full px-4 py-2 bg-background border border-border rounded-lg text-white"
                  placeholder="Leave empty for default"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Hero Subtitle</label>
                <textarea
                  rows={2}
                  value={localConfig['copy.hero_subtitle'] || ''}
                  onChange={(e) => handleChange('copy.hero_subtitle', e.target.value)}
                  className="w-full px-4 py-2 bg-background border border-border rounded-lg text-white resize-none"
                  placeholder="Leave empty for default"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Footer Text</label>
                <input
                  type="text"
                  value={localConfig['copy.footer_text'] || ''}
                  onChange={(e) => handleChange('copy.footer_text', e.target.value)}
                  className="w-full px-4 py-2 bg-background border border-border rounded-lg text-white"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'features' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-lg text-white">Feature Toggles</h2>
              <button
                onClick={() => handleReset('features')}
                className="text-gray-400 hover:text-white text-sm flex items-center gap-1"
              >
                <RefreshCw className="w-4 h-4" /> Reset
              </button>
            </div>

            <div className="space-y-3">
              {[
                { key: 'features.parking', label: 'Parking Revenue Layer', desc: 'Show parking revenue information' },
                { key: 'features.subdomains', label: 'Subdomain Commerce', desc: 'Enable subdomain claims via DOMA' },
                { key: 'features.fractional', label: 'Fractional Ownership', desc: 'Show fractional trading layer' },
                { key: 'features.directory', label: 'Company Directory', desc: 'Display company listings' },
                { key: 'features.intelligence', label: 'Intelligence/Blog', desc: 'Show news and articles section' },
                { key: 'features.three_layer_model', label: 'Three Layer Model', desc: 'Display revenue layers on homepage' },
                { key: 'features.who_should_own', label: 'Who Should Own', desc: 'Show target acquirer section' },
              ].map(feature => (
                <label
                  key={feature.key}
                  className="flex items-start gap-3 p-3 rounded-lg hover:bg-background cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={localConfig[feature.key] !== 'false'}
                    onChange={(e) => handleChange(feature.key, e.target.checked ? 'true' : 'false')}
                    className="mt-1 w-4 h-4"
                  />
                  <div>
                    <p className="text-white font-medium">{feature.label}</p>
                    <p className="text-gray-400 text-sm">{feature.desc}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
