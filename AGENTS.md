# Book Details Trello Power-Up - Developer Context

This document provides comprehensive context about the Book Details Trello Power-Up for AI agents, future developers, and maintainers.

## Project Overview

**Purpose**: A Trello Power-Up that allows users to search for books (via Google Books API) and attach detailed book information directly to Trello cards.

**Status**: Active development, deployed via GitHub Pages

**Tech Stack**:
- **Build System**: Vite (for fast development and optimized production builds)
- **Language**: Vanilla JavaScript (ES6 modules)
- **APIs**: Google Books API, Trello Power-Up API
- **Deployment**: GitHub Actions → GitHub Pages
- **Package Manager**: npm
- **Node Version**: >=20.0.0

## Architecture

### Trello Power-Up Structure

This is a **client-side only** Trello Power-Up with no backend server. All code runs in the browser within Trello's iframe environment.

**Entry Point**: `index.html` - The connector file loaded by Trello when the Power-Up is enabled

**Key Files**:
- `js/client.js` - Main Power-Up initialization and capability definitions
- `js/book-api-provider.js` - Abstraction layer for book search APIs
- `search-books.html` - Search interface popup
- `card-back-section.html` - Card details section displaying book information

### Capabilities

The Power-Up registers these Trello capabilities:

1. **card-badges**: Shows book title/author badge on card front
2. **card-detail-badges**: Shows detailed badge on card detail view
3. **card-buttons**: "Search for Book" button on cards
4. **card-back-section**: Expandable section on card back showing full book details

### Data Flow

```
User clicks "Search for Book"
  → Opens search-books.html popup
  → User types query → BookAPIProvider.search()
  → Google Books API returns results
  → User selects book
  → Book data stored in t.set('card', 'shared', 'bookData')
  → Book cover attached to card
  → Info link attached to card
  → Badges/sections update automatically
```

### Book API Provider

The `BookAPIProvider` abstraction (`js/book-api-provider.js`) supports multiple book APIs:
- **Google Books** (active): Excellent search, requires API key
- **Open Library** (available): Free, no API key needed

To switch providers:
```javascript
BookAPIProvider.setProvider('openLibrary'); // or 'googleBooks'
```

## Build System & Deployment

### Vite Configuration

**Entry Points** (`vite.config.js`):
- `index.html` - Main connector
- `search-books.html` - Search popup
- `card-back-section.html` - Card detail section

**Build Settings**:
- Output: `dist/` directory
- Minification: **Disabled** for easier debugging in production
- CSS Minification: **Disabled**
- Base path: `./` (relative paths for GitHub Pages)

**Environment Variables**:
- Prefix: `VITE_*` (only these are exposed to client)
- `VITE_GOOGLE_BOOKS_API_KEY` - Google Books API key
- `VITE_TRELLO_APP_KEY` - Trello Power-Up app key

At build time, Vite replaces `import.meta.env.VITE_*` with actual values.

### GitHub Actions Workflow

**File**: `.github/workflows/deploy.yml`

**Triggers**:
- Push to `main` branch
- Manual workflow dispatch

**Steps**:
1. Checkout code
2. Setup Node.js 20
3. Install dependencies (`npm ci`)
4. Create `.env` from GitHub Secrets
5. Build with Vite (`npm run build`)
6. Deploy `dist/` folder to GitHub Pages

**Required GitHub Secrets**:
- `VITE_GOOGLE_BOOKS_API_KEY`
- `VITE_TRELLO_APP_KEY`

### Deployment URL Structure

```
https://<username>.github.io/<repo-name>/
  ├── index.html              (Connector)
  ├── search-books.html       (Search popup)
  ├── card-back-section.html  (Card section)
  ├── manifest.json           (Power-Up metadata)
  ├── book_icon.png           (Power-Up icon)
  ├── book.png                (Badge icon)
  ├── searchwithdoc.svg       (Search button icon)
  └── assets/
      ├── main-*.js           (Bundled client.js)
      ├── searchBooks-*.js    (Search functionality)
      └── cardBackSection-*.js (Card section code)
```

## File Structure

### Core Files

```
/
├── index.html                    # Trello connector (entry point)
├── search-books.html             # Book search popup
├── card-back-section.html        # Card back section UI
├── js/
│   ├── client.js                 # Main Power-Up logic
│   └── book-api-provider.js      # API abstraction layer
├── public/                       # Static assets (copied to dist/)
│   ├── manifest.json             # Power-Up metadata
│   ├── book_icon.png             # Main icon (37KB)
│   ├── book.png                  # Badge icon (11KB)
│   ├── searchwithdoc.svg         # Search button icon
│   └── searchicon.svg            # Alternative search icon
├── vite.config.js                # Build configuration
├── .env                          # Environment variables (gitignored)
├── .env.example                  # Template for .env
└── .github/workflows/deploy.yml  # GitHub Actions deployment
```

### Configuration Files

- `package.json` - Dependencies and scripts
- `.eslintrc.json` - ESLint config (ES modules enabled)
- `.gitignore` - Excludes .env, dist/, node_modules/
- `vite.config.js` - Build and dev server config

## Development Workflow

### Initial Setup

```bash
# Clone repository
git clone <repo-url>
cd trello-power-up-book-detail

# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Edit .env with your API keys
# VITE_GOOGLE_BOOKS_API_KEY=your_key_here
# VITE_TRELLO_APP_KEY=your_trello_app_key
```

### Development Commands

