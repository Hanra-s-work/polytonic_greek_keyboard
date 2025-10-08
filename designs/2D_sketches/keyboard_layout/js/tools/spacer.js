/*
** EPITECH PROJECT, 2024
** area-rattrapage
** File description:
** spacer.js
*/

console.log("tools/spacer initialising");

function spacer(spaces = 20) {
    console.log("Adding spacing to the console");
    for (let i = 0; i < spaces; i++) {
        if (i % 2 === 0) {
            console.log(".\n");
        } else {
            console.log("\n.");
        }
    }
    console.log("Added spacing to the console");
}

window.spacer = spacer;

export { spacer };

console.log("tools/spacer initialised");
