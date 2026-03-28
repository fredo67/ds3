import { useState, useEffect, createContext, useContext } from 'react'
import { api } from '../lib/api'

const SiteConfigContext = createContext({})

export function SiteConfigProvider({ children }) {
  const [config, setConfig] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.getConfig().then(data => {
      setConfig(data)
      applyTheme(data)
      setLoading(false)
    }).catch(() => {
      // Use defaults if API fails
      setConfig(getDefaultConfig())
      setLoading(false)
    })
  }, [])

  const updateConfig = async (updates) => {
    const newConfig = { ...config, ...updates }
    setConfig(newConfig)
    applyTheme(newConfig)
    // Persist to server
    await api.updateConfig(updates)
  }

  return (
    <SiteConfigContext.Provider value={{ config, loading, setConfig, updateConfig }}>
      {children}
    </SiteConfigContext.Provider>
  )
}

export function useSiteConfig() {
  return useContext(SiteConfigContext)
}

function applyTheme(config) {
  if (!config) return

  const root = document.documentElement

  // Apply colors
  root.style.setProperty('--color-background', config['design.color_background'] || '#0a0a0f')
  root.style.setProperty('--color-surface', config['design.color_surface'] || '#12121a')
  root.style.setProperty('--color-border', config['design.color_border'] || '#1a1a2e')
  root.style.setProperty('--color-primary', config['design.color_primary'] || '#00d4ff')
  root.style.setProperty('--color-secondary', config['design.color_secondary'] || '#0066ff')
  root.style.setProperty('--color-accent', config['design.color_accent'] || '#ff3366')
  root.style.setProperty('--color-success', config['design.color_success'] || '#00ff88')
  root.style.setProperty('--color-text', config['design.color_text'] || '#e0e0e0')
  root.style.setProperty('--color-text-secondary', config['design.color_text_secondary'] || '#888899')

  // Apply fonts
  const fontDisplay = config['design.font_display'] || 'Rajdhani'
  const fontBody = config['design.font_body'] || 'Inter'
  const fontMono = config['design.font_mono'] || 'JetBrains Mono'

  root.style.setProperty('--font-display', fontDisplay)
  root.style.setProperty('--font-body', fontBody)
  root.style.setProperty('--font-mono', fontMono)

  // Load Google Fonts dynamically if not already loaded
  const fonts = [fontDisplay, fontBody, fontMono]
  const fontUrl = `https://fonts.googleapis.com/css2?family=${fonts.map(f => f.replace(/ /g, '+')).join('&family=')}&display=swap`

  // Check if font link already exists
  const existingLink = document.querySelector(`link[href*="fonts.googleapis.com"]`)
  if (existingLink) {
    existingLink.href = fontUrl
  } else {
    const link = document.createElement('link')
    link.href = fontUrl
    link.rel = 'stylesheet'
    document.head.appendChild(link)
  }
}

function getDefaultConfig() {
  return {
    'site.domain': 'military.ai',
    'site.display_name': 'MILITARY.AI',
    'site.tagline': 'The namespace for the future of battlespaces',
    'site.subtitle': 'Tracking the companies, contracts, and technologies reshaping modern warfare',
    'site.vertical': 'defense',
    'design.template': 'command-center',
    'design.color_background': '#0a0a0f',
    'design.color_surface': '#12121a',
    'design.color_border': '#1a1a2e',
    'design.color_primary': '#00d4ff',
    'design.color_secondary': '#0066ff',
    'design.color_accent': '#ff3366',
    'design.color_success': '#00ff88',
    'design.color_text': '#e0e0e0',
    'design.color_text_secondary': '#888899',
    'design.font_display': 'Rajdhani',
    'design.font_body': 'Inter',
    'design.font_mono': 'JetBrains Mono',
    'features.parking': 'true',
    'features.subdomains': 'true',
    'features.fractional': 'true',
    'features.directory': 'true',
    'features.agent_namespace': 'true',
    'features.intelligence': 'true',
    'features.three_layer_model': 'true',
  }
}

export default useSiteConfig
