# Claude Code Context

For comprehensive project context, architecture, deployment information, and development guidelines, see:

👉 **[AGENTS.md](./AGENTS.md)**

## Quick Reference

This is a Trello Power-Up built with Vite and deployed via GitHub Actions to GitHub Pages.

**Key points for Claude Code**:
- All context is in AGENTS.md - read it first
- No backend server - purely client-side
- Environment variables use `VITE_` prefix
- Build system: Vite (non-minified output)
- Deployment: GitHub Actions → GitHub Pages (automatic on push to main)
- Don't commit: .env, dist/, node_modules/

## Common Commands

```bash
npm run dev      # Start dev server
npm run build    # Build to dist/
npm run lint     # Run ESLint
```

## Important Files

- `js/client.js` - Main Power-Up logic
- `js/book-api-provider.js` - API abstraction
- `vite.config.js` - Build configuration
- `.github/workflows/deploy.yml` - CI/CD pipeline
- `public/` - Static assets (copied to dist/)

---

📖 **For everything else, see [AGENTS.md](./AGENTS.md)**
