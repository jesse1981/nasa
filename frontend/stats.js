var data = [
  {
    x: ['2013-10-04 22:23:00', '2013-11-04 22:23:00', '2013-12-04 22:23:00'],
    y: [1, 3, 6],
    type: 'scatter'
  }
];

var layout = {
	title: 'Sea rise level for the next 100 years',
	showlegend: false};
var options = {
	scrollZoom: true, // lets us scroll to zoom in and out - works
	showLink: false, // removes the link to edit on plotly - works
	displayLogo: false, // this one also seems to not work
	displayModeBar: false, //this one does work
};
var plot = Plotly.newPlot('myDiv', data, layout, options);