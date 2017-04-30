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
$('#SeaRiseLevel').html('<h3>Sea rise in 100 years from now: 120.2 cm</h3>');

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

    if (first == 0){
        firstLink = '';
    } else{
        firstLink = '<a href="http://shrinkthatfootprint.com/solar-panel-origin">shrinkthatfootprint.com</a>';
    }
    if (second == 0){
        secondLink = '';
    } else{
        secondLink = '<a href="http://www.mnn.com/green-tech/research-innovations/blogs/how-much-co2-does-one-solar-panel-create">www.mnn.com</a>';
    }
    if (third == 0){
        thirdLink = '';
    }else{
        thirdLink = '<a href="https://www.solarmarket.com.au/carbon-reduction-solar-panels/">www.solarmarket.com</a>';
    }
    if (fourth == 0){
        fourthLink = '';
    }else{
        fourthLink = '<a href="http://shrinkthatfootprint.com/electric-car-emissions">shrinkthatfootprint.com</a>';
    }
    if (fifth == 0){
        fifthLink = '';
    }else{
        fifthLink = '<a href="http://www.gautrain.co.za/about/eia-emp/general/public-transport-reduces-greenhouse-gases-and-conserves-energy/">www.gautrain.co.za</a>';
    }
    if (sixth == 0){
        sixthLink = '';
    }else{
        sixthLink = '<a href="http://news.nationalgeographic.com/news/2014/06/140605-brazil-deforestation-carbon-emissions-environment/">news.nationalgeographic.com</a>';
    }
    if (seventh == 0){
        seventhLink = '';
    }else{
        seventhLink = '<a href="http://theconversation.com/can-eating-less-meat-really-tackle-climate-change-50884">theconversation.com</a>';
    }
    if (eight == 0){
        eightLink = '';
    }else{
        eightLink = '<a href="http://shrinkthatfootprint.com/food-carbon-footprint-diet">shrinkthatfootprint.com</a>';
    }
    if (nineth == 0){
        ninethLink = '';
    }else{
        ninethLink = '<a href="https://ourworld.unu.edu/en/eating-less-meat-essential-to-curb-climate-change-says-report">ourworld.unu.edu</a>';
    }

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
            $(useFullInformation).html('<ul><li>'+firstLink+'</li><li>'+secondLink+'</li><li>'+thirdLink+'</li><li>'+fourthLink+'</li><li>'+fifthLink+'</li><li>'+sixthLink+'</li><li>'+seventhLink+'</li><li>'+eightLink+'</li><li>'+ninethLink+'</li><ul>');
            $('#SeaRiseLevel').html('<h3>Sea rise in 100 years from now: '+ Math.round(result) / 10 +'cm</h3>');
            if (result > 1100){
            floodMapBox.updateSeaLevel(parseInt(result)/200);
            flood3dMap.updateSeaLevel(parseInt(result)/200);
        } else{
            floodMapBox.updateSeaLevel(parseInt(result)/400);
            flood3dMap.updateSeaLevel(parseInt(result)/400);
        }
            console.log(result);
        }
        
    });
     /* your code here */
});
