// tools/key_lister.js
console.log("tools/key_lister.js initialising");

let Keys = [];
let currentKey = null;
let capturing = false;
let panel = null;
let statusDiv = null;

function initPanel() {
    panel = document.createElement("div");
    panel.style.position = "fixed";
    panel.style.top = "10px";
    panel.style.right = "10px";
    panel.style.padding = "16px";
    panel.style.background = "#eee";
    panel.style.border = "2px solid #444";
    panel.style.zIndex = 9999;
    panel.style.fontFamily = "monospace";
    panel.style.maxWidth = "300px";
    panel.style.boxShadow = "0 4px 8px rgba(0,0,0,0.3)";
    panel.style.borderRadius = "8px";

    const infoText = document.createElement("div");
    infoText.innerText = "Click 'Capture Key' to start.\nThen click 'Next Key' for the next physical key.\nFinish to output.";
    panel.appendChild(infoText);

    statusDiv = document.createElement("div");
    statusDiv.style.marginTop = "8px";
    statusDiv.style.fontWeight = "bold";
    statusDiv.innerText = "Idle";
    panel.appendChild(statusDiv);

    const captureBtn = document.createElement("button");
    captureBtn.innerText = "Capture Key";
    captureBtn.addEventListener("click", startCapture);
    captureBtn.style.marginTop = "8px";
    panel.appendChild(captureBtn);

    const nextBtn = document.createElement("button");
    nextBtn.innerText = "Next Key";
    nextBtn.style.marginLeft = "8px";
    nextBtn.addEventListener("click", nextKey);
    panel.appendChild(nextBtn);

    const finishBtn = document.createElement("button");
    finishBtn.innerText = "Finish";
    finishBtn.style.marginLeft = "8px";
    finishBtn.addEventListener("click", finishCapture);
    panel.appendChild(finishBtn);

    document.body.appendChild(panel);
}

function deletePanel() {
    if (panel) panel.remove();
    panel = null;
    statusDiv = null;
}

function updateStatus(text) {
    if (statusDiv) statusDiv.innerText = text;
}

function keyDownHandler(event) {
    if (!capturing) return;
    event.preventDefault();

    if (!currentKey.key) {
        currentKey.key = event.code;
        currentKey.display_row1 = event.key;
        updateStatus(`Captured normal: ${event.key}`);
        console.log(`Captured normal: ${event.key}`);
    } else if (!currentKey.keyShift && event.shiftKey) {
        currentKey.keyShift = event.key;
        currentKey.display_row2 = event.key;
        updateStatus(`Captured Shift: ${event.key}`);
        console.log(`Captured Shift: ${event.key}`);
    } else if (!currentKey.keyAltGr && event.getModifierState("AltGraph")) {
        currentKey.keyAltGr = event.key;
        currentKey.display_row3 = event.key;
        updateStatus(`Captured AltGr: ${event.key}`);
        console.log(`Captured AltGr: ${event.key}`);
    }
}

function startCapture() {
    const id = prompt("Enter unique id for this key:") || "";
    if (!id) {
        updateStatus("Capture cancelled.");
        return;
    }
    currentKey = {
        colspan: 1,
        rowspan: 1,
        display_row1: "",
        display_row2: "",
        display_row3: "",
        id,
        key: "",
        keyShift: "",
        keyAltGr: ""
    };
    capturing = true;
    updateStatus(`Capturing key for id: ${id}`);
    console.log("Capturing key...");
}


function nextKey() {
    if (!currentKey) {
        updateStatus("No key captured yet.");
        return console.log("No key captured yet.");
    }
    if (!Keys.some(e => e.id === currentKey.id)) Keys.push(currentKey);
    else console.log(`Skipped: id "${currentKey.id}" already exists.`);
    capturing = false;
    currentKey = null;
    updateStatus("Idle. Click 'Capture Key' for the next key.");
}

function finishCapture() {
    if (currentKey && !Keys.some(e => e.id === currentKey.id)) Keys.push(currentKey);
    console.log("\nFinal Keys array:");
    console.log(JSON.stringify(Keys, null, 4));
    window.removeEventListener("keydown", keyDownHandler);
    if (panel) panel.remove();
    updateStatus("Finished");
}

function key_lister() {
    Keys = [];
    currentKey = null;
    capturing = false;

    // console.clear();
    console.log("Key Lister initialized. Use the floating panel for input.");

    initPanel();
    window.addEventListener("keydown", keyDownHandler);
    // deletePanel();
    return Keys;
}

const KeyLister = { key_lister, Keys, currentKey };
export { KeyLister };
console.log("tools/key_lister.js initialised");
