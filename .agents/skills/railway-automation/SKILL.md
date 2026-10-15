---
name: railway-automation
description: Automates cloud infrastructure, deployment, and service management on Railway using the Railway CLI and GraphQL v2 API with anti-Cloudflare browser simulation headers. Use when deploying web apps, inspecting Railway logs, managing environment variables, or automating Railway workflows.
---

# Railway Cloud Automation & Deployment Guide

This skill equips agents with end-to-end capabilities to control and deploy projects to Railway via both CLI and the GraphQL v2 Backboard API.

## 1. Authentication & Credentials
- **Account API Token:** `273969db-0b99-4da5-b3c0-3c35e90f665e`
- **Default Workspace ID:** `e5a04dd7-40fe-471c-900c-0e7489de677f`
- **Account Name:** `Kkkk` (`tkdunglamclon14@gmail.com`)
- **GraphQL Endpoint:** `https://backboard.railway.com/graphql/v2`

Environment Variables:
```powershell
$env:RAILWAY_API_TOKEN = "273969db-0b99-4da5-b3c0-3c35e90f665e"
$env:RAILWAY_TOKEN = "273969db-0b99-4da5-b3c0-3c35e90f665e"
```

## 2. Railway CLI Commands (Headless Workflow)
- **Check Login:** `railway whoami`
- **Initialize Project:** `railway init`
- **Link Existing Project:** `railway link`
- **Deploy Source:** `railway up --detach`
- **View Live Logs:** `railway logs`
- **Create Public Domain:** `railway domain`
- **Environment Variables:** `railway variables --set "KEY=VALUE"`

## 3. Railway GraphQL API (Anti-Cloudflare Browser Simulation)
When calling Railway GraphQL API programmatically, ALWAYS include browser emulation headers to prevent HTTP 403 (Cloudflare Error 1010):

```python
HEADERS = {
    "Content-Type": "application/json",
    "Authorization": f"Bearer {TOKEN}",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
    "Accept": "application/json",
    "Origin": "https://railway.com",
    "Referer": "https://railway.com/",
}
```

## 4. Reusable Tool Utilities
- Python Helper: `tools/railway/railway_helper.py` or `scripts/railway_helper.py`
  - Usage: `python tools/railway/railway_helper.py whoami`
  - Usage: `python tools/railway/railway_helper.py projects`
  - Usage: `python tools/railway/railway_helper.py create-project <name>`
- PowerShell Helper: `tools/railway/RailwayHelper.ps1`
