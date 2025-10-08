/*
** EPITECH PROJECT, 2024
** area-rattrapage
** File description:
** db_manager.mjs
*/

console.log("js/indexeddb_manager initialising");

const DB_NAME = "dashboardDB";
const STORE_NAME = "keyValueStore";

function openDb(callback) {
    let request = indexedDB.open(DB_NAME, 1);

    request.onupgradeneeded = function (event) {
        let db = event.target.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
            db.createObjectStore(STORE_NAME, { keyPath: "key" });
        }
    };

    request.onsuccess = function (event) {
        callback(event.target.result);
    };

    request.onerror = function (event) {
        console.error("IndexedDB error:", event.target.errorCode);
    };
}

function create(key, value) {
    openDb(db => {
        let transaction = db.transaction(STORE_NAME, "readwrite");
        let store = transaction.objectStore(STORE_NAME);
        store.put({ key, value });
    });
}

async function read(key) {
    const value = await new Promise((resolve, reject) => {
        openDb(db => {
            let transaction = db.transaction(STORE_NAME, "readonly");
            let store = transaction.objectStore(STORE_NAME);
            let request = store.get(key);

            request.onsuccess = function () {
                resolve(request.result ? request.result.value : null);
            };

            request.onerror = function () {
                reject(request.error || new Error("Failed to fetch value"));
            };
        });
    });

    console.log(`Value for key ${key}: ${value}`);
    return value;
}

function remove(key) {
    openDb(db => {
        let transaction = db.transaction(STORE_NAME, "readwrite");
        let store = transaction.objectStore(STORE_NAME);
        store.delete(key);
    });
}

function display() {
    openDb(db => {
        let transaction = db.transaction(STORE_NAME, "readonly");
        let store = transaction.objectStore(STORE_NAME);
        let request = store.openCursor();
        console.log("Stored Entries:");

        request.onsuccess = function (event) {
            let cursor = event.target.result;
            if (cursor) {
                console.log(`Key: ${cursor.key}, Value: ${cursor.value.value}`);
                cursor.continue();
            }
        };
    });
}

function clearAll() {
    openDb(db => {
        let transaction = db.transaction(STORE_NAME, "readwrite");
        let store = transaction.objectStore(STORE_NAME);
        store.clear();
    });
}

function countEntries(callback) {
    openDb(db => {
        let transaction = db.transaction(STORE_NAME, "readonly");
        let store = transaction.objectStore(STORE_NAME);
        let request = store.count();

        request.onsuccess = function () {
            callback(request.result);
        };
    });
}

console.log("js/indexeddb_manager initialised");

const indexedDBManager = {
    create,
    read,
    remove,
    display,
    clearAll,
    countEntries
};

export { indexedDBManager };

window.indexedDB_manager = indexedDBManager;
