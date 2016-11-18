/**
 * Created by jonas on 17-11-2016.
 */

var Calendar = function (o) {
    //Store div id
    this.divId = o.ParentID;

    // Days of week, starting on Sunday
    this.DaysOfWeek = o.DaysOfWeek;

    // Months, starting on January
    this.Months = o.Months;

    // Set the current month, year
    var d = new Date();

    this.CurrentMonth = d.getMonth();

    this.CurrentYear = d.getFullYear();

    var f = o.Format;

    if (typeof(f) == 'string') {
        this.f = f.charAt(0).toUpperCase();
    } else {
        this.f = 'M';
    }
};


// Goes to next month
Calendar.prototype.nextMonth = function () {

    if (this.CurrentMonth == 11) {
        this.CurrentMonth = 0;
        this.CurrentYear = this.CurrentYear + 1;
    } else {
        this.CurrentMonth = this.CurrentMonth + 1;
    }

    this.showCurrent();
};

// Goes to previous month
Calendar.prototype.previousMonth = function () {
    if (this.CurrentMonth == 0) {
        this.CurrentMonth = 11;
        this.CurrentYear = this.CurrentYear - 1;
    } else {
        this.CurrentMonth = this.CurrentMonth - 1;
    }
    this.showCurrent();
};
//
Calendar.prototype.previousYear = function () {
    this.CurrentYear = this.CurrentYear - 1;
    this.showCurrent();
}
Calendar.prototype.nextYear = function () {
    this.CurrentYear = this.CurrentYear + 1;
    this.showCurrent();
}

// Show current month
Calendar.prototype.showCurrent = function () {
    this.Calendar(this.CurrentYear, this.CurrentMonth);
};

// Show month (year, month)

Calendar.prototype.Calendar = function (y, m) {
    var x;
    var vagtliste = [];
    var vagt1 = {year: 2016, month: 11, day: 16, startTime: "18:00", endTime: "22:00"};
    vagtliste.push(vagt1);
    var vagt2 = {year: 2016, month: 11, day: 20, startTime: "18:00", endTime: "22:00"};
    vagtliste.push(vagt2);
    vagtliste.push({year: 2016, month: 11, day: 21, startTime: "20:00", endTime: "00:00"});
    typeof(y) == 'number' ? this.CurrentYear = y : null;
    typeof(y) == 'number' ? this.CurrentMonth = m : null;
    // 1st day of the selected month
    var firstDayOfCurrentMonth = new Date(y, m, 1).getDay();
    var lastDateOfCurrentMonth = new Date(y, m + 1, 0).getDate();
    var lastDateOfLastMonth = m == 0 ? new Date(y - 1, 11, 0).getDate() : new Date(y, m, 0).getDate();
    var monthandyearhtml = '<span id="monthandyearspan">' + this.Months[m] + ' - ' + y + '</span>';
    var html = '<table>';

    // Write the header of the days of the week
    html += '<tr>';
    for (var i = 0; i < 7; i++) {
        html += '<th class="daysheader">' + this.DaysOfWeek[i] + '</th>';
    }
    html += '</tr>';
    var p = dm = this.f == 'M' ? 1 : firstDayOfCurrentMonth == 0 ? -5 : 2;

    if (this.f == 'M') {
        dm = 1;

        p = dm;
    } else {
        if (firstDayOfCurrentMonth == 0) {
            firstDayOfCurrentMonth == -5;
        } else {
            firstDayOfCurrentMonth == 2;
        }
    }
    var cellvalue;

    for (var d, i = 0, z0 = 0; z0 < 6; z0++) {
        html += '<tr>';
        for (var z0a = 0; z0a < 7; z0a++) {
            d = i + dm - firstDayOfCurrentMonth;
            // Dates from prev month
            if (d < 1) {
                cellvalue = lastDateOfLastMonth - firstDayOfCurrentMonth + p++;
                html += '<td id="prevmonthdates">' +
                    '<span id="cellvaluespan">' + (cellvalue) + '</span><br/>' +
                    '</td>';

                // Dates from next month
            } else if (d > lastDateOfCurrentMonth) {
                html += '<td id="nextmonthdates">' + (p++) + '</td>';
                // Current month dates
            } else {
                //indsæt vagt dato her
                x = false;

                for(var q in vagtliste) {
                    if (d == vagtliste[q].day && this.CurrentMonth+1 == vagtliste[q].month) {
                        x = true;
                        var dato = '<li>' + vagtliste[q].year + '/' + vagtliste[q].month + '/' + vagtliste[q].day + '<br> Fra: ' + vagtliste[q].startTime + '<br> Til: ' + vagtliste[q].endTime + '</li>';
                        p = 1;
                    }
                }

                if(x) {
                    html += '<td id="currentmonthdates">'+ (d) + '<ul id="cellvaluelist">'  + dato + '</ul>' + '</td>';
                } else if(x == false)
                {
                    html += '<td id="currentmonthdates">' + (d) + '</td>';
                }

            }

            if (i % 7 == 6 && d >= lastDateOfCurrentMonth) {
                z0 = 10; // no more rows
            }
            i++;
        }

        html += '</tr>';
    }

    // Closes table
    html += '</table>';

    // Write HTML to the div

    document.getElementById("monthandyear").innerHTML = monthandyearhtml;
    document.getElementById(this.divId).innerHTML = html;
};


// On Load of the window
window.onload = function () {
    // Start calendar
    var c = new Calendar({
        ParentID: "divcalendartable",

        DaysOfWeek: [
            'MON',
            'TUE',
            'WED',
            'THU',
            'FRI',
            'SAT',
            'SUN'
        ],

        Months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],

        Format: 'dd/mm/yyyy'
    });

    c.showCurrent();

    // Bind next and previous button clicks
    $('#btnPrev').on('click', function () {
        c.previousMonth();
    });

    $('#btnPrevYr').on('click', function () {
        c.previousYear();
    });

    $('#btnNext').on('click', function () {
        c.nextMonth();
    });

    $('#btnNextYr').on('click', function () {
        c.nextYear();
    });
};



