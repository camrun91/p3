// a fake database for books

const books = [
    {
        id: 0,
        title: 'Intro to Node.js',
        author: 'Mark',
        price: 29.99,
        image_path: '/images/0.png'
    },
    {
        id: 1,
        title: 'Mastring Node.js',
        author: 'John',
        price: 19.99,
        image_path: '/images/1.png'
    },
    {
        id: 2,
        title: 'How to get A in WSP class',
        author: 'Sung',
        price: 309.99,
        image_path: '/images/2.png'
    },
    {
        id: 3,
        title: 'How to not fail in WSP class',
        author: 'Hong',
        price: 10.49,
        image_path: '/images/3.png'
    },
    {
        id: 4,
        title: 'Node.js for Dummies',
        author: 'Mr. Dumber',
        price: 5.49,
        image_path: '/images/4.png'
    },
    {
        id: 5,
        title: 'Node.js for AI',
        author: 'Mr. Robot',
        price: 15.49,
        image_path: '/images/5.png'
    }
];

const Book = require('../models/Book');

module.exports.books = books;
module.exports.find = function(id) {
    for (const book of books) {
        if (id == book.id) {
            return new Book(book);
        }
    }
    return null;
}