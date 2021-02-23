/**
 * Our store - wrapped in an immediately-invoked function expression (IIFE) 
 * so that we expose only what is needed by other client code
 */
let repo = (function() {
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
         * Remove a book
         */
        removeBook(id) {
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

    /**
     * Fill with some initial mock data
     */
    let barnes = new Author(getNewId(), "Julian", "Barnes", 1946);
    barnes.addBook("The Noise of Time", "Historical Fiction",  2016);
    barnes.addBook("Metroland", "Bildungsroman", 1980);

    let applebaum = new Author(getNewId(), "Anne", "Applebaum", 1964);
    applebaum.addBook("Gulag: A History", "History", 2003);
    applebaum.addBook("Iron Curtain", "History", 2012);

    let authors = [applebaum, barnes];

    function insertNewAuthor(authorDesc) {
        // takes a *store* representation of an author to push into the store
        authorDesc.id = getNewId();
        authors.push(authorDesc);
    }

    function createStoreAuthor(authorDesc) {
        // from a description of an author from the client,
        // create an instance of author for the store
        let newAuthor = new Author(authorDesc.id, authorDesc.firstName, authorDesc.lastName, authorDesc.dob);
        authorDesc.books.forEach(bookDesc => {
            newAuthor.addBook(bookDesc.title, bookDesc.genre, bookDesc.pubYear);
        });
        return newAuthor;
    }

    return {authors, insertNewAuthor, getNewId, createStoreAuthor}; 
})();




/**
 * The service over our store
 */
class AuthorService {
    // We'll simulate promise behavior by returning promises in all methods
    static url = 'http://localhost:3000/authors';

    static getAllAuthors() {
        return new Promise((res, rej) => {
            res(repo.authors);
        });
    }

    static getAuthor(id) {
        return new Promise((res, rej) => {
            let found;
            repo.authors.forEach(author => {
              if (author.id === id) {
                  found = author;
              }
            });
          
            if (found) {
                res(found);
            } else {
                rej('No such author');
            }
        });
    }

    static createAuthor(author) {   
        return new Promise((res, rej) => {
            // create a *Store* version of the author instance
            // and insert it into the collection
            let storeAuthor = repo.createStoreAuthor(author);
            repo.insertNewAuthor(storeAuthor);
            res(author);
        });
    }

    static updateAuthor(updatedAuthor) {
        let updatedAuthorForStore = repo.createStoreAuthor(updatedAuthor);
        updatedAuthorForStore.id = updatedAuthor.id;
        return new Promise((res, rej) => {
            let authorToUpdateIdx = -1;
            repo.authors.forEach((author, idx) => {
                if (author.id === updatedAuthor.id) {
                    authorToUpdateIdx = idx;
                }
            });
          
            if (authorToUpdateIdx != -1) {
                repo.authors[authorToUpdateIdx] = updatedAuthorForStore;
                res(updatedAuthor);
            } else {
                rej('Update failed'); // should be an error code
            }
        });
    }

    static deleteAuthor(deleteId) {
        return new Promise((res, rej) => {
            let delIdx = -1;
        
            repo.authors.forEach((author, idx) => {    
              if (author.id === deleteId) {
                  delIdx = idx;
              }
            });
          
            if (delIdx != -1) {
                repo.authors.splice(delIdx, 1);
                res({"removed": deleteId});
            } else {
                rej(`No such id to delete`);
            }
        });
    }

    static deleteBook(reqAuthorId, reqBookId) {
        return new Promise((res, rej) => {
            repo.authors.forEach(author => {
                if (author.id === reqAuthorId) {
                    author.removeBook(reqBookId);
                }
            });
          
            res({"deleted": {"author": reqAuthorId, "book": reqBookId}});
        });
    }
}