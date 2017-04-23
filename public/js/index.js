$(document).ready(function() {
    // Setup popovers
    initBootstrapAddons();
});
function initBootstrapAddons() {
    $("[data-toggle=popover]").popover();
}