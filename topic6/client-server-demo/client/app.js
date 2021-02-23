let currentState;

function updateState(newState) {
    currentState = newState;
    DOMManager.render();
}


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
}

function init() {
    let $firstNameInput = $('#new-author-first-name');
    let $lastNameInput = $('#new-author-last-name');
    let $dobInput = $('#new-author-dob');

    $('#create-new-author').on('click', () => {
        AuthorService.createAuthor(new Author($firstNameInput.val(), $lastNameInput.val(), $dobInput.val())).then(() => {
            AuthorService.getAllAuthors().then(data => {
                updateState(data);
            });
        });
    });

    $('#app').on('click', (e) =>{
        // employing event delegation
        let $target = $(e.target);
        let targetId= $target.attr('id');

        if (!targetId) return;

        if (targetId.startsWith('delete-author')) {
            let authorId = $target.data('authorId');
            AuthorService.deleteAuthor(authorId).then(() => {
                AuthorService.getAllAuthors().then(data => {
                    updateState(data);
                });
            })
        } else if (targetId.startsWith('delete-book')) {
            let authorId = $target.data('authorId');
            let bookId = $target.data('bookId');
            AuthorService.deleteBook(authorId, bookId).then(() => {
                AuthorService.getAllAuthors().then(data => {
                    updateState(data);
                });
            });
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
                    author.books.push(new Book(title, genre, pubYear));
                    authorToUpdate = author;
                }
            });
            if (authorToUpdate) {
                AuthorService.updateAuthor(authorToUpdate).then(() => {
                    AuthorService.getAllAuthors().then(data => {
                        updateState(data);
                    });
                })
            }
        }
    });

    AuthorService.getAllAuthors().then(data => updateState(data));
}

init();