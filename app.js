const express = require('express')
const session = require('express-session')
const multer = require('multer')
const ejs = require('ejs')
const path = require('path')
const fs = require('fs')

const uploadImagePrefix = 'image-';
const uploadDir = './public/uploads';
//Storage options for Multer are set below.
const storageOptions = multer.diskStorage({
    destination: (req, file, callback) => {
        // upload dir path
        callback(null, uploadDir);
    },
    filename: (req, file, callback) => {
        callback(null, uploadImagePrefix + Date.now()
            + path.extname(file.originalname));
    }
})

const MAX_FILESIZE = 1024 * 1024 * 3; // 3 MB
const fileTypes = /jpeg|jpg|png|gif/ //These are the accepted file types.

//configure Multer
const upload = multer({
    storage: storageOptions,
    limits: {
        fileSize: MAX_FILESIZE
    }, 
    fileFilter: (req, file, callback) => {
        const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = fileTypes.test(file.mimetype);
        if (mimetype && extname) {
            return callback(null, true);
        } else {
            return callback('Error: Images only');
        }
    }
}).single('imageUpload'); // parameter name at <form> of index.ejs

const app = express()
app.set('view engine', 'ejs')
app.set('views', './ejs_views')
app.use('/public', express.static(__dirname + '/public'));
app.use(express.urlencoded({extended: false}));
app.use(session({
	secret: 'mysecretkey',
	resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 60*60*1000, // unit: ms, if inactive, session expires in 1 hour
        path: '/'
    }
}));

const ShoppingCart = require('./models/ShoppingCart');
const Book = require('./models/BookSchema');
app.locals.store_title = 'MyBroncho Online';

// session can hold only serializable data
// functions or instances(objects) cannot be saved in session
app.get('/', (req, res) => {
    if (!req.session.shoppingcart) {
        req.session.shoppingcart = new ShoppingCart().serialize();
    }
    res.render('index');
});

app.get('/admin', (req, res) =>{
    Book.find({}, (err, results) => {
		if (err) {
			return res.render.status(500).send('<h1>Error: cannot read from db</h1>')
		}
        return res.render('admin', {results, msg: null})
	})
})

// "add" button is pressed to add to ShoppingCart
app.post('/add', (req, res) => {
	const book_id = req.body.id;
	if (!book_id) {
		// for some reason, not came via "add" button of index.ejs
		res.redirect('/');
	}
    if (!req.session.shoppingcart) {
        req.session.shoppingcart = new ShoppingCart().serialize();
    }
    const shoppingcart = ShoppingCart.deserialize(req.session.shoppingcart);
    const book = books_db.find(book_id);
    //console.log('book', book);
    shoppingcart.add(book);
    req.session.shoppingcart = shoppingcart.serialize();
    //console.log('sc', req.session.shoppingcart);
    res.render('shoppingcart', {shoppingcart});
});

app.get('/checkout', (req, res) => {
    let message = '';
    if (!req.session.shoppingcart) {
        message = "Did't you buy anything yet? Why checkout?";
    } else {
        const shoppingcart = ShoppingCart.deserialize(req.session.shoppingcart);
        message = `Send $${shoppingcart.totalPrice.toFixed(2)}
            to Dr. Sung immediately!<br>
            Cash only please!<br>
            Your order will be delivered no earlier than March 1, 2030`;
    }
    res.send(`<h1>${message}</h1>`);
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log('Server started at port', port);
});