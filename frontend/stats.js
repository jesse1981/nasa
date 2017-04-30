// var data = [{
//     x: ['2013-10-04 22:23:00', '2013-11-04 22:23:00', '2013-12-04 22:23:00'],
//     y: [1, 3, 6],
//     type: 'scatter'
// }];

// var layout = {
//     title: 'Sea rise level for the next 100 years',
//     showlegend: false
// };
// var options = {
//     scrollZoom: true, // lets us scroll to zoom in and out - works
//     showLink: false, // removes the link to edit on plotly - works
//     displayLogo: false, // this one also seems to not work
//     displayModeBar: false, //this one does work
// };

// Plotly.newPlot('myDiv', data, layout, options);

$('#helloWorld').on('click', function(event) {
    event.preventDefault();

    var first = $('#first').val();
    var second = $('#second').val();
    var third = $('#third').val();
    var fourth = $('#fourth').val();
    var fifth = $('#fifth').val();
    var sixth = $('#sixth').val();
    var seventh = $('#seventh').val();
    var eight = $('#eight').val();
    var nineth = $('#nineth').val();
    // var tenth = $('#tenth').val();

    data = {
        'first': first,
        'second': second,
        'third': third,
        'fourth': fourth,
        'fifth': fifth, 
        'sixth': sixth, 
        'seventh': seventh, 
        'eight': eight,
        'nineth': nineth,
        // 'tenth': tenth,
    }
    console.log(data);
    $.ajax({
        url: "https://nasa-saibottrenham.c9users.io:8080/data",
        xhrFields: {
            withCredentials: true
        },
        type: "POST",
        crossDomain: true,
        data: {
            'value': data
        },
        success: function(result) {
            floodMapBox.updateSeaLevel(parseInt(result)/10);
            flood3dMap.updateSeaLevel(parseInt(result)/10);
            console.log(result);
        }
    });
     /* your code here */
});
