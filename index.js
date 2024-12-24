$(document).ready(async function () {
    $('.window-min').on('click', function() {
        browser.ipcRenderer.send('window-min');
    });

    $('.window-max').on('click', function() {
        browser.ipcRenderer.invoke('window-max');
        $(this).hide();
        $('.window-restore').show();
    });

    $('.window-restore').on('click', function() {
        browser.ipcRenderer.invoke('window-restore');
        $(this).hide();
        $('.window-max').show();
    });

    $('.window-close').on('click', function(origin, targets) {
        browser.ipcRenderer.send('window-close');
    });
});