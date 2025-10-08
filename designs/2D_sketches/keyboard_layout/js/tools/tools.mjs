console.log("js/tools.mjs initialising");

import { auto_reload } from './auto_reload.js';
import { call_when_loaded } from './call_when_loaded.js';
import { clearer } from './clearer.js';
import { KeyLister } from './key_lister.js';
import { checkImageExists } from './image_checker.js';
import { sleep } from './sleep.js';
import { spacer } from './spacer.js';

export const Tools = {
    sleep,
    spacer,
    clearer,
    KeyLister,
    auto_reload,
    call_when_loaded,
    checkImageExists
};

window.Tools = Tools;

console.log("js/tools.mjs initialised");
