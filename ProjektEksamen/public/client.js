/**
 * Created by Neels1 on 16/11/16.
 */

$(function () {
$.get('/application/:id', appendToList);

    var employeeNr;
    function appendToList(apps) {
        var list = [];
        for (var i in apps) {
            list.push($('<li>', {text: "Date: " + apps[i].vacaDate}))
            employeeNr = apps[i].employeeNumber;
        }
        $('.apps').append(list);
    };

    $('#form2').on('submit', function (event) {
        event.preventDefault();
        $.ajax({type: 'PUT', url: window.location.pathname, data: $(this).serialize()}).done(function (data) {
            appendToList([data]);
        });
        $('#form2').trigger('reset');
    });

    $('#form1').on('submit', function(event) {
        event.preventDefault();
        var user = $('#username').val();

        var date = $('#date').val();
        console.log(user);
        console.log(date);
        $.ajax({type: 'GET', url: 'http://localhost:8080/findApp/' + user + '/' + date}).done(function(data) {
            if(data.vacaDate != null) {
                $('textarea').val(data.employeeNumber + '\n' + data.vacaDate);
            } else {
                $('textarea').val("Not found");
            }
        });
        $('#form1').trigger('reset');
    });
});