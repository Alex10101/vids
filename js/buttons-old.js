function countPointsToSetColor(data, i) {
    let page = 1;
    let obj = {prev: {}};

    data.forEach(item => {
        i += item.length;
        obj[i] = 1;
        obj.prev[i - 1] = 1;
        page++;
    });

    obj.i = i;
    obj.page = page;
    return obj;
}

function buttonsConstructor(data) {
    let indicators_prev = document.getElementById("indicators_prev");
    let indicatorsSlider = document.getElementById("indicators-sliders");

    let colorSub = subscribeColorConstructor();
    let sliderSub = subscribeSliderConstructor();

    colorSub = {
        ...colorSub,
        nextPageArr: [],
        prevPageArr: [],
        thisPageActive: 0,

        nextPageActive() {
            this.thisPageActive += 1;
            this.sub(this.nextPageArr[this.thisPageActive], "red");
        },

        prevPageActive() {
            if (this.thisPageActive !== 0) {
                this.thisPageActive -= 1;
                this.subs.element = this.prevPageArr[this.thisPageActive];

                this.sub(this.prevPageArr[this.thisPageActive], 'red')
                // setTimeout(() => {
                //     this.sub(this.prevPageArr[this.thisPageActive], "red");
                // }, 50);
            }
        },

        hasPrev() {
            return this.subs.element.previousSibling;
        }
    };


    // Executes colorSub with first created button
    let i = 1; // increment for appendButton
    function appendButton(data, colorize = true) {
        let points = countPointsToSetColor(data, i);
        let pushedToDefaultPageState = false;

        return function (parent) {
            let config = {
                textContent: i++
            };

            let button = createElement("button", "indicators-button", config);

            if (colorize) {
                colorSub.sub(button, "red");
                colorize = false;
            }

            if (!pushedToDefaultPageState) {
                colorSub.nextPageArr.push(button); // Error. If data = [[1, 2, 3]] it pushes the first created button but works and not works either way
                pushedToDefaultPageState = true;
            }

            points[i - 1] && colorSub.nextPageArr.push(button);
            points.prev[i - 1] && colorSub.prevPageArr.push(button);

            parent.appendChild(button);
        };
    }


    function appendData(data) {
        // Sets newly created sliderSub active    
        appendSlider(indicatorsSlider, appendButton(data, false), data);
    }

    function prev(symbol) {
        prevButton(symbol);

        if (!colorSub.subs.prev()) {
            colorSub.prevPageActive();
            sliderSub.subs.prev();
        }

        if (colorSub.thisPageActive === 0 && !colorSub.hasPrev()) {
            setPrevInactive();
        }
    }


    let prevActive = false;
    const setPrevActive = () => {
        indicators_prev.className = "indicators-button";
        prevActive = true;
    };

    const setPrevInactive = () => {
        indicators_prev.className += " inactive";
        prevActive = false;
    };

    function prevButton(symbol) {
        !prevActive && symbol !== "1" && setPrevActive();
        symbol === "1" && setPrevInactive();
    }


    function next(symbol) {
        prevButton(symbol);

        const elementsToColorize = () => colorSub.subs.next();

        const getNextSlide = () => {
            if (sliderSub.subs.next()) {
                // setTimeout(colorSub.nextPageActive.bind(colorSub), 100);
                colorSub.nextPageActive.bind(colorSub)
                return true;
            }
            return false;
        };

        if (!elementsToColorize() && !getNextSlide()) return false;
    }

    appendSlider(indicatorsSlider, appendButton(data), data, sliderSub);

    return {
        next,
        prev,
        sub(e) {
            prevButton(e.target.textContent);
            colorSub.sub(e.target, "red");
        },
        repaint(newData) {
            appendData(newData);
        },
        disableLast() {
            colorSub.disableLast();
        },
        resize() {
            appendSlider(indicatorsSlider, appendButton(data), data, sliderSub);
        }
    };
}