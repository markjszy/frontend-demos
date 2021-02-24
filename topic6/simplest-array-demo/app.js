/**
 * Utilities
 */
let utils = (function() {
    let ids = 0;
    function getNewId() {
        return ids++;
    }

    return { getNewId };
})();

/**
 * Models
 */
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
        this.books.push(new Book(utils.getNewId(), title, genre, pubYear));
    }

    /**
     * Remove a book
     */
    removeBook(id) {
        let bookToDeleteIdx = this.books.map(book => book.id).indexOf(id);
        if (bookToDeleteIdx != -1) {
            this.books.splice(bookToDeleteIdx, 1);
        }
    }
}

/**
 * Data repository
 */
let authorRepo = [];

/**
 * Service
 */
class AuthorService {
    /**
     * Author Service is merely an abstraction over
     * the repository...in this case, a simple array
     */
    static getIdxForId(authorId) {
        // Returns the index in the repo where an author
        // with given id was found; -1 if not found
        return authorRepo.map(a => a.id).indexOf(authorId);
    }

    static getAllAuthors() {
        return authorRepo;
    }

    static addAuthor(author) {
        authorRepo.push(author);
    }

    static updateAuthor(author) {
        let indexToUpdate = AuthorService.getIdxForId(author.id);
        if (indexToUpdate != -1) {
            authorRepo[indexToUpdate] = author;
        }
    }

    static deleteAuthor(id) {
        let indexToUpdate = AuthorService.getIdxForId(id);
        authorRepo.splice(indexToUpdate, 1);
    }

    static deleteBook(authorId, bookId) {
        // first get the author entry
        let indexToUpdate = AuthorService.getIdxForId(authorId);
        let authorToUpdate = authorRepo[indexToUpdate];
        authorToUpdate.removeBook(bookId);
    }
}

/**
 * Frontend state
 */
let currentState;   

function updateState(newState) {
    // Note that every update to state will 
    // trigger a re-render in the DOM!
    currentState = newState;
    DOMManager.render();
}

/**
 * DOM Manager
 */
class DOMManager {
    static getAuthorHeader(authorDesc) {
        return `<div>
                    <div class="row">
                        <div class="col-8">
                            <h3>${authorDesc.firstName} ${authorDesc.lastName} (b. ${authorDesc.dob})</h3>
                        </div>
                        <div class="col-4">
                            <button class="delete-author btn btn-danger" 
                                id="delete-author-${authorDesc.id}" data-author-id="${authorDesc.id}">Delete Author</button>
                        </div>
                    </div>
                </div>`
    }

    static getBookMarkupForAuthor(authorDesc) {
        let bookHtml = [];
        authorDesc.books.forEach(bookDesc => {
            bookHtml.push(`<div class="row">
                <div class="col-8">
                    <ul>
                        <li>Title: ${bookDesc.title}</li>
                        <li>Genre: ${bookDesc.genre}</li>
                        <li>Publication Year: ${bookDesc.pubYear}</li>
                    </ul>
                </div>
                <div class="col-4">
                    <button class="delete-book btn btn-danger" id="delete-book-${bookDesc.id}" 
                        data-book-id="${bookDesc.id}" data-author-id="${authorDesc.id}">Delete Book</button>
                </div>
            </div>`)
        });
        return bookHtml.join('');
    }

    static getNewBookForm(authorDesc) {
        return `<div class="form-group">
                 <label for="new-book-title-${authorDesc.id}">Title:</label><br>
                 <input class="form-control" type="text" id="new-book-title-${authorDesc.id}">
                </div>
                <div class="form-group">
                 <label for="new-book-genre-${authorDesc.id}">Genre:</label><br>
                 <input class="form-control" type="text" id="new-book-genre-${authorDesc.id}">
                </div>
                <div class="form-group">
                 <label for="new-book-pubYear-${authorDesc.id}">Year:</label><br>
                 <input class="form-control" type="text" id="new-book-pubYear-${authorDesc.id}">
                </div>
                <div class="form-group">
                    <button class="form-control btn btn-primary" id="add-book-for-author-${authorDesc.id}" data-author-id="${authorDesc.id}">Add New Book</button>
                </div>`;
    }

    static getAuthorBox(authorDesc) {
        let authorHeader = DOMManager.getAuthorHeader(authorDesc);
        let addBookForm = DOMManager.getNewBookForm(authorDesc);
        let currentBooks = DOMManager.getBookMarkupForAuthor(authorDesc);
        return `<div class="card">
            <div class="card-header">
                ${authorHeader}
            </div>
            <div class="card-body">
                ${addBookForm}
                ${currentBooks}
            </div>
        </div>`;
    }

    static render() {
        // render the application based on current state
        let newMarkup = currentState.map(this.getAuthorBox);
        $('#app').html(newMarkup);
    }

    static init() {
        // application initialization, event delegation hookups
        let $firstNameInput = $('#new-author-first-name');
        let $lastNameInput = $('#new-author-last-name');
        let $dobInput = $('#new-author-dob');
    
        $('#create-new-author').on('click', () => {
            AuthorService.addAuthor(new Author(utils.getNewId(), $firstNameInput.val(), $lastNameInput.val(), $dobInput.val()));
            updateState(AuthorService.getAllAuthors());
        });
    
        $('#app').on('click', (e) =>{
            // employing event delegation
            let $target = $(e.target);
            let targetId= $target.attr('id');
    
            if (!targetId) return;
    
            if (targetId.startsWith('delete-author')) {
                let authorId = $target.data('authorId');
                AuthorService.deleteAuthor(authorId);
                updateState(AuthorService.getAllAuthors());
            } else if (targetId.startsWith('delete-book')) {
                let authorId = $target.data('authorId');
                let bookId = $target.data('bookId');
                AuthorService.deleteBook(authorId, bookId);
                updateState(AuthorService.getAllAuthors());
            } else if (targetId.startsWith('add-book-for-author')) {
                let authorId = $target.data('authorId');
                // get the book information we need
                let title = $(`#new-book-title-${authorId}`).val();
                let genre = $(`#new-book-genre-${authorId}`).val();
                let pubYear = $(`#new-book-pubYear-${authorId}`).val();
    
                // we will 'update' the author with the new set of books
                let authorToUpdate;
                currentState.forEach(author => {
                    if (author.id === authorId) {
                        author.addBook(title, genre, pubYear);
                        authorToUpdate = author;
                    }
                });
                if (authorToUpdate) {
                    AuthorService.updateAuthor(authorToUpdate);
                    updateState(AuthorService.getAllAuthors());
                }
            }
        });
    
        // on first load, do an initial grab from the repo
        updateState(AuthorService.getAllAuthors());
    }
}

/**
 * Application initialization
 */
DOMManager.init();