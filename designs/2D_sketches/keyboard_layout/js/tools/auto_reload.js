
console.log("tools/auto_reload.js loading");
function reload_page(alert_user = true) {
    if (alert_user) {
        alert("Reloading");
    }
    location.reload();
}


function auto_reload(delay, alert_user = true) {
    setTimeout(function () { reload_page(alert_user) }, delay);
}

export { auto_reload, reload_page };

console.log("tools/auto_reload.js loaded");

// Usage: auto_reload(5000); // Reloads the page after 5000 milliseconds (5 seconds)
