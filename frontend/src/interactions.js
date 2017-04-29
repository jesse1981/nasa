(() => {
    let sidebarToggled = false;

    function setToggleVerticalMargin(height) {
        if ($(window).width() <= 320) {
            console.log(height);
            $('.MainContainer').css('padding-top', height);
            $('.sidebar-toggle button').css('top', height);
        }
    }

    $('.sidebar-toggle button').on('click', function (event) {
        if (sidebarToggled) {
            $('.container-app').removeClass('toggled');
            // setToggleVerticalMargin(0);
        } else {
            $('.container-app').addClass('toggled');
            // setToggleVerticalMargin($('.sidebar').height());
        }

        sidebarToggled = !sidebarToggled;
    });

    console.log('interactions');
})();
