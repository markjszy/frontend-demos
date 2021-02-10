let rootNode = document.getElementById('libraryApp');

let entryForm = new EntryForm((bookSummary) => {
    let book = new Book(bookSummary.author, 
                        bookSummary.title, 
                        bookSummary.genre, 
                        bookSummary.pub);

    book.renderBook(rootNode);
});

entryForm.renderForm(rootNode);
