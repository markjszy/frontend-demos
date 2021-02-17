// See https://reqres.in/ for details about ready-made API to test a frontend against

const USERS_LIST_ENDPOINT = 'https://reqres.in/api/users'
const USERS_UPDATE_ENDPOINT = 'https://reqres.in/api/users/2'

// Vanilla JS Ajax Demo
const classicResultsElmt = document.getElementById('classicResults');
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
                        // example of JSON.parse, needed since responseText is a stringified representation 
                        // and not a ready-to-use JSON object
                        let responseData = JSON.parse(httpRequest.responseText);
                        responseData['data'].forEach(userName => {
                            let listElmt = document.createElement('li');
                            listElmt.innerHTML = `${userName.first_name} ${userName.last_name}`
                            classicResultsElmt.appendChild(listElmt);
                        });
                    } else {
                        classicResultsElmt.append('<h3>Error...</h3>');
                        console.error(`Error was ${httpRequest.status}`);
                    }
                }
            };
            httpRequest.open('GET', USERS_LIST_ENDPOINT);
            httpRequest.send();
});


// jQuery Ajax Demo
const $jQueryGetResults = $('#jQueryGetResults');
$('#getUserDataJQuery').on('click', () => {
    $.get(USERS_LIST_ENDPOINT, (data) => {
        // data is a ready-to-use JSON object
        data['data'].forEach(userName => {
            $jQueryGetResults.append(`<li>${userName.first_name} ${userName.last_name}`);
        });
    });
});

const $jQueryPostResults = $('#jQueryPostResults');
const mockDataToPost = {"name": "morpheus", "job": "leader"};
$('#postUserDataJQuery').on('click', () => {
    // note the second arg to $.post here is data we are sending as part of POST request TO the server
    $.post(USERS_UPDATE_ENDPOINT, mockDataToPost, (data) => {
        // just dumping stringified JSON response data for illustrative purposes
        $jQueryPostResults.text(JSON.stringify(data));
    });
});

// Vanilla JS with Fetch API demo
const fetchResultsElmt = document.getElementById('fetchResults');
document.getElementById('getUserDataFetch').addEventListener('click', () => {
    window.fetch(USERS_LIST_ENDPOINT).then(resp => 
        // note below we're just dumping out the stringified JSON object instead of 
        // using it to create new elements as in examples above
        resp.json()).then(data => fetchResultsElmt.innerHTML = JSON.stringify(data))
    })