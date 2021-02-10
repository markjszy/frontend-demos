class Book {
    constructor(author, title, genre, publicationYear) {
        this.author = author;
        this.title = title;
        this.genre = genre;
        this.publicationYear = publicationYear;
    }

    renderBook(parentNode) {
        let bookContainer = document.createElement('div');
        bookContainer.setAttribute('class', 'book-container');
        let titleElmt = document.createElement('p');
        titleElmt.innerHTML = this.title;
        let genreElmt = document.createElement('p');
        genreElmt.innerHTML = this.genre;
        let authorElmt = document.createElement('p');
        authorElmt.innerHTML = this.author;
        let publicationElmt = document.createElement('p');
        publicationElmt.innerHTML = this.publicationYear;

        let deleteButton = document.createElement('button');
        deleteButton.innerHTML = 'Delete book';
        deleteButton.setAttribute('class', 'btn btn-danger book-delete');

        deleteButton.addEventListener('click', () => {
            bookContainer.remove();
        });

        bookContainer.appendChild(titleElmt)
        bookContainer.appendChild(genreElmt);
        bookContainer.appendChild(authorElmt);
        bookContainer.appendChild(publicationElmt);
        bookContainer.appendChild(deleteButton);

        parentNode.appendChild(bookContainer);
    }
}