
$(function () {

    $('#submittos').on('submit', function (event) {
        event.preventDefault();
        var user = $('#id').val();
        var date = $('#date').val();
        console.log(user);
        console.log(date);
         $.ajax({type: 'GET', url: 'http://localhost:8080/findApp/' + user + '/' + date});
         console.log('lavet get');
        $('form').trigger('reset');
    });

});