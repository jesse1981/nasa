<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
<script type="text/javascript" src="../js/mustache.min.js"></script>
<script src='https://api.mapbox.com/mapbox.js/v3.1.0/mapbox.js'></script>
<script type="text/javascript">
$(document).ready(function(){
    $('div[data-template]').each(function(){
        $.when($.ajax({url: $(this).attr("data-template"), dataType: 'text'}),$.ajax({url: $(this).attr("data-model")}))
	.done(function(template, data){
            Mustache.parse(template[0]);
            var rendered = Mustache.render(template[0], {panels: data[0].panels});
            $(this).html(rendered);
	})
	.fail(function(){
            alert("Sorry there was an error on "+$(this).attr("name"));
	});
    });
});
</script>