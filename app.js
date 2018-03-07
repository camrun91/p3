// minimalistic online store: no real database, no authentication

const express = require('express');
const session = require('express-session');

const app = express();
app.set('view engine', 'ejs');
app.set('views', './ejs_views');

app.use('/images', express.static(__dirname+'/data/images'));
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

const books_db = require('./data/books_db');
const ShoppingCart = require('./models/ShoppingCart');
const Book = require('./models/Book');
app.locals.store_title = 'MyBroncho Online';

// session can hold only serializable data
// functions or instances(objects) cannot be saved in session
app.get('/', (req, res) => {
    if (!req.session.shoppingcart) {
        req.session.shoppingcart = new ShoppingCart().serialize();
    }
    res.render('index', {books_db});
});

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