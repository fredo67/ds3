// Health vertical template config (e.g., health.ai, pharma.ai)
export const templateConfig = {
  'site.tagline': 'The definitive directory for AI-powered healthcare',
  'site.subtitle': 'Tracking the companies transforming medicine with artificial intelligence',
  'site.vertical': 'health',
  'design.template': 'corporate',
  'design.color_primary': '#10b981',
  'design.color_secondary': '#0891b2',
  'design.color_accent': '#f43f5e',
  'vertical.categories': JSON.stringify([
    'Diagnostics', 'Drug Discovery', 'Clinical Trials', 'Medical Imaging',
    'EHR/EMR', 'Telemedicine', 'Genomics', 'Mental Health'
  ]),
  'vertical.company_types': JSON.stringify([
    { value: 'healthtech', label: 'HealthTech' },
    { value: 'pharma', label: 'Pharma' },
    { value: 'startup', label: 'Startup' }
  ]),
  'stats.items': JSON.stringify([
    { value: '$45B', label: 'AI Healthcare Market' },
    { value: '500+', label: 'AI Medical Devices' },
    { value: '40%', label: 'Faster Drug Discovery' },
    { value: '90%+', label: 'Diagnostic Accuracy' }
  ]),
}
