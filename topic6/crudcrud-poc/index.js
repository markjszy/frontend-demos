let baseUrl = 'https://crudcrud.com/api/48997f60c66742d6a3361e06f7b173a5/houses'; // houses is our chosen resource

$('#getResource').on('click', () => {
    $.ajax({
        url: baseUrl,
        method: 'GET'
    }).then(results => {
        $('#getResults').html(`<code>${JSON.stringify(results)}</code>`);
    })
});

$('#postResource').on('click', () => {
    $.ajax({
        url: baseUrl,
        method: 'POST',
        datatype: 'json',
        data: JSON.stringify({'name': 'My house', 'created': `${Date.now()}`}),
        contentType: 'application/json'
    }).then(results => {
        $('#postResults').html(`<code>${JSON.stringify(results)}</code>`);
    })
});

// for the put request, we'll just grab
// the id of the last resource and make a trivial change to it
$('#putResource').on('click', () => {
    $.ajax({
        url: baseUrl,
        method: 'GET'
    }).then(results => {
        if (results.length) {
            let lastResult = results[results.length-1];
            let lastResultId = lastResult._id;
            lastResult.name = 'Altered name!';
            delete lastResult._id; // remove the _id from the JSON when we submit the PUT, else crudcrud will reject it!
            $.ajax({
                url: `${baseUrl}/${lastResultId}`,
                method: 'PUT',
                datatype: 'json',
                data: JSON.stringify(lastResult),
                contentType: 'application/json'
            }).then(putResult => {
                $('#putResults').html(`<code>${JSON.stringify(putResult)}</code>`);
            })
        }
    });
});

// for the delete request, we'll delete the last resource
$('#deleteResource').on('click', () => {
    $.ajax({
        url: baseUrl,
        method: 'GET'
    }).then(results => {
        if (results.length) {
            let lastResult = results[results.length-1];
            lastResult.name = 'Altered name!';
            $.ajax({
                url: `${baseUrl}/${lastResult._id}`,
                method: 'DELETE',
                datatype: 'json',
                contentType: 'application/json'
            }).then(deleteResult => {
                $('#deleteResults').html(`<code>${JSON.stringify(deleteResult)}</code>`);
            })
        }   
    });
});