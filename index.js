$(document).ready(function () {
    $('.window-close').on('click', function(origin, targets) {
        browser.ipcRenderer.send('main-window-close');
    });
});