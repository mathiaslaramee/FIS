/**
 * Created by Neels1 on 16/11/16.
 */
$(function () {
//$.get('/application/:id', appendToList);

console.log('fuck af');
    var employeeNr;
    function appendToList(apps) {
        var list = [];
        for (var i in apps) {
            list.push($('<li>', {text: "Date: " + apps[i].vacaDate}))
            employeeNr = apps[i].employeeNumber;
        }
        $('.apps').append(list);
    };

    $('submit').on('submit', function (event) {
        console.log('submit client');
        event.preventDefault();
        $.ajax({type: 'PUT', url: window.location.pathname, data: $(this).serialize()}).done(function (data) {
            appendToList([data]);
        });
        $('form').trigger('reset');
    });

});