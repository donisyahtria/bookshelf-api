/* eslint-disable no-plusplus */
// Import dependencies
const { nanoid } = require('nanoid');
const books = require('./books');

// Method to add new book
const addBookHandler = (request, h) => {
  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = request.payload;

  const bookId = nanoid(16);
  const finished = pageCount === readPage;
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  if (!name) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  const newBooks = {
    bookId,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  };

  books.push(newBooks);

  const isSuccess = books.filter((b) => b.bookId === bookId).length > 0;

  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId,
      },
    });
    response.code(201);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Catatan gagal ditambahkan',
  });
  response.code(500);
  return response;
};

// Method to get all books by read status
const getAllBooksByReadStatus = (isRead) => {
  const arrayBooks = [];
  if (isRead === '1') {
    for (let index = 0; index < books.length; index++) {
      const {
        bookId, name, publisher, reading,
      } = books[index];
      if (reading) {
        arrayBooks.push({
          id: bookId,
          name,
          publisher,
        });
      }
    }
  } else if (isRead === '0') {
    for (let index = 0; index < books.length; index++) {
      const {
        bookId, name, publisher, reading,
      } = books[index];
      if (!reading) {
        arrayBooks.push({
          id: bookId,
          name,
          publisher,
        });
      }
    }
  }
  return arrayBooks;
};

// Method to get all books by finished status
const getAllBooksByFinishedStatus = (isFinished) => {
  const arrayBooks = [];
  if (isFinished === '1') {
    for (let index = 0; index < books.length; index++) {
      const {
        bookId, name, publisher, finished,
      } = books[index];
      if (finished) {
        arrayBooks.push({
          id: bookId,
          name,
          publisher,
        });
      }
    }
  } else if (isFinished === '0') {
    for (let index = 0; index < books.length; index++) {
      const {
        bookId, name, publisher, finished,
      } = books[index];
      if (!finished) {
        arrayBooks.push({
          id: bookId,
          name,
          publisher,
        });
      }
    }
  }
  return arrayBooks;
};

// Method to get all books by contain name
const getAllBooksByContainName = (queryName) => {
  const arrayBooks = [];
  for (let index = 0; index < books.length; index++) {
    const { bookId, name, publisher } = books[index];
    if (name.toUpperCase().includes(queryName.toUpperCase())) {
      // eslint-disable-next-line no-console
      console.log('ooo');
      arrayBooks.push({
        id: bookId,
        name,
        publisher,
      });
    }
  }
  return arrayBooks;
};

// Get all books
const getAllBooks = () => {
  const arrayBooks = [];
  for (let index = 0; index < books.length; index++) {
    const { bookId, name, publisher } = books[index];
    arrayBooks.push({
      id: bookId,
      name,
      publisher,
    });
  }
  return arrayBooks;
};

// Method to get all books check query
const getAllBookByQueryHandler = (request, h) => {
  let dataRequired;

  const { reading, finished, name } = request.query;

  if (reading !== undefined) {
    dataRequired = getAllBooksByReadStatus(reading);
  } else if (finished !== undefined) {
    dataRequired = getAllBooksByFinishedStatus(finished);
  } else if (name !== undefined) {
    dataRequired = getAllBooksByContainName(name);
  } else {
    dataRequired = getAllBooks();
  }

  const response = h.response({
    status: 'success',
    data: {
      books: dataRequired,
    },
  });
  response.code(200);

  return response;
};

// Method to get book by id
const getBookByIdHandler = (request, h) => {
  const { bookId } = request.params;

  const book = books.filter((b) => b.bookId === bookId)[0];

  if (book !== undefined) {
    const changeKey = {
      ...book,
    };
    changeKey.id = changeKey.bookId;
    delete changeKey.bookId;

    const response = h.response({
      status: 'success',
      data: {
        book: changeKey,
      },
    });

    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });
  response.code(404);
  return response;
};

// Method to update book
const updateBookHandler = (request, h) => {
  const { bookId } = request.params;

  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = request.payload;
  const updatedAt = new Date().toISOString();

  if (!name) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  const index = books.findIndex((b) => b.bookId === bookId);

  if (index !== -1) {
    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      updatedAt,
    };

    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

// Method to delete book
const deleteBookHandler = (request, h) => {
  const { bookId } = request.params;

  const index = books.findIndex((b) => b.bookId === bookId);

  if (index !== -1) {
    books.splice(index, 1);
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

// Export all modules
module.exports = {
  addBookHandler,
  getAllBookByQueryHandler,
  getBookByIdHandler,
  updateBookHandler,
  deleteBookHandler,
};
