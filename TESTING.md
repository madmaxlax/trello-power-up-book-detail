# Trello Power-Up Testing Guide

This guide covers validation and testing approaches for the Book Detail Power-Up.

## Automated Validation

### 1. Run Validation Script

```bash
npm run validate
```

This checks:
- ✅ Required files exist (index.html, client.js)
- ✅ TrelloPowerUp.initialize() is called
- ✅ App key and name are configured
- ✅ Power-Up client library is loaded
- ✅ Iframe pages properly initialize TrelloPowerUp.iframe()
- ⚠️ Security: API keys in client-side code
- ⚠️ Security: Potential XSS vulnerabilities
- ℹ️ Design token usage

### 2. Run Linter

```bash
npm run lint
```

Checks JavaScript code quality and catches common errors.

### 3. Run All Checks

```bash
npm test
```

Runs both validation and linting.

## Manual Testing Checklist

### Initial Setup

- [ ] Power-Up loads without console errors
- [ ] Power-Up appears in board's Power-Ups menu
- [ ] Icon displays correctly

### Card Button Functionality

- [ ] "Search for Book" button appears on cards without book data
- [ ] "Change Book" button appears on cards with book data
- [ ] Button opens search popup

### Search Books Page

- [ ] Search input is pre-filled with card name
- [ ] Typing 3+ characters triggers search
- [ ] "Searching for books..." loading state appears
- [ ] Search results display as clickable buttons
- [ ] "No books found" shows for empty results
- [ ] Error message displays if API fails
- [ ] Clicking a book result:
  - [ ] Attaches book info link to card
  - [ ] Attaches book cover image
  - [ ] Sets book cover as card cover
  - [ ] Stores book data in card
  - [ ] Closes popup

### Card Back Section

- [ ] Shows "No book selected" when no book attached
- [ ] Displays book details when book is attached:
  - [ ] Book cover image with border
  - [ ] Book title
  - [ ] Author name
  - [ ] Link to Google Books (opens in new tab)
  - [ ] Book description
- [ ] "Remove book" button clears book data
- [ ] "Refresh" button reloads book data
- [ ] Section resizes properly (t.sizeTo works)

### Card Badges

- [ ] Badge shows on card front when book attached
- [ ] Badge displays book title and author
- [ ] Badge uses book icon

### Theme Support

- [ ] Power-Up displays correctly in light mode
- [ ] Power-Up displays correctly in dark mode
- [ ] Colors use Atlassian design tokens
- [ ] Hover states work properly

### Error Handling

- [ ] Invalid JSON in stored data doesn't crash Power-Up
- [ ] Missing book cover image doesn't break layout
- [ ] API timeout shows error message
- [ ] Malformed API response handled gracefully

## Browser Testing

Test in browsers supported by Trello:
- [ ] Chrome/Edge (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)

## Performance Testing

- [ ] Search results appear within 2 seconds
- [ ] Typing in search doesn't lag
- [ ] Card back section loads quickly
- [ ] No memory leaks (test with multiple cards)

## Security Validation

### API Key Security

1. Check Google Cloud Console:
   - [ ] API key has HTTP referrer restrictions
   - [ ] Allowed referrers: `trello.com/*`, `*.trello.com/*`
   - [ ] API key is restricted to Google Books API only

### XSS Prevention

- [ ] Book titles with HTML entities display correctly
- [ ] Author names with special characters work
- [ ] Descriptions with HTML don't execute scripts

## Trello Developer Tools

Use the [Trello Developer Power-Up](https://github.com/rwjdk/trello-developer-power-up) to:
- View card IDs
- Inspect stored data
- Debug Power-Up capabilities

## Common Issues

### Issue: Power-Up not loading
**Solution**: Check console for CORS errors, verify URL in Trello admin

### Issue: Search not working
**Solution**: Check API key, verify network requests in DevTools

### Issue: Book data not persisting
**Solution**: Check `t.set()` calls return promises, verify data size < 4096 chars

### Issue: Styles look wrong
**Solution**: Verify power-up.min.css is loaded, check design token fallbacks

### Issue: Dark mode colors incorrect
**Solution**: Use design tokens instead of hardcoded colors

## Resources

- [Trello Power-Ups Documentation](https://developer.atlassian.com/cloud/trello/power-ups/)
- [Your First Power-Up Guide](https://developer.atlassian.com/cloud/trello/guides/power-ups/your-first-power-up/)
- [Power-Up Client Library Reference](https://developer.atlassian.com/cloud/trello/power-ups/client-library/)
- [Public Power-Up Guidelines](https://developer.atlassian.com/cloud/trello/guides/power-ups/public-power-up-guidelines/)
- [Design Token Documentation](https://developer.atlassian.com/cloud/trello/power-ups/color-theme-compliance/using-atlassian-design-tokens/)
