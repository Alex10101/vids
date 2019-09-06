let pages = 3;
let itemsPerPage = 3;
let responseMaxResults = 5;

let vidsElement = document.getElementById("content");

function setVidsClass() {
    let initClasses = {
        "1": "one_block",
        "2": "two_blocks",
        "3": "",
    };

    window.innerWidth < 1200 && (itemsPerPage = 2);
    window.innerWidth < 800 && (itemsPerPage = 1);

    vidsElement.className = initClasses[itemsPerPage] + " skip_transition";
    setTimeout(() => vidsElement.className = initClasses[itemsPerPage], 0);
}

setAutocomplete(document.getElementById("autocomplete_search"));
setVidsClass();

init();

function init() {
    let indicatorsContainer = document.getElementsByClassName("indicators-container")[0];
    let indicatorsSlider = document.getElementById("indicators-slider");
    nextData(itemsPerPage);

    let vids = vidsConstructor(data);
    let buttons = buttonsConstructor([data]);

    function changeSize(num) {
        buttons.disableLast();
        indicatorsSlider.innerHtml = "";
        vidsElement.innerHTML = "";
        itemsPerPage = num;
        nextData(itemsPerPage);
        vids = vidsConstructor(data);
        buttons = buttonsConstructor([data]);
        setVidsClass();
    }

    window.onresize = () => {
        let itemSize = 400;
        let num = Math.floor(window.innerWidth / itemSize);

        let checkSize = num !== 0 && itemsPerPage !== num && num <= pages;

        if (checkSize) {
            changeSize(num);
        }
    };

    indicatorsContainer.onclick = (e) => {
        if (e.target.className.indexOf("indicators-button") > -1) {
            let symbol = e.target.textContent.trim();

            let config = {
                ">": next,
                "<": prev,
            };

            config[symbol] ? config[symbol]() : sub(e);

            function repaintAll() {
                nextData(itemsPerPage);
                vids.repaint(data);
                buttons.repaint([data]);
            }

            function sub(e) {
                buttons.sub(e);
                vids.sub(e.target.textContent);
            }

            function next() {
                if (buttons.next(symbol) === false) {
                    repaintAll();
                    setTimeout(() => {
                        buttons.next();
                        vids.next();
                    }, 10);
                    return;
                }
                vids.next();
            }

            function prev() {
                buttons.disableLast();
                buttons.prev(symbol);
                vids.prev();
            }

        }
    };

    // setInterval(() => {
    //   indicators_next.click()
    // }, 10)
}
