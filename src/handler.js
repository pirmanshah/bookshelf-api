const { nanoid } = require('nanoid');
const books = require('./books');
const sendResponse = require('./sendResponse');

const addBookHandler = (request, h) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;
  const id = nanoid(16);
  const finished = pageCount - readPage === 0;
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  if (!name) {
    return sendResponse(h, 'fail', 'Gagal menambahkan buku. Mohon isi nama buku', 400);
  }

  if (readPage > pageCount) {
    return sendResponse(h, 'fail', 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount', 400);
  }

  const newBook = {
    id,
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

  books.push(newBook);

  const isSuccess = books.filter((book) => book.id === id).length > 0;

  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    });
    response.code(201);
    return response;
  }
  return sendResponse(h, 'fail', 'Buku gagal ditambahkan', 500);
};

const getAllBooksHandler = (request, h) => {
  const { name, reading, finished } = request.query;

  const bookList = (books) => books.map((book) => ({
    id: book.id,
    name: book.name,
    publisher: book.publisher,
  }));

  if (name !== undefined) {
    const book = books.filter((book) => book.name.toLowerCase().includes(name.toLowerCase()));

    const response = h.response({
      status: 'success',
      data: {
        books: bookList(book),
      },
    });
    response.code(200);
    return response;
  }

  if (reading !== undefined) {
    const book = books.filter(
      (book) => Number(book.reading) === Number(reading),
    );

    const response = h.response({
      status: 'success',
      data: {
        books: bookList(book),
      },
    });
    response.code(200);
    return response;
  }

  if (finished !== undefined) {
    const book = books.filter((book) => Number(book.finished) === Number(finished));

    const response = h.response({
      status: 'success',
      data: {
        books: bookList(book),
      },
    });

    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'success',
    data: {
      books: bookList(books),
    },
  });

  response.code(200);
  return response;
};

const getBookByIdHandler = (request, h) => {
  const { bookId } = request.params;
  const book = books.filter((book) => book.id === bookId)[0];

  if (book !== undefined) {
    return {
      status: 'success',
      data: {
        book,
      },
    };
  }

  return sendResponse(h, 'fail', 'Buku tidak ditemukan', 404);
};

const editBookByIdHandler = (request, h) => {
  const { bookId } = request.params;
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;
  const updatedAt = new Date().toISOString();
  const index = books.findIndex((book) => book.id === bookId);

  if (!name) {
    return sendResponse(h, 'fail', 'Gagal memperbarui buku. Mohon isi nama buku', 400);
  }

  if (readPage > pageCount) {
    return sendResponse(h, 'fail', 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount', 400);
  }

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

    return sendResponse(h, 'success', 'Buku berhasil diperbarui', 200);
  }

  return sendResponse(h, 'fail', 'Gagal memperbarui buku. Id tidak ditemukan', 404);
};

const deleteBookByIdHandler = (request, h) => {
  const { bookId } = request.params;
  const index = books.findIndex((book) => book.id === bookId);

  if (index !== -1) {
    books.splice(index, 1);
    return sendResponse(h, 'success', 'Buku berhasil dihapus', 200);
  }

  return sendResponse(h, 'fail', 'Buku gagal dihapus. Id tidak ditemukan', 404);
};

module.exports = {
  addBookHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  editBookByIdHandler,
  deleteBookByIdHandler,
};
