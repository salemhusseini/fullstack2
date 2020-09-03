const mongoose = require('mongoose');
const path = require('path')
const coverImageBasePath = 'uploads/bookCovers'

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Author'
    },
    page_count: {
        type: Number,
        required: true
    },
    pub_date: {
        type: Date,
        required: true
    },
    desc: {
        type: String,

    },
    coverImageName: {
        type: String,
        required: true
    }

})

//while making a path variable, we use normal "function ()" so we can access "this."
bookSchema.virtual('coverImagePath').get(function () {
    if (this.coverImageName != null) {
        return path.join('/', coverImageBasePath, this.coverImageName)
    }
})

module.exports = mongoose.model('book', bookSchema)
module.exports.coverImageBasePath = coverImageBasePath;