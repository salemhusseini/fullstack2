const express = require('express');
const router = express.Router();

const multer = require('multer');
const path = require('path')

const fs = require('fs')

const Book = require('../models/book')
const Author = require('../models/author')

const uploadPath = path.join('public', Book.coverImageBasePath)
const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif']

const upload = multer({
    dest: uploadPath,
    fileFilter: (req, file, callback) => callback(null, imageMimeTypes.includes(file.mimetype))
});


// All Books Route
router.get('/', async (req, res) => {
    let query = Book.find()

    let searchOptions = {}
    if (req.query.title != null && req.query.title !== '') {
        query = query.regex('title', new RegExp(req.query.title, 'i'))
        query = query.regex('')
    }
    if (req.query.pub_before != null && req.query.pub_before !== '') {
        query = query.regex('pub_before', new RegExp(req.query.title, 'i'))
        query = query.regex('')
    }

    try {
        const books = await query.exec();
        res.render('books/index', { books: books, searchOptions: req.query });
    } catch (err) {
        res.redirect('/');
    }

})

// New Book Route
router.get('/new', async (req, res) => {
    renderNewPage(res, new Book())
})

// Create Book Route
router.post('/', upload.single('cover'), async (req, res) => {
    const fileName = req.file != null ? req.file.filename : null

    const book = new Book({

        title: req.body.title,
        author: req.body.author,
        page_count: req.body.page_count,
        pub_date: new Date(req.body.pub_date),
        desc: req.body.desc,
        coverImageName: fileName
    })
    try {
        const newBook = await book.save()
        //res.redirect(`books/${newBook.id}`)
        res.redirect('books')
    } catch {
        if (book.coverImageName != null) {
            removeBookCover(book.coverImageName)
        }
        console.log(book)
        renderNewPage(res, book, true)
    }
})

function removeBookCover(fileName) {
    fs.unlink(path.join(uploadPath, fileName), err => {
        if (err) console.error(err)
    })
}

async function renderNewPage(res, book, hasError = false) {
    try {
        const authors = await Author.find({});
        const params = {
            authors: authors,
            book: book
        }
        if (hasError) params.errorMessage = 'Error Creating Book'
        res.render('books/new', params)

    } catch (err) {

        res.redirect('/books');
    }
}

module.exports = router;