# DS3 — DomainSponsor 3.0

The third generation of domain monetization. Turn any domain from a "parked page paying renewal fees" into a multi-layer revenue generator — without giving up control, without giving up your parking provider, and without waiting for a single buyer.

## The Three Generations

- **Gen 1 (DomainSponsor/Oversee):** Domain → Google ads → rev share. Dead.
- **Gen 2 (Park Logic/Above/Taku):** Domain → AI-routed waterfall → RSOC + direct advertisers. Under pressure.
- **Gen 3 (DS3):** Domain → full namespace exploitation. Root parks. Subdomains sell. Fractions trade. Directories generate leads. Agents resolve endpoints. All simultaneously.

**Core thesis:** Ownership and usage are separate. A domain isn't a page to park. It's a namespace to operate.

## Live Demo

- **Platform:** https://app.doma.xyz
- **Example Site:** https://military.ai.hsu.to (www2.military.ai demo)

## Six Revenue Layers

| Layer | Description | Owner Control |
|-------|-------------|---------------|
| **Layer 0** | Registration & Tokenization (Micro Vault + DOMA) | Full |
| **Layer 1** | Root Monetization (@ and www) — parking compatible | Unchanged |
| **Layer 2** | Subdomain Commerce (*.domain) — DOMA claims | New/Additive |
| **Layer 3** | Fractional Ownership (up to 49%) — DOMA token | New/Additive |
| **Layer 4** | Content/Directory Site — vertical-specific | New/Additive |
| **Layer 5** | Agent Namespace — agentic web infrastructure | Future |

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    app.doma.xyz                          │
│           (The ONE product destination)                  │
│                                                         │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌───────────┐  │
│  │  Micro   │ │  DS3     │ │  DOMA    │ │  Name     │  │
│  │  Vault   │ │  Site    │ │  Trading │ │  Token    │  │
│  │  Connect │ │  Custom- │ │  Frac-   │ │  Sales    │  │
│  │  Portfo- │ │  izer +  │ │  tional  │ │  (.sol    │  │
│  │  lio     │ │  Owner   │ │  Owner-  │ │  etc.)    │  │
│  │          │ │  Dash    │ │  ship    │ │           │  │
│  └────┬─────┘ └────┬─────┘ └────┬─────┘ └─────┬─────┘  │
│       │            │            │              │         │
│  ┌────┴────────────┴────────────┴──────────────┴─────┐  │
│  │          Interstellar Reseller API                │  │
│  │    (ICANN registrar backend — IANA #3784)         │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

## Tech Stack

- **Frontend:** React 18 + Vite + Tailwind CSS
- **Backend:** Node.js + Express
- **Database:** SQLite (sql.js) → PostgreSQL for production
- **Auth:** JWT-based (bcryptjs)
- **Charts:** Recharts
- **Icons:** Lucide React
- **Fonts:** Rajdhani (display), Inter (body), JetBrains Mono (mono)

## Project Structure

```
ds3/
├── platform/                    # Core DS3 platform
│   ├── client/                  # React frontend
│   │   ├── src/
│   │   │   ├── components/      # Shared UI components
│   │   │   ├── pages/           # Public pages
│   │   │   ├── admin/           # Admin dashboard
│   │   │   ├── owner/           # Owner dashboard components
│   │   │   ├── hooks/           # Custom hooks (useSiteConfig)
│   │   │   └── lib/             # API client, constants
│   │   └── package.json
│   ├── server/                  # Express backend
│   │   ├── routes/              # API routes (public, admin, owner)
│   │   ├── middleware/          # Auth middleware
│   │   ├── db/                  # Schema + seed
│   │   └── package.json
│   └── package.json             # Root workspace
├── templates/                   # Vertical-specific configs
│   ├── defense/                 # military.ai
│   ├── finance/                 # credit.ai, mortgage.ai
│   ├── legal/                   # legal.ai
│   ├── tech/                    # developer.ai, software.ai
│   └── generic/                 # Catch-all
└── docs/                        # Documentation
```

## Quick Start

```bash
# Clone
git clone https://github.com/fredo67/ds3.git
cd ds3/platform

# Install
npm install

# Seed database (defense template)
npm run seed -- --template=defense

# Development
npm run dev
# Frontend: http://localhost:5173
# API: http://localhost:3001
```

## Design Templates

| Template | Best For | Style |
|----------|----------|-------|
| `command-center` | Defense, cyber, space | Dark, tactical, HUD-style |
| `corporate` | Finance, legal, insurance | Clean, professional |
| `minimal` | Tech, SaaS, developer tools | Ultra-clean, whitespace |
| `bold` | Consumer, media, entertainment | High contrast, dramatic |
| `editorial` | News, research, analysis | Magazine-style |

## DNS Architecture

```
{domain} DNS Zone:

@          →  Owner's lander (parking/BIN — owner control)
www        →  Owner's lander (same)
www2       →  DS3 app server (directory + CRM)
{company}  →  DS3 app server (subdomain microsites)
api        →  DS3 app server (agent endpoints)
*          →  DS3 app server (wildcard)

Three simultaneous revenue layers:
  Layer 1 (@ + www):     Parking → any provider
  Layer 2 (subdomains):  DOMA claims → verified presences
  Layer 3 (fractional):  DOMA token → trading fees
```

## Owner Self-Service

Domain owners customize their site from app.doma.xyz without touching code:

1. **Connect portfolio** via Micro Vault (GoDaddy, Dynadot, Namecheap, etc.)
2. **Pick template** from visual gallery
3. **Upload logo** and set brand colors
4. **Toggle features** on/off
5. **Set BIN price** and contact info
6. **Site deploys** automatically to www2.{domain}

## What DS3 Achieves

- **For domain investors:** Multi-layer revenue without giving up control or parking
- **For parking companies:** New revenue on subdomains they don't monetize
- **For the industry:** DomainSponsor 3.0 — the guy who built Gen 1 is building Gen 3
- **For the agentic web:** Infrastructure for agent-addressable domains
- **For DOMA:** Product layer that makes DOMA accessible to domainers

---

Built for [DOMA](https://doma.xyz) | [D3.com](https://d3.com) | [Interstellar.xyz](https://interstellar.xyz)
