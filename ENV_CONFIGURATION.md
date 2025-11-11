# Environment Configuration Guide

## Required Environment Variables

Create a `.env.local` file in your project root with the following variables:

```bash
# ========================================
# CMS Configuration
# ========================================

# CMS Provider: baserow, sanity, airtable, contentful, strapi
CMS_PROVIDER=baserow

# API Configuration
CMS_API_URL=https://your-cms-api.com
CMS_API_TOKEN=your_api_token_here

# Project/Database ID (required for Airtable and Sanity)
CMS_PROJECT_ID=your_project_id

# Dataset (required for Sanity)
CMS_DATASET=production

# ========================================
# Cache Configuration
# ========================================

# Enable/disable caching (default: true)
CMS_CACHE_ENABLED=true

# Cache time in seconds (default: 3600 = 1 hour)
CMS_CACHE_TIME=3600

# Maximum cache size (default: 1000 entries)
CMS_CACHE_MAX_SIZE=1000

# Stale-while-revalidate time in seconds (default: 3600)
CMS_STALE_WHILE_REVALIDATE=3600

# ========================================
# Retry Configuration
# ========================================

# Number of retry attempts for failed requests (default: 3)
CMS_RETRY_ATTEMPTS=3

# Initial retry delay in milliseconds (default: 1000)
CMS_RETRY_DELAY=1000

# Maximum retry delay in milliseconds (default: 10000)
CMS_RETRY_MAX_DELAY=10000

# Backoff multiplier for exponential backoff (default: 2)
CMS_RETRY_BACKOFF_MULTIPLIER=2

# ========================================
# Timeout Configuration
# ========================================

# Request timeout in milliseconds (default: 15000 = 15 seconds)
CMS_TIMEOUT=15000

# ========================================
# Feature Flags
# ========================================

# Enable circuit breaker (default: true)
CMS_ENABLE_CIRCUIT_BREAKER=true

# Enable error reporting (default: true)
CMS_ENABLE_ERROR_REPORTING=true

# Enable debug logging (default: false)
CMS_ENABLE_DEBUG_LOGGING=false

# ========================================
# Revalidation
# ========================================

# Secret for revalidation API endpoint (generate a random string)
REVALIDATION_SECRET=your_random_secret_here

# ========================================
# Legacy Baserow Configuration (optional)
# ========================================

# These are used as fallbacks if CMS_* variables are not set
BASEROW_API_URL=https://api.baserow.io
BASEROW_API_TOKEN=your_baserow_token
BASEROW_CACHE_TIME=3600
```

## Provider-Specific Examples

### Baserow

```bash
CMS_PROVIDER=baserow
CMS_API_URL=https://api.baserow.io
CMS_API_TOKEN=your_baserow_token
```

### Sanity

```bash
CMS_PROVIDER=sanity
CMS_API_URL=https://your-project.api.sanity.io
CMS_PROJECT_ID=your_project_id
CMS_DATASET=production
CMS_API_TOKEN=your_sanity_token
```

### Airtable

```bash
CMS_PROVIDER=airtable
CMS_API_URL=https://api.airtable.com/v0
CMS_API_TOKEN=your_airtable_token
CMS_PROJECT_ID=your_base_id
```

## Deployment

For production deployment (e.g., Vercel), set these variables in your hosting platform's environment variable settings.

