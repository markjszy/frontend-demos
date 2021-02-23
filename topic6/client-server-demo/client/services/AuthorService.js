class AuthorService {
    static url = 'http://localhost:3000/authors';

    static getAllAuthors() {
        return $.get(this.url);
    }

    static getAuthor(id) {
        return $.get(this.url + `/{id}`);
    }

    static createAuthor(author) {   
        return $.ajax(this.url, 
            {
                method: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(author)
            }); 
    }

    static updateAuthor(author) {
        return $.ajax(`${this.url}/${author.id}`,
        {
            method: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify(author)
        });
    }

    static deleteAuthor(id) {
        return $.ajax(`${this.url}/${id}`,
        {
            method: 'DELETE'
        });
    }

    static deleteBook(authorId, bookId) {
        return $.ajax(`${this.url}/${authorId}/books/${bookId}`,
        {
            method: 'DELETE'
        });
    }
}