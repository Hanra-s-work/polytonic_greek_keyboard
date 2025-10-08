
function auto_reload_triggerer() {
    const delay_ms = 10000;
    const reload = false;
    let shown = false;
    console.log(`Waiting a ${delay_ms}ms before reloading`);
    if (reload === true) {
        document.addEventListener(
            'DOMContentLoaded',
            function () {
                window.Tools.auto_reload(delay_ms, false)
            }
        );
    } else {
        document.addEventListener(
            'DOMContentLoaded',
            function () {
                if (shown === false) {
                    window.Tools.KeyLister.key_lister();
                    shown = true;
                }
            }
        );
    };
}

function keyboard_injector_triggerer() {

    document.addEventListener(
        'DOMContentLoaded',
        function () {
            window.Keyboard.Injectors.InjectKeyboard();
        }
    );
}

auto_reload_triggerer();
keyboard_injector_triggerer();
