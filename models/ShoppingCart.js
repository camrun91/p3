const Book = require('./Book');

class ShoppingCart {
    constructor() {
        this.cart = []; //this.cart = [{book, qty}]
    }
    serialize() {
        let serial = [];
        for (const item of this.cart) {
            serial.push({book: item.book.serialize(), qty: item.qty});
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
            {book: new Book(item.book), qty: item.qty}
        );
    }
    add(book) {
        for (const item of this.cart) {
            if (item.book.id == book.id) {
                item.qty++;
                return;
            }
        }
        this.cart.push({book: book, qty: 1});
    }
    get totalPrice() {
        let total = 0;
        for (const item of this.cart) {
            total += item.book.price * item.qty;
        }
        return total;
    }
}

module.exports = ShoppingCart;