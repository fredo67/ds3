// DS3 Static Configuration — set at deploy time by D3 admins

export const DOMAIN_CONFIG = {
  // The domain name
  domain: 'military.ai',

  // URLs
  rootDomainUrl: 'https://military.ai',
  mainSiteUrl: '/',
  domaAppUrl: 'https://app.doma.xyz',
  domaClaimUrl: 'https://app.doma.xyz/subdomain-claim/software.ai',
  // TODO: Change to 'https://app.doma.xyz/subdomain-claim/military.ai' once live
  domaTokenUrl: 'https://app.doma.xyz',
  domaPlatformUrl: 'https://doma.xyz',

  // Registrar (backend infrastructure — not consumer-facing)
  registrar: 'Interstellar.xyz',
  registrarUrl: 'https://interstellar.xyz',
  registrarApiUrl: 'https://api.interstellar.xyz',
  ianaId: '3784',
  ianaVerifyUrl: 'https://www.iana.org/assignments/registrar-ids/registrar-ids.xhtml',

  // Fractional settings
  maxFractionPercent: 49,
}

// Shorthand exports for convenience
export const ROOT_DOMAIN_URL = DOMAIN_CONFIG.rootDomainUrl
export const MAIN_SITE_URL = DOMAIN_CONFIG.mainSiteUrl
export const DOMA_APP_URL = DOMAIN_CONFIG.domaAppUrl
export const DOMA_CLAIM_URL = DOMAIN_CONFIG.domaClaimUrl
export const DOMA_TOKEN_URL = DOMAIN_CONFIG.domaTokenUrl
export const DOMA_PLATFORM_URL = DOMAIN_CONFIG.domaPlatformUrl
export const BASE_DOMAIN = DOMAIN_CONFIG.domain
