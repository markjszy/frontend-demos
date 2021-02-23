const express = require('express')
const cors = require('cors')
const { authors, Author, insertNewAuthor } = require('./mockData/authorRepo')

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

function createAuthorFromJson(authorDesc) {
    let newAuthor = new Author(authorDesc.id, authorDesc.firstName, authorDesc.lastName, authorDesc.dob);
    authorDesc.books.forEach(bookDesc => {
        newAuthor.addBook(bookDesc.title, bookDesc.genre, bookDesc.pubYear);
    })

    return newAuthor;
}

/**
 * Note this API is a toy for demo purposes; it does not pretend to be a good RESTful service,
 * esp. with respect to non-OK responses
 */

/**
 * CRUD operations on authors
 */
app.get('/authors', (req, res) => {
  res.json(authors)
})

app.get('/authors/:id', (req, res) => {
  // Note -- boundary checking and responses here could be more robust and 
  // should do things like return clearer HTTP error statuses, etc.; this is simplified 
  // for demo purposes
  const requested = parseInt(req.params.id);
  let found;
  authors.forEach(author => {
    if (author.id === requested) {
        found  = author;
    }
  });

  res.json(found);
})

app.post('/authors', (req, res) => {
    // here we expect an author described in this form: 
    //     { firstName: 'Bill',
    //       lastName: 'Smith',
    //       dob: 1956,
    //       books: [ 
    //      {
    //         title:   '',
    //         genre: '',
    //         pubYear: 
    //      }, .... others ...,
    //    ]
    // }
    // for demo purposes, we will just assume the request is well-formed
    const author = createAuthorFromJson(req.body);
    insertNewAuthor(author);

    res.json(req.body);
});

app.put('/authors/:id', (req, res) => {
    // as with the POST of an author, we expect the update to 
    // actually include the full representation of the updated state
    const requested = parseInt(req.params.id);
    let updatedAuthor = createAuthorFromJson(req.body);
    updatedAuthor.id = requested;
    let authorToUpdateIdx = -1;
    authors.forEach((author, idx) => {
        if (author.id === requested) {
            authorToUpdateIdx = idx;
        }
    });
  
    if (authorToUpdateIdx != -1) {
        authors[authorToUpdateIdx] = updatedAuthor;
        res.json(updatedAuthor);
    } else {
        res.json([]); // should be an error code
    }
});

app.delete('/authors/:id', (req, res) => {
    const requested = parseInt(req.params.id);
    let delIdx = -1;

    authors.forEach((author, idx) => {    
      if (author.id === requested) {
          delIdx = idx;
      }
    });
  
    if (delIdx != -1) {
        authors.splice(delIdx, 1);
        res.json({"removed": requested});
    } else {
        res.json({"removed": "undefined"}); //should be error code
    }
});

app.get('/authors/:id/books', (req, res) => {
    const requested = parseInt(req.params.id);
    if (requested >= 0 && requested < authors.length) {
        res.json(authors[requested].books)
      } else {
        res.json([])
    } 
})

/**
 * CRUD operations on books (via author)
 */
// leaving other ops as an exercise...
app.delete('/authors/:id/books/:bookId', (req, res) => {
    const reqAuthorId = parseInt(req.params.id);
    const reqBookId = parseInt(req.params.bookId);
    let bookToDeleteIdx = -1;
    authors.forEach(author => {
        if (author.id === reqAuthorId) {
            // now we have found the author, so let's request removal of the book
            author.deleteBook(reqBookId, 1);
        }
    });
  
    if (bookToDeleteIdx != -1) {
        res.json({"deleted": {"author": reqAuthorId, "book": reqBookId}});
    } else {
        res.json([]); // should be an error code
    }
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})