/*
** EPITECH PROJECT, 2024
** area-rattrapage
** File description:
** sleep.js
*/

console.log("tools/sleep initialising");
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

window.sleep = sleep;

export { sleep };

console.log("tools/sleep initialised");
