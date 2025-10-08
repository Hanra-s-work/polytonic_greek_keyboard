console.log("tools/call_when_loaded.js loading");

function call_when_loaded(function_to_call, function_arguments = []) {
    document.addEventListener('DOMContentLoaded', function () { function_to_call(...function_arguments); }, false);
    console.log(`call_when_loaded: ${function_to_call.name} has been set to be called on DOMContentLoaded`);
}

export { call_when_loaded };

console.log("tools/call_when_loaded.js loaded");
