/* global TrelloPowerUp */

// we can access Bluebird Promises as follows
var Promise = TrelloPowerUp.Promise;

/*

Trello Data Access

The following methods show all allowed fields, you only need to include those you want.
They all return promises that resolve to an object with the requested fields.

Get information about the current board
t.board('id', 'name', 'url', 'shortLink', 'members')

Get information about the current list (only available when a specific list is in context)
So for example available inside 'attachment-sections' or 'card-badges' but not 'show-settings' or 'board-buttons'
t.list('id', 'name', 'cards')

Get information about all open lists on the current board
t.lists('id', 'name', 'cards')

Get information about the current card (only available when a specific card is in context)
So for example available inside 'attachment-sections' or 'card-badges' but not 'show-settings' or 'board-buttons'
t.card('id', 'name', 'desc', 'due', 'closed', 'cover', 'attachments', 'members', 'labels', 'url', 'shortLink', 'idList')

Get information about all open cards on the current board
t.cards('id', 'name', 'desc', 'due', 'closed', 'cover', 'attachments', 'members', 'labels', 'url', 'shortLink', 'idList')

Get information about the current active Trello member
t.member('id', 'fullName', 'username')

For access to the rest of Trello's data, you'll need to use the RESTful API. This will require you to ask the
user to authorize your Power-Up to access Trello on their behalf. We've included an example of how to
do this in the `🔑 Authorization Capabilities 🗝` section at the bottom.

*/

/*

Storing/Retrieving Your Own Data

Your Power-Up is afforded 4096 chars of space per scope/visibility
The following methods return Promises.

Storing data follows the format: t.set('scope', 'visibility', 'key', 'value')
With the scopes, you can only store data at the 'card' scope when a card is in scope
So for example in the context of 'card-badges' or 'attachment-sections', but not 'board-badges' or 'show-settings'
Also keep in mind storing at the 'organization' scope will only work if the active user is a member of the team

Information that is private to the current user, such as tokens should be stored using 'private' at the 'member' scope

t.set('organization', 'private', 'key', 'value');
t.set('board', 'private', 'key', 'value');
t.set('card', 'private', 'key', 'value');
t.set('member', 'private', 'key', 'value');

Information that should be available to all users of the Power-Up should be stored as 'shared'

t.set('organization', 'shared', 'key', 'value');
t.set('board', 'shared', 'key', 'value');
t.set('card', 'shared', 'key', 'value');
t.set('member', 'shared', 'key', 'value');

If you want to set multiple keys at once you can do that like so

t.set('board', 'shared', { key: value, extra: extraValue });

Reading back your data is as simple as

t.get('organization', 'shared', 'key');

Or want all in scope data at once?

t.getAll();

*/

var GRAY_ICON = 'https://cdn.glitch.global/2757198c-0a15-451b-9f67-1ae65b9ba93b/book-open-thin-svgrepo-com.svg?v=1738893407137';

// Helper function to safely parse book data
var parseBookData = function(data) {
  if (!data) return null;
  try {
    return typeof data === 'string' ? JSON.parse(data) : data;
  } catch (e) {
    console.error('Failed to parse bookData:', e, data);
    return null;
  }
};

var getBadges = function (t) {
  return t.get('card', 'shared', 'bookData').then(function (bookData) {
    bookData = parseBookData(bookData);

    if (!bookData) {
      return [];
    }
    return [{
      title: 'Book Details: ',
      text: bookData.title + ' by ' + bookData.author,
      icon: GRAY_ICON,
      color: null
    }];
  })
};
// We need to call initialize to get all of our capability handles set up and registered with Trello
TrelloPowerUp.initialize({
  'card-badges': function (t, options) {
    return getBadges(t);
  },
  'card-detail-badges': function (t, options) {
    return getBadges(t);
  },

  'card-back-section': function (t, options) {
    return t.get('card', 'shared', 'bookData').then(function (bookData) {
      bookData = parseBookData(bookData);
      let sectionTitle = '';

      if (!bookData) {
        sectionTitle = 'No book selected';
      }
      else sectionTitle = 'Book Attached: ' + bookData.title;

      return {
        title: sectionTitle,
        icon: GRAY_ICON, // Must be a gray icon, colored icons not allowed.
        content: {
          type: 'iframe',
          url: t.signUrl('./card-back-section.html', { bookData: bookData }),
          height: 230 // Max height is 500
        }
      };
    });
  },
  'card-buttons': function (t, options) {
    return t.get('card', 'shared', 'bookData').then(function (bookData) {
      bookData = parseBookData(bookData);

      return [
        {
          icon: GRAY_ICON,
          text: bookData ? 'Change Book' : 'Search for Book',
          callback: (t) => t.popup({
            title: 'Search for Book',
            url: './search-books.html',
          })
        }
      ];
    })
  },
}, {
  appKey: import.meta.env.VITE_TRELLO_APP_KEY,
  appName: 'Book detail'
});

console.log('Loaded by: ' + document.referrer);
