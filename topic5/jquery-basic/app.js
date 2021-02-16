$('#changeParagraphs').on('click', () => {
    $('p').text('updated!');
});

$('#addElements').on('click', () =>  {
    $('#appContainer').append('<h3>This was appended</h3><ul><li>First</li><li>Second</li><li>Third</li>');
});