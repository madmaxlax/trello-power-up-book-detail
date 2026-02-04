# Book Details for Trello 📚

A Trello Power-Up that lets you search for books and attach detailed information directly to your cards. Perfect for reading lists, research projects, book clubs, and educational planning.

![Book Details Power-Up](https://img.shields.io/badge/Trello-Power--Up-0052CC?style=flat&logo=trello) Build and Deploy status: [![Deploy to GitHub Pages](https://github.com/madmaxlax/trello-power-up-book-detail/actions/workflows/deploy.yml/badge.svg?branch=main)](https://github.com/madmaxlax/trello-power-up-book-detail/actions/workflows/deploy.yml)

## Features

### 🔍 Quick Book Search

- Search Google Books directly from any Trello card
- Find books by title, author, or ISBN
- Get instant results with book covers

### 📖 Rich Book Information

- Automatically attach book covers to cards
- Display author, title, and ISBN
- Link to full book details on Google Books
- Show book summaries on the card back

### 🎨 Beautiful Integration

- Card badges show which books are attached
- Expandable card section for full details
- Seamless Trello design integration
- One-click book management

## Installation

### For Workspace Admins

1. **Add the Power-Up to your workspace**
   - Go to a Trello board
   - Click "Power-Ups" in the menu
   - Search for "Book Details" or add via custom Power-Up
   - Click "Add"

2. **Configure (if using custom deployment)**
   - Go to [Trello Power-Ups Admin](https://trello.com/power-ups/admin)
   - Select your workspace
   - Click "Create new Power-Up"
   - Enter the connector URL: `https://madmaxlax.github.io/trello-power-up-book-detail/index.html`
   - Upload icon: `https://madmaxlax.github.io/trello-power-up-book-detail/book_icon.png`
   - Enable these capabilities:
     - Card Badges
     - Card Buttons
     - Card Back Section
     - Card Detail Badges

### For Board Members

Once added to your workspace, enable it on any board:

1. Open a board
2. Click "Power-Ups" → "Book Details"
3. Click "Enable"

## Usage

### Adding a Book to a Card

1. **Open any Trello card**
2. **Click the "Search for Book" button** (🔍 icon)
3. **Type the book title, author, or ISBN**
   - Results appear as you type
   - Powered by Google Books API
4. **Click on the book you want**
   - Book cover is automatically attached
   - Book details link is added
   - Badge appears on the card

### Viewing Book Details

**On the card front:**

- Badge shows book title and author
- Book cover appears as card cover image

**On the card back:**

- Expandable "Book Details" section
- Full book information:
  - Cover image
  - Title and author
  - ISBN number
  - Description/summary
  - Link to Google Books

### Changing or Removing a Book

1. **Open the card**
2. **Click "Change Book"** to search for a different book
3. **Or click "Remove book"** in the card back section to clear all book data

## Use Cases

### 📚 Reading Lists

Track your to-read list with book covers and descriptions right on your cards

### 🎓 Research & Study

Organize research materials and textbooks for projects or courses

### 👥 Book Clubs

Manage book selections with full details and easy access to more info

### 🏢 Team Libraries

Catalog team resources and recommended reading

### ✍️ Writing Projects

Track reference materials and research books for your writing

## Support

### Common Questions

**Q: Can I search multiple book databases?**
A: Currently powered by Google Books API. Open Library support is available in the codebase for future use.

**Q: Is my data private?**
A: All book data is stored in Trello's standard Power-Up storage. No external database is used.

**Q: Does this work offline?**
A: Book search requires internet connection, but attached book data persists offline.

**Q: Can I customize which book details are shown?**
A: Currently shows standard book info. Custom fields may be added in future updates.

### Report Issues

Found a bug or have a feature request?
[Open an issue on GitHub](https://github.com/madmaxlax/trello-power-up-book-detail/issues)

## For Developers

Want to contribute or run your own instance?

- **Development Guide**: See [AGENTS.md](./AGENTS.md) for complete technical documentation
- **Tech Stack**: Vite, vanilla JavaScript, Google Books API
- **Deployment**: GitHub Pages with automated CI/CD

```bash
npm install           # Install dependencies
npm run dev          # Start dev server at localhost:3000
npm run build        # Build for production
```

## Privacy & Data

- **No external database**: All data stored in Trello's Power-Up storage
- **No user tracking**: No analytics or tracking code
- **Public API**: Uses Google Books public API (subject to their terms)
- **Open source**: Full source code available for review

## Credits

Created by Max Struever

Built with:

- [Trello Power-Up API](https://developer.atlassian.com/cloud/trello/power-ups/)
- [Google Books API](https://developers.google.com/books)
- [Vite](https://vitejs.dev/)

## License

MIT License - see LICENSE file for details

---

**Made with ❤️ for book lovers who use Trello**

Happy reading! 📖✨