```bash
npm run dev      # Start Vite dev server at http://localhost:3000
npm run build    # Build for production to dist/
npm run preview  # Preview production build locally
npm run lint     # Run ESLint
npm run validate # Run validation script
npm run test     # Run both lint and validate
```

### Local Development with Trello

To test locally with Trello:

1. Run `npm run dev` (starts server at localhost:3000)
2. Use a tunneling service (ngrok, cloudflared, etc.) to expose localhost
3. In Trello Power-Ups admin, set Iframe connector URL to your tunnel URL

### Making Changes

1. **Edit source files** (not dist/)
2. **Test with `npm run dev`**
3. **Build with `npm run build`**
4. **Commit and push to `main`**
5. **GitHub Actions automatically deploys**

## Environment Variables

### Required Variables

**Development** (.env file):
```bash
VITE_GOOGLE_BOOKS_API_KEY=AIzaSy...
VITE_TRELLO_APP_KEY=61b098...
```

**Production** (GitHub Secrets):
- Go to repo Settings → Secrets and variables → Actions
- Add both variables as repository secrets
- GitHub Actions will inject them during build

### Getting API Keys

**Google Books API Key**:
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create/select project
3. Enable Books API
4. Create credentials → API Key
5. Restrict key to Books API

**Trello App Key**:
1. Go to [Trello Power-Ups Admin](https://trello.com/power-ups/admin)
2. Create new Power-Up or view existing
3. Copy the App Key

## Trello Power-Up Registration

### Initial Setup

1. Go to [Trello Power-Ups Admin](https://trello.com/power-ups/admin)
2. Select workspace
3. Click "Create new Power-Up"
4. Fill in:
   - **Name**: Book Details
   - **Iframe connector URL**: `https://<username>.github.io/<repo-name>/index.html`
   - **Icon URL**: `https://<username>.github.io/<repo-name>/book_icon.png`
5. Enable capabilities:
   - card-back-section
   - card-badges
   - card-buttons
   - card-detail-badges

### Updating After Changes

Push to `main` → GitHub Actions deploys → Changes appear in Trello (may need refresh)

No need to update Power-Up registration unless:
- Changing connector URL
- Adding new capabilities
- Changing icon

## Key Technical Patterns

### ES6 Modules

All JavaScript uses ES6 module syntax:
- `export` in source files
- `import` between modules
- `<script type="module">` in HTML
- Vite bundles modules for production

### Environment Variable Access

```javascript
// In source code:
const apiKey = import.meta.env.VITE_GOOGLE_BOOKS_API_KEY;

// Vite replaces at build time:
const apiKey = "AIzaSy...actual_key...";
```

### Trello Storage

```javascript
// Store data
t.set('card', 'shared', 'bookData', JSON.stringify(bookData));

// Retrieve data
t.get('card', 'shared', 'bookData').then(data => {
  const bookData = JSON.parse(data);
});
```

**Storage Limits**: 4096 characters per scope/visibility

### Icon Usage

- `GRAY_ICON` (book.png): Card badges showing book is attached
- `SEARCH_ICON` (searchwithdoc.svg): "Search for Book" button
- `book_icon.png`: Power-Up's main icon in Trello admin

## Common Tasks

### Add New Book API Provider

1. Add provider in `js/book-api-provider.js`:
```javascript
providers: {
  newProvider: {
    async search(query) {
      // Implementation
      return normalizedResults;
    }
  }
}
```

2. Switch provider:
```javascript
BookAPIProvider.setProvider('newProvider');
```

### Change Default Provider

Edit `js/book-api-provider.js`:
```javascript
activeProvider: 'openLibrary', // Change from 'googleBooks'
```

### Update Power-Up Icon

1. Replace `public/book_icon.png`
2. Push to `main`
3. Update icon URL in Trello admin

### Add New Capability

1. Add to `js/client.js`:
```javascript
TrelloPowerUp.initialize({
  'new-capability': function(t, options) {
    // Implementation
  }
});
```

2. Add to `public/manifest.json` capabilities array
3. Enable in Trello Power-Up admin

## Troubleshooting

### Build Issues

**Problem**: "import.meta is undefined"
- **Cause**: Code not loaded as ES module
- **Fix**: Ensure `<script type="module">` in HTML

**Problem**: Environment variables are `undefined`
- **Cause**: Missing VITE_ prefix or .env not loaded
- **Fix**: Check variable names start with `VITE_`

### Deployment Issues

**Problem**: GitHub Actions fails with "secrets not found"
- **Fix**: Add secrets in repo Settings → Secrets and variables → Actions

**Problem**: Power-Up shows old code after push
- **Fix**: Hard refresh Trello (Cmd+Shift+R), or wait for CDN cache

### Power-Up Issues

**Problem**: "Power-Up failed to load"
- **Check**: Connector URL is correct and accessible
- **Check**: No console errors in browser DevTools

**Problem**: API calls failing
- **Check**: API keys are correct in GitHub Secrets
- **Check**: Google Books API is enabled
- **Check**: No rate limiting

## Resources

- [Trello Power-Ups Documentation](https://developer.atlassian.com/cloud/trello/power-ups/)
- [Vite Documentation](https://vitejs.dev/)
- [Google Books API](https://developers.google.com/books)
- [GitHub Pages Documentation](https://docs.github.com/en/pages)

## Notes

- **No Backend**: This is entirely client-side
- **No Authentication**: Uses public APIs (rate-limited)
- **No Database**: All data stored in Trello's Power-Up storage
- **Non-Minified**: Code is readable in production for easier debugging
- **Legacy Files**: `examples/` directory contains template examples (unused)
