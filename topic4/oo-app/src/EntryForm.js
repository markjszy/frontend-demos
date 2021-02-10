class EntryForm {
    constructor(submitCallback) {
        this.submitCallback = submitCallback;
    }

    renderForm(parentNode) {
        let formContainer = document.createElement('div');
        let formGroup = document.createElement('div');
        formGroup.setAttribute('class', 'form-group');

        // Book title
        let titleLabel = document.createElement('label');
        titleLabel.setAttribute('for', 'bookTitle');
        let titleInput = document.createElement('input');
        titleInput.setAttribute('id', 'bookTitle');
        titleInput.setAttribute('type', 'text');
        titleInput.setAttribute('class', 'form-control');
        titleInput.setAttribute('placeholder', 'Title');

        // Author
        let authorLabel = document.createElement('label');
        authorLabel.setAttribute('for', 'bookAuthor');
        let authorInput = document.createElement('input');
        authorInput.setAttribute('id', 'bookAuthor');
        authorInput.setAttribute('type', 'text');
        authorInput.setAttribute('class', 'form-control');
        authorInput.setAttribute('placeholder', 'Author');

        // Genre
        let genreLabel = document.createElement('label');
        genreLabel.setAttribute('for', 'bookGenre');
        let genreInput = document.createElement('input');
        genreInput.setAttribute('id', 'bookGenre');
        genreInput.setAttribute('type', 'text');
        genreInput.setAttribute('class', 'form-control');
        genreInput.setAttribute('placeholder', 'Genre');

        // Publication Year...just use text input; would be better with a different control
        let pubLabel = document.createElement('label');
        pubLabel.setAttribute('for', 'bookPub');
        let pubInput = document.createElement('input');
        pubInput.setAttribute('id', 'bookPub');
        pubInput.setAttribute('type', 'text');
        pubInput.setAttribute('class', 'form-control');
        pubInput.setAttribute('placeholder', 'Publication Year');
     
        // Entry button
        let entryButton = document.createElement('button');
        entryButton.setAttribute('class', 'btn btn-primary');
        entryButton.innerHTML = 'Enter Book';

        // Hook up event handler to tell parent about event
        entryButton.addEventListener('click', () => {
            // collect our data and give it to the callback
            let bookSummary = {
                title: titleInput.value,
                author: authorInput.value,
                genre: genreInput.value,
                pub: pubInput.value
            }

            this.submitCallback(bookSummary);
        });

        // Assemble and render on parent node
        formGroup.appendChild(authorLabel);
        formGroup.appendChild(authorInput);
        formGroup.appendChild(titleLabel);
        formGroup.appendChild(titleInput);
        formGroup.appendChild(genreLabel);
        formGroup.appendChild(genreInput);
        formGroup.appendChild(pubLabel);
        formGroup.appendChild(pubInput);

        formContainer.appendChild(formGroup);
        formContainer.appendChild(entryButton);
        parentNode.appendChild(formContainer);
    }
}