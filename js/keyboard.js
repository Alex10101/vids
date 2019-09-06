keysEvents();

function keysEvents() {
    let indicators_prev = document.getElementById("indicators_prev");
    let indicators_next = document.getElementById("indicators_next");
    let autocomplete_search = document.getElementById("autocomplete_search");

    let isPressed = {
        "Control": false
    };

    let secondStroke = {
        firstStroke: "Control",
        "ArrowRight": () => {
            indicators_next.click();
        },
        "ArrowLeft": () => {
            indicators_prev.click();
        }
    };

    let states = ["autocomplete", "indicators"];

    let stateNum = 1;
    let state = states[stateNum];

    function nextState() {
        stateNum++;
        if (stateNum > states.length - 1) stateNum = 0;
        state = states[stateNum];
    }

    window.onkeyup = (e) => {
        isPressed[e.key] && (isPressed[e.key] = false);
    };

    window.onkeydown = (e) => {
        if (e.defaultPrevented) {
            return;
        }

        if (isPressed[e.key] !== undefined) {
            isPressed[e.key] = true;
            return;
        }

        e.key === "Escape" && (state = "indicators");
        if (e.key.length === 1 && state !== "autocomplete") {
            state = "autocomplete";
            autocomplete_search.focus();
        }

        if (state !== "indicators") {
            return;
        }

        autocomplete_search.blur();

        // console.log(e.key, isPressed)

        if (isPressed[secondStroke.firstStroke] && secondStroke[e.key]) {
            secondStroke[e.key]();
            e.preventDefault();
        }
    };
}