let pages = 3;
let itemsPerPage = 3;
let responseMaxResults = 5;
let main;

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
    vidsElement.className = initClasses[itemsPerPage];
    setTimeout(() => vidsElement.className = initClasses[itemsPerPage], 0);
}

setAutocomplete(document.getElementById("autocomplete_search"));
setVidsClass();

main = init();

function init() {
    let page = 1;

    let indicatorsContainer = document.getElementsByClassName("indicators-container")[0];
    let indicatorsSlider = document.getElementById("indicators-sliders");

    nextData(itemsPerPage);

    let vids = vidsConstructor(data);
    let buttons = buttonsConstructor([data.slice((page - 1), (page - 1 + itemsPerPage))]);

    function setNullAndRepaint(num = Math.floor(window.innerWidth / 400)) {
        buttons.disableLast();
        indicatorsSlider.innerHTML = "";
        vidsElement.innerHTML = "";
        itemsPerPage = num;
        nextData(itemsPerPage);
        vids = vidsConstructor(data);
        buttons = buttonsConstructor([data.slice((page - 1), (page - 1 + itemsPerPage))]);
        setVidsClass();
    }

    window.onresize = () => {
        let itemSize = 400;
        let num = Math.floor(window.innerWidth / itemSize);

        let checkSize = num !== 0 && itemsPerPage !== num && num <= pages;

        if (checkSize) {
            setNullAndRepaint(num);
        }
    };

    function setNewData() {
        page = 1;
        buttons.repaint();
        vids.set(data[page - 1], page);
    }

    indicatorsContainer.onclick = (e) => {
        if (e.target.className.indexOf("indicators-button") > -1) {
            let symbol = e.target.textContent.trim();

            let config = {
                ">": next,
                "<": prev,
            };

            config[symbol] ? config[symbol]() : sub(e);

            function setNextData() {
                nextData(itemsPerPage, page);
                buttons.repaint([data.slice((page - 1), (page - 1 + itemsPerPage))], (page - 1));
            }

            function sub(e) {
                page = e.target.textContent;
                buttons.sub(e);
                vids.set(data[page - 1], page);
            }

            function next() {
                page++;
                if (page === data.length) setNextData();
                buttons.next();
                vids.set(data[page - 1], page);
            }

            function prev() {
                if (page - 1 < 1) return;
                page--;
                buttons.disableLast();
                buttons.prev(symbol);
                vids.set(data[page - 1], page);
            }
        }
    };
    return {
        setNewData
    };
}