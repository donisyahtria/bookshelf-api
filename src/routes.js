const {
  // eslint-disable-next-line max-len
  addBookHandler,
  getAllBookByQueryHandler,
  getBookByIdHandler,
  updateBookHandler,
  deleteBookHandler,
} = require('./handler');

// The routes
const routes = [
  {
    // Add new book route
    method: 'POST',
    path: '/books',
    handler: addBookHandler,
  },
  {
    // Get books by query route
    method: 'GET',
    path: '/books',
    handler: getAllBookByQueryHandler,
  },
  {
    // Get book by id route
    method: 'GET',
    path: '/books/{bookId}',
    handler: getBookByIdHandler,
  },
  {
    // Update book by id route
    method: 'PUT',
    path: '/books/{bookId}',
    handler: updateBookHandler,
  },
  {
    // Delete book by id route
    method: 'DELETE',
    path: '/books/{bookId}',
    handler: deleteBookHandler,
  },
];

// Export module routes
module.exports = routes;
