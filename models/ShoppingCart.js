const Book = require('./database');

class ShoppingCart {
    constructor() {
        this.cart = []; //this.cart = [{book, qty}]
    }
    serialize() {
        let serial = [];
        for (const item of this.cart) {
            serial.push({title: item.title, author: item.author, price: item.price, image: item.image, qty: item.qty});
        }
        return serial;
    }
    static deserialize(serial) {
        let sc = new ShoppingCart();
        for (const item of serial) {
            sc.deserial_additem(item);
        }
        return sc;
    }
    deserial_additem(item) { // {book, qty}
        this.cart.push(
            {title: item.title, author: item.author, price: item.price, image: item.image, qty: item.qty}
        );
    }
    add(book) {
        for (const item of this.cart) {
            if (item.title == book.title) {
                item.qty++;
                return;
            }
        }
        for (const item of book) {
        this.cart.push({title: item.title, author: item.author, price: item.price, image: item.image, qty: 1});
        }
    }
    get totalPrice() {
        let total = 0;
        for (const item of this.cart) {
            total += item.price * item.qty;
        }
        return total;
    }
}

module.exports = ShoppingCart;