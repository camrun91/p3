
class Book {
    constructor(db_entry) {
        this.id = db_entry.id;
        this.author = db_entry.author;
        this.title = db_entry.title;
        this.price = db_entry.price;
        this.image_path = db_entry.image_path;
    } 
    serialize() {
        return {
            id: this.id,
            author: this.author,
            title: this.title,
            price: this.price,
            image_path: this.image_path
        };
    }
    static deserialize(sbook) {
        return new Book(
            sbook.id,
            sbook.author,
            sbook.title,
            sbook.price,
            sbook.image_path
        );
    }
}

module.exports = Book;