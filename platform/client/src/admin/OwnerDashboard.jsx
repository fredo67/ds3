import { useState, useEffect } from 'react'
import {
  Settings, Palette, Type, Image, Globe, Layers, Save, RefreshCw, Eye, ExternalLink
} from 'lucide-react'
import { api } from '../lib/api'
import { useSiteConfig } from '../hooks/useSiteConfig'
import { DOMAIN_CONFIG } from '../lib/constants'

export default function OwnerDashboard() {
  const { config, refreshConfig } = useSiteConfig()
  const [localConfig, setLocalConfig] = useState({})
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState('site')
  const [templates, setTemplates] = useState([])

  const domain = config?.['site.domain'] || DOMAIN_CONFIG.domain

  useEffect(() => {
    if (config) {
      setLocalConfig(config)
    }
  }, [config])

  useEffect(() => {
    api.getTemplates().then(setTemplates).catch(() => {})
  }, [])

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
