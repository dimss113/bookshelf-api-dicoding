const Validator = require('validatorjs');
const { responseData } = require('./helper');

const addBookValidation = async (request, h) => {
  try {
    const rules = {
      name: 'required|string',
      year: 'required|integer',
      author: 'required|string',
      summary: 'required|string',
      publisher: 'required|string',
      pageCount: 'required|integer',
      readPage: 'required|integer',
      reading: 'required|boolean',
    }

    const validation = new Validator(request.payload, rules);


    return validation.fails();

  // eslint-disable-next-line no-unused-vars
  } catch (error) {
    return h.response(responseData('fail', 'Gagal menambahkan buku. Terjadi kesalahan pada server')).code(500);
  }
}

module.exports = { addBookValidation };