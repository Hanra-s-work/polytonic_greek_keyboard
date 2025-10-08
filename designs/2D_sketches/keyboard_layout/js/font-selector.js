/*
** EPITECH PROJECT, 2024
** area-rattrapage
** File description:
** font-selector.js
*/

console.log("js/font-selector initialising");

const fonts = ["Arial", "Verdana", "Courier New", "Times New Roman", "Georgia", "OpenDyslexic", "OpenDyslexic 3", "OpenDyslexic3", "OpenDyslexicAlta", "OpenDyslexicMono"];
const fontCookieName = "font";

function applyFontOverride(font) {
    console.log("applyFontOverride called");
    document.body.style.fontFamily = font;

    const styleId = "custom-font-style";
    let styleTag = document.getElementById(styleId);
    if (!styleTag) {
        styleTag = document.createElement("style");
        styleTag.id = styleId;
        document.head.appendChild(styleTag);
    }
    styleTag.innerHTML = `body, .container, .navbar { font-family: '${font}', sans-serif !important; }`;

    document.documentElement.style.setProperty("--bs-body-font-family", `'${font}', sans-serif`);
    console.log("applyFontOverride finished");
}

function populateDropdown(dropdownId, options) {
    console.log("populateDropdown called");
    const dropdown = document.getElementById(dropdownId);
    if (!dropdown) {
        console.error(`Dropdown with ID '${dropdownId}' not found.`);
        return;
    }

    dropdown.innerHTML = "";
    options.forEach(option => {
        const optElement = document.createElement("option");
        optElement.value = option;
        optElement.textContent = option;
        optElement.style.fontFamily = option;
        dropdown.appendChild(optElement);
    });
    console.log("populateDropdown finished");
}

function initializeFont() {
    console.log("initializeFont called");
    const fontCookie = window.cookie_manager.readCookie(fontCookieName);
    if (fontCookie) {
        const font = fontCookie;
        applyFontOverride(font);
        const dropdown = document.getElementById("fontSelector");
        if (dropdown) {
            dropdown.value = font;
        }
    } else {
        applyFontOverride(fonts[0]);
        window.cookie_manager.createCookie(fontCookieName, fonts[0]);
        const dropdown = document.getElementById("fontSelector");
        if (dropdown) {
            dropdown.value = fonts[0];
        }
    }
    console.log("initializeFont finished");
}

function updateFont(dropdown) {
    console.log("updateFont called");
    const selectedFont = dropdown.value.trim();
    applyFontOverride(selectedFont);
    window.cookie_manager.createCookie(fontCookieName, selectedFont, 365);
    console.log("updateFont finished");
}

async function waitForCookieManager(retries = 10, interval = 100) {
    for (let attempts = 0; attempts < retries; attempts++) {
        if (window.cookie_manager) {
            return true;
        }
        
        await new Promise(resolve => setTimeout(resolve, interval));
    }
    
    console.error("Cookie manager failed to load after " + retries + " attempts.");
    return false;
}

// Initialise when the page is loaded
async function initialise() {
    console.log("initialise function from font-selector.js called");
    const cookieManagerReady = await waitForCookieManager();
    if (cookieManagerReady) {
        populateDropdown("fontSelector", fonts);
        initializeFont();
    }
    console.log("initialise function from font-selector.js finished");
}

document.addEventListener("DOMContentLoaded", initialise);

console.log("js/font-selector initialised");
