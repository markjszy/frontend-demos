/**
 * Note this is a simplified data model for demo purposes - strictly unidirectional relationship (book does not know its author)
 */
let ids = 0;
function getNewId() {
    return ids++;
}

class Book {
    constructor(id, title, genre, pubYear) {
        this.id = id;
        this.title = title;
        this.genre = genre;
        this.pubYear = pubYear;
    }
}

class Author {
    constructor(id, firstName, lastName, dob) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.dob = dob;
        this.books = [];
    }

    /**
     * Add a book
     */
    addBook(title, genre, pubYear) {
        this.books.push(new Book(getNewId(), title, genre, pubYear));
    }

    /** 
     * Delete a book with id
     */
    deleteBook(id) {
        let delIdx = -1;
        this.books.forEach((book, idx) => {
            if (book.id == id) {
                delIdx = idx;
            }
        });

        if (delIdx != -1) {
            this.books.splice(delIdx, 1);
        }
    }
}

let barnes = new Author(getNewId(), "Julian", "Barnes", 1946);
barnes.addBook("The Noise of Time", "Historical Fiction",  2016);
barnes.addBook("Metroland", "Bildungsroman", 1980);

let applebaum = new Author(getNewId(), "Anne", "Applebaum", 1964);
applebaum.addBook("Gulag: A History", "History", 2003);
applebaum.addBook("Iron Curtain", "History", 2012);

let authors = [applebaum, barnes];

function insertNewAuthor(authorDesc) {
    authorDesc.id = getNewId();
    authors.push(authorDesc);
}

module.exports = {
    authors,
    Author,
    insertNewAuthor
}