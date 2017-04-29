(() => {
    let sidebarToggled = false;

    $('.sidebar-toggle button').on('click', function (event) {
        if (sidebarToggled) {
            $('.container-app').removeClass('toggled');
        } else {
            $('.container-app').addClass('toggled');
        }

        sidebarToggled = !sidebarToggled;
        console.log('clicked');
    });

    console.log('interactions');
})();
