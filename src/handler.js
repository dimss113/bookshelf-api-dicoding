const { nanoid } = require('nanoid');
const books = require('./books');
const { addBookValidation } = require('./validation');
const { responseData } = require('./helper');

const addBookHandler = async (request, h) => { 
  const validate = await addBookValidation(request, h);

  if (validate) {
    return h.response(responseData('fail', 'Gagal menambahkan buku. Mohon isi nama buku')).code(400);
  }

  const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;
  const id = nanoid(16);

  if (readPage > pageCount) {
    return h.response(responseData('fail', 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount')).code(400);
  }

  const finished = pageCount === readPage;

  const insertedAt = new Date().toISOString();

  const updatedAt = insertedAt;

  const newBook = {
    id, name, year, author, summary, publisher, pageCount, readPage, reading, finished, insertedAt, updatedAt,
  };

  books.push(newBook);

  const isSuccess = books.filter((book) => book.id === id).length > 0;

  if (isSuccess) {
    return h.response(responseData('success', 'Buku berhasil ditambahkan', { bookId: id })).code(201);
  }

  return h.response(responseData('fail', 'Buku gagal ditambahkan')).code(500);
  
}


const getAllBooksHandler = (request, h) => { 

  const { name, reading, finished } = request.query;

  if (books.length < 1) {
    return h.response({
      status: 'success',
      data: {
        books: [],
      },
    }).code(200);
  }

  if (name !== undefined) {
    const filteredBooks = books.filter((book) => book.name.toLowerCase().includes(name.toLowerCase()));
    const bookList = filteredBooks.map((book) => ({
      id: book.id,
      name: book.name,
      publisher: book.publisher,
    }));

    return h.response({
      status: 'success',
      data: {
        books: bookList,
      },
    }).code(200);
  }

  if (reading !== undefined) {
    const filteredBooks = books.filter((book) => book.reading === !!parseInt(reading, 10));
    const bookList = filteredBooks.map((book) => ({
      id: book.id,
      name: book.name,
      publisher: book.publisher,
    }));

    return h.response({
      status: 'success',
      data: {
        books: bookList,
      },
    }).code(200);
  }

  if (finished !== undefined) {
    const filteredBooks = books.filter((book) => book.finished === !!parseInt(finished, 10));
    const bookList = filteredBooks.map((book) => ({
      id: book.id,
      name: book.name,
      publisher: book.publisher,
    }));

    return h.response({
      status: 'success',
      data: {
        books: bookList,
      },
    }).code(200);
  }

 

  const bookList = books.map((book) => ({
    id: book.id,
    name: book.name,
    publisher: book.publisher,
  }));
  

  return h.response({
    status: 'success',
    data: {
      books: bookList,
    },
  }).code(200);
}

const getBookByIdHandler = (request, h) => { 
  const { id } = request.params;

  const book = books.filter((n) => n.id === id)[0];

  if (book !== undefined) {
    return h.response({
      status: 'success',
      data: {
        book,
      },
    }).code(200);
  }

  return h.response(responseData('fail', 'Buku tidak ditemukan')).code(404);

}

const updateBookByIdHandler = async (request, h) => { 
  const validate = await addBookValidation(request, h);
  const { id } = request.params;
  const index = books.findIndex((book) => book.id === id);

  if (index === -1) {
    return h.response(responseData('fail', 'Gagal memperbarui buku. Id tidak ditemukan')).code(404);
  }

  if (validate) {
    return h.response(responseData('fail', 'Gagal memperbarui buku. Mohon isi nama buku')).code(400);
  }
  
  const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;

  if (readPage > pageCount) {
    return h.response(responseData('fail', 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount')).code(400);
  }

  const finished = pageCount === readPage;
  const updatedAt = new Date().toISOString();
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
      finished,
      updatedAt,
    };

    return h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    }).code(200);
  }

  return h.response(responseData('fail', 'Gagal memperbarui buku. Id tidak ditemukan')).code(404);

}

const deleteBookByIdHandler = (request, h) => { 
  const { id } = request.params;
  const index = books.findIndex((book) => book.id === id);

  if (index !== -1) {
    books.splice(index, 1);
    return h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    }).code(200);
  }

  return h.response(responseData('fail', 'Buku gagal dihapus. Id tidak ditemukan')).code(404);

}


module.exports = { addBookHandler, getAllBooksHandler, getBookByIdHandler, updateBookByIdHandler, deleteBookByIdHandler };