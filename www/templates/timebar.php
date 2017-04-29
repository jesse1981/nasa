<div id="timebar">
    <span></span>
</div>
<script type="text/javascript">
(function() {
    var basetime    = new Date();
    var futuretime  = new Date("2117-12-31");
    var inc_int     = 3000;
    var inc_amt     = 7;
    var timer       = 0;

    function cycle() {
        if (basetime.getValue() < futuretime.getValue()) {
            basetime.setDate(basetime.getDate() + inc_amt);
            $('#timebar span').text(basetime.getValue());
            this.timer = setInterval("cycle",this.inc_int);
        }
    }

    cycle();
})();
</script>