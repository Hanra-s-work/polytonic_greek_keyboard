console.log("js/keyboard.mjs initialising");

import { Constants } from './constants/constants.mjs';
import { Actions } from './actions/actions.mjs';
import { Injectors } from './injectors.mjs';

const Keyboard = {
    Actions,
    Injectors,
    Constants
};

export { Keyboard };
window.Keyboard = Keyboard;

console.log("js/keyboard.mjs initialised");
