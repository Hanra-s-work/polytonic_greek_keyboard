/*
** EPITECH PROJECT, 2024
** mockup
** File description:
** local_storage_manager.mjs
*/

console.log("js/local_storage_manager initialising");

function createVariable(key, value) {
    localStorage.setItem(key, value);
}

function createVariables(variables) {
    for (const [key, value] of Object.entries(variables)) {
        localStorage.setItem(key, value);
    }
}

function readVariable(key) {
    return localStorage.getItem(key);
}

function deleteVariable(key) {
    localStorage.removeItem(key);
}

function deleteVariables(keys) {
    keys.forEach(key => localStorage.removeItem(key));
}

function displayAllVariables() {
    if (localStorage.length === 0) {
        console.log("No accessible local storage variables found.");
        return;
    }

    console.log("Accessible Local Storage Variables:");
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        const value = localStorage.getItem(key);
        console.log(`Key: ${key}, Value: ${value}`);
    }
}

function clearAllVariables() {
    localStorage.clear();
    console.log("Local storage cleared");
    alert("Local Storage Cleared");
}

function countAllVariables() {
    return localStorage.length;
}

console.log("js/local_storage_manager initialised");

const localStorageManager = {
    createVariable,
    createVariables,
    readVariable,
    deleteVariable,
    deleteVariables,
    displayAllVariables,
    clearAllVariables,
    countAllVariables
};

export { localStorageManager }

window.local_storage_manager = localStorageManager;
