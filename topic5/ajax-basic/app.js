// See https://reqres.in/ for details about ready-made API to test a frontend against

const USERS_LIST_ENDPOINT = 'https://reqres.in/api/users'
const USERS_UPDATE_ENDPOINT = 'https://reqres.in/api/users/2'

// Vanilla JS Ajax Demo
document.getElementById('getUserDataClassic')
        .addEventListener('click', () => {
            let httpRequest = new XMLHttpRequest();
            if (!httpRequest) {
                alert('Giving up :( Cannot create an XMLHTTP instance');
                return false;
              }
            httpRequest.onreadystatechange = () => {
                if (httpRequest.readyState === XMLHttpRequest.DONE) {
                    if (httpRequest.status === 200) {
                        $('#classicResults').text(httpRequest.responseText);
                    } else {
                        $('#classicResults').append('<h3>Error...</h3>');
                        console.error(`Error was ${httpRequest.status}`);
                    }
                }
            };
            httpRequest.open('GET', USERS_LIST_ENDPOINT);
            httpRequest.send();
});


// jQuery Ajax Demo
$('#getUserDataJQuery').on('click', () => {
    $.get(USERS_LIST_ENDPOINT, (data) => {
        $('#jQueryGetResults').text(JSON.stringify(data));
    });
});

$('#postUserDataJQuery').on('click', () => {
    $.post(USERS_UPDATE_ENDPOINT, (data) => {
        $('#jQueryPostResults').text(JSON.stringify(data));
    });
});

// Vanilla JS with Fetch API demo
document.getElementById('getUserDataFetch').addEventListener('click', () => {
    window.fetch(USERS_LIST_ENDPOINT).then(resp => 
        resp.json()).then(data => $('#fetchResults').text(JSON.stringify(data)))
    })