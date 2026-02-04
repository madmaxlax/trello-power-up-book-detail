/**
 * Book API Provider Abstraction
 *
 * Provides a unified interface for different book search APIs.
 * Makes it easy to switch between providers or try multiple sources.
 */

const BookAPIProvider = {
  // Current active provider
  activeProvider: 'googleBooks', // Options: 'googleBooks', 'openLibrary'

  // API Key for Google Books
  googleBooksApiKey: 'AIzaSyBnkwx6tm6DCQxC2gSkvI62J0F7Mq0FGzM',

  /**
   * Search for books using the active provider
   * @param {string} query - Search query
   * @returns {Promise<Array>} - Array of normalized book results
   */
  async search(query) {
    const provider = this.providers[this.activeProvider];
    if (!provider) {
      throw new Error(`Unknown provider: ${this.activeProvider}`);
    }
    return provider.search.call(this, query);
  },

  /**
   * Provider implementations
   */
  providers: {
    /**
     * Google Books API Provider
     * Uses generic search with excellent fuzzy matching
     */
    googleBooks: {
      async search(query) {
        // Generic search works great - supports title, author, mixed queries, and even typos!
        const searchQuery = encodeURIComponent(query);
        const url = `https://www.googleapis.com/books/v1/volumes?q=${searchQuery}&key=${this.googleBooksApiKey}&maxResults=20`;

        const response = await fetch(url);
        const data = await response.json();

        if (!data.items || data.items.length === 0) {
          return [];
        }

        return data.items.map(item => {
          const volumeInfo = item.volumeInfo;
          return {
            id: item.id,
            title: volumeInfo.title || 'Unknown Title',
            author: volumeInfo.authors ? volumeInfo.authors.join(', ') : 'Unknown',
            cover: volumeInfo.imageLinks?.thumbnail || '',
            summary: volumeInfo.description || 'No description available.',
            isbn: volumeInfo.industryIdentifiers
              ? (volumeInfo.industryIdentifiers.find(id => id.type === 'ISBN_13')?.identifier ||
                volumeInfo.industryIdentifiers[0]?.identifier)
              : 'No ISBN available',
            infoLink: volumeInfo.infoLink || `https://books.google.com/books?id=${item.id}`,
            provider: 'googleBooks'
          };
        });
      }
    },

    /**
     * Open Library API Provider
     */
    openLibrary: {
      async search(query) {
        const url = `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=20`;

        const response = await fetch(url);
        const data = await response.json();

        if (!data.docs || data.docs.length === 0) {
          return [];
        }

        return data.docs.map(doc => {
          const coverUrl = doc.cover_i
            ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-M.jpg`
            : '';

          const isbn = doc.isbn && doc.isbn.length > 0
            ? (doc.isbn.find(i => i.length === 13) || doc.isbn[0])
            : 'No ISBN available';

          const workId = doc.key ? doc.key.split('/').pop() : doc.key;

          return {
            id: workId || doc.key,
            title: doc.title || 'Unknown Title',
            author: doc.author_name ? doc.author_name.join(', ') : 'Unknown',
            cover: coverUrl,
            summary: doc.first_sentence ? doc.first_sentence.join(' ') : 'No description available.',
            isbn: isbn,
            infoLink: `https://openlibrary.org${doc.key}`,
            provider: 'openLibrary'
          };
        });
      }
    }
  },

  /**
   * Switch to a different provider
   * @param {string} providerName - Name of provider ('googleBooks' or 'openLibrary')
   */
  setProvider(providerName) {
    if (!this.providers[providerName]) {
      throw new Error(`Unknown provider: ${providerName}`);
    }
    this.activeProvider = providerName;
    console.log(`Switched to ${providerName} provider`);
  },

  /**
   * Get current provider name
   */
  getProvider() {
    return this.activeProvider;
  }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = BookAPIProvider;
}
