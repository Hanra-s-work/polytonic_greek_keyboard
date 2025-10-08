console.log("keyboard/injectors.mjs initialising");

import { Constants } from "./constants/constants.mjs";

function BuildKeyHTML(key) {
    return `
        <div class="key_switch" id="${key.id}" style="grid-column: span ${key.colspan}; grid-row: span ${key.rowspan};">
            <div class="key_display">
                <span class="display_row1">${key.display_row1}</span>
                <span class="display_row2">${key.display_row2}</span>
                <span class="display_row3">${key.display_row3}</span>
            </div>
        </div>
    `;
}

function InjectFunctionKeys(element) {
    console.log("InjectFunctionKeys called");
    if (!element) {
        console.error(`Element is empty, aborting function ${this.name}.`);
        return;
    };
    const function_keys = Constants.Keys.Functions;
    for (var i = 0; i < function_keys.length; i++) {
        element.innerHTML += BuildKeyHTML(function_keys[i]);
    }
    console.log("InjectFunctionKeys injected");
}

function InjectNumberKeys(element) {
    console.log("InjectNumberKeys called");
    if (!element) {
        console.error(`Element is empty, aborting function ${this.name}.`);
        return;
    };
    const keys = Constants.Keys.Numbers;
    for (var i = 0; i < keys.length; i++) {
        element.innerHTML += BuildKeyHTML(keys[i]);
    }
    console.log("InjectNumberKeys injected");
}

function InjectGeneralKeys(element) {
    console.log("InjectGeneralKeys called");
    if (!element) {
        console.error(`Element is empty, aborting function ${this.name}.`);
        return;
    };
    const keys = Constants.Keys.General;
    for (var i = 0; i < keys.length; i++) {
        element.innerHTML += BuildKeyHTML(keys[i]);
    }
    console.log("InjectGeneralKeys injected");
}
function InjectNumpadKeys(element) {
    console.log("InjectNumpadKeys called");
    if (!element) {
        console.error(`Element is empty, aborting function ${this.name}.`);
        return;
    };
    const keys = Constants.Keys.Numpad;
    for (var i = 0; i < keys.length; i++) {
        element.innerHTML += BuildKeyHTML(keys[i]);
    }
    console.log("InjectNumpadKeys injected");
}

function InjectLeds(element) {
    console.log("InjectLeds called");
    if (!element) {
        console.error(`Element is empty, aborting function ${this.name}.`);
        return;
    };
    for (var i = 0; i < Constants.leds.length; i++) {
        element.innerHTML += `
            <aside class="led_wrapper">
                <div class="led" id="${Constants.leds[i]}" onclick="window.Keyboard.Actions.toggle_led('${Constants.leds[i]}');"></div>
                <span class="led_label">${Constants.leds[i]}</span>
            </aside>
        `;
    }
    console.log("InjectLeds injected");
}

function InjectLogo(element) {
    console.log("InjectLogo called");
    if (!element) {
        console.error(`Element is empty, aborting function ${this.name}.`);
        return;
    };
    element.innerHTML += `<img src="${Constants.logo}" class="logo"/>`;
    console.log("InjectLogo injected");
}



function InjectKeyboard() {
    var function_keys_id = document.getElementById("function-keys"),
        number_keys_id = document.getElementById("number-keys"),
        general_keys_id = document.getElementById("general-keys"),
        inject_leds_id = document.getElementById("led-status"),
        brand_status_id = document.getElementById("brand-status"),
        numpad_keys_id = document.getElementById("numpad-keys");

    InjectFunctionKeys(function_keys_id);
    InjectNumberKeys(number_keys_id);
    InjectGeneralKeys(general_keys_id);
    InjectLeds(inject_leds_id);
    InjectLogo(brand_status_id);
    InjectNumpadKeys(numpad_keys_id);
}

const Injectors = {
    InjectKeyboard,
    InjectFunctionKeys,
    InjectNumberKeys,
    InjectGeneralKeys,
    InjectLeds,
    InjectLogo,
    InjectNumpadKeys

};
export { Injectors }
console.log("keyboard/injectors.mjs initialised");
