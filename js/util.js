let deferredData = [];

function chunk(array, size) {
    if (deferredData.length + array.length < size) {
        deferredData = [...deferredData, ...array];
        return false;
    }

    let chunks = [];

    if (deferredData.length > size) {
        let deferredDump = [...deferredData];
        deferredData = [];
        chunks = chunk(deferredDump, size);
    }

    if (deferredData.length) {
        chunks.push(deferredData);
        deferredData = [];
    }

    for (let i = 0; i < array.length; i++) {
        const lastChunk = chunks[chunks.length - 1];
        if (!lastChunk || lastChunk.length === size) {
            chunks.push([array[i]]);  // insert new chunk
        } else {
            lastChunk.push(array[i]); // add to lastChunk
        }
    }

    const findChunk = () => {
        let page = false;
        let last = size;
        chunks.forEach((item, index) => {
            let len = item.length;
            if (item.length !== last) {
                page = index;
            }
            last = len;
        });

        return page; // first page is 0
    };

    let unequalChunk = findChunk();
    if (unequalChunk && unequalChunk > -1) {
        deferredData = chunks.pop();
    }

    return chunks;
}


function createElement(elementName, className, propsObj) {
    let div = document.createElement(elementName);
    className && (div.className = className);
    if (propsObj) {
        Object.keys(propsObj)
        .forEach((key) => {
            div[key] = propsObj[key];
        });
    }
    return div;
}


function subscribeColorConstructor() {
    let pubSub = {
        func: false,

        sub(func) {
            this.func = func;
        },

        once() {
            if (this.func) {
                this.func();
                this.func = false;
            }
        }
    };

    let subscribeElement = {
        element: false,
        classNameToSet: null,

        set(elem, classNameToSet) {
            this.element = elem;
            this.classNameToSet = classNameToSet;
        },

        next() {
            if (!this.element || !this.element.nextSibling) {
                return false;
            }
            setClassAndNext(this.element.nextSibling, this.classNameToSet);
            return true;
        },

        prev() {
            if (!this.element || !this.element.previousSibling) {
                return false;
            }
            setClassAndNext(this.element.previousSibling, this.classNameToSet);
            return true;
        }
    };

    function setClassAndNext(elem, className) {
        pubSub.once();
        let oldClass = elem.className;
        elem.className += " " + className;
        pubSub.sub(() => elem.className = oldClass);
        subscribeElement.set(elem, className);
    }

    return {
        sub: setClassAndNext,
        subs: subscribeElement,
        disableLast() {
            pubSub.once();
        }
    };
}


function subscribeSliderConstructor(className = "active") {
    let pubSub = {
        arr: [],

        sub(func) {
            this.arr.push(func);
        },

        last() {
            if (this.arr.length) {
                this.arr.pop()();
            }
        }
    };

    let subscribeElement = {
        element: [],
        classNameToSet: " " + className,

        set(elem) {
            this.element.push(elem);
        },

        next() {
            let i = this.element.length - 1;
            if (!this.element.length || !this.element[i].nextSibling) {
                return false;
            }
            setClassAndNext(this.element[i].nextSibling, this.classNameToSet);
            return true;
        },

        prev() {
            let i = this.element.length - 1;
            if (!this.element.length || !this.element[i].previousSibling) {
                return false;
            }

            this.element.pop();
            pubSub.last();
            return true;
        }
    };

    function setClassAndNext(elem, className) {
        let oldClass = elem.className;
        elem.className += " " + className;
        pubSub.sub(() => elem.className = oldClass);
        subscribeElement.set(elem, className);
    }

    return {
        sub: setClassAndNext,
        subs: subscribeElement
    };
}


function appendSlider(parent, appendChilds, local_data, setClassAndNext) {
    let activeSet = false;

    function appendToParent(num, local_index, local_arr) {
        let slider = createElement("div", "slider");
        for (let i = 0; i < num; i++) {
            appendChilds(slider, i, local_arr);
        }

        if (!activeSet) {
            setClassAndNext && setClassAndNext.sub(slider, "active");
            activeSet = true;
        }
        parent.appendChild(slider);
    }

    local_data.forEach((arr, i) => appendToParent(arr.length, i, arr));
}


function fillDots(num) {
    return joinChunkFromEnd(num.split(""), 3)
    .join(".");
}


function joinChunkFromEnd(arr, len) {
    let chunks = [];

    while (arr.length !== 0) {
        chunks.push(arr.splice(-len)
        .join(""));
    }

    return chunks.reverse();
}


// [[1, 2, 3], [1, 2, 3]]
// [[1, 2], [1, 2, 3]] <- pop first
// [[1, 2], [3, 1, 2, 3]] <- push to next
// [[1, 2], [3, 1], [2, 3]] <- split next

// [[1, 2, 3], [1, 2, 3], [1, 2, 3]]
// [[1, 2], [1, 2, 3], [1, 2, 3]]      <- pop first
// [[1, 2], [3, 1, 2, 3], [1, 2, 3]]   <- push to next
// [[1, 2], [3, 1], [2, 3], [1, 2, 3]] <- split next(if /2)
// [[1, 2], [3, 1], [2, 3], [1, 2]]    <- pop next
// [[1, 2], [3, 1], [2, 3], [1, 2]]    <- flush last(if !/2)

// setCurrent Position
// count new offset
// compare positions
// move buttons and vids to old offset


// changeSize(1)

// setInterval(() => changeSize(2), 1000)
// setInterval(() => changeSize(3), 3000)
// setInterval(() => changeSize(1), 2000)


function animate() {  //  moves slider forward and backward
    let prev = document.getElementById("indicators_prev");
    let next = document.getElementById("indicators_next");
    let stop = 4;
    let timer = 200;

    function add(i = 0) {
        function func() {
            clear(i);
            next.click();

            i++;
        }

        let int = setInterval(func, timer);

        function clear(i) {
            if (i === stop) {
                clearInterval(int);
                del();
            }
        }
    }

    function del(i = 0) {
        function func() {
            clear(i);
            prev.click();
            i++;
        }

        let int = setInterval(func, timer);

        function clear(i) {
            if (i === stop) {
                clearInterval(int);
                add();
            }
        }
    }

    add();
}


