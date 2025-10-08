console.log("keyboard/actions.mjs initialising");

function toggle_led(ID) {
    const element = document.getElementById(ID);
    if (!element) {
        console.warn(`Element with ID '${ID}' not found.`);
        return;
    };
    if (element.classList.contains("on")) {
        element.classList.remove("on");
    } else {
        element.classList.add("on");
    }
}

export const Actions = { toggle_led };
console.log("keyboard/actions.mjs initialised");
