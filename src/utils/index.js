/* eslint prefer-template: 0 */

export function countPointsToSetColor(data, iArg) {
  const obj = { prev: {} };
  let page = 1;
  let i = iArg;

  data.forEach((item) => {
    i += item.length;
    obj[i] = 1;
    obj.prev[i - 1] = 1;
    page++;
  });

  obj.i = i;
  obj.page = page;
  return obj;
}

let deferredData = [];

export function chunk(array, size) {
  if (deferredData.length + array.length < size) {
    deferredData = [...deferredData, ...array];
    return false;
  }

  let chunks = [];

  if (deferredData.length > size) {
    const deferredDump = [...deferredData];
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
      chunks.push([array[i]]); // insert new chunk
    } else {
      lastChunk.push(array[i]); // add to lastChunk
    }
  }

  const findChunk = () => {
    let page = false;
    let last = size;
    chunks.forEach((item, index) => {
      const len = item.length;
      if (item.length !== last) {
        page = index;
      }
      last = len;
    });

    return page; // first page is 0
  };

  const unequalChunk = findChunk();
  if (unequalChunk && unequalChunk > -1) {
    deferredData = chunks.pop();
  }

  return chunks;
}

export function createElement(elementName, className, propsObj) {
  const div = document.createElement(elementName);
  if (className) div.className = className;
  if (propsObj) {
    Object.keys(propsObj).forEach((key) => {
      div[key] = propsObj[key];
    });
  }
  return div;
}

export function subscribeColorConstructor() {
  const pubSub = {
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

  const subscribeElement = {
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
      this.setClassAndNext(this.element.nextSibling, this.classNameToSet);
      return true;
    },

    prev() {
      if (!this.element || !this.element.previousSibling) {
        return false;
      }
      this.setClassAndNext(this.element.previousSibling, this.classNameToSet);
      return true;
    },

    setClassAndNext(elemArg, className) {
      const elem = elemArg;
      pubSub.once();
      const oldClass = elem.className;
      elem.className += ' ' + className;
      pubSub.sub(() => {
        elem.className = oldClass;
      });
      this.set(elem, className);
    }
  };

  return {
    sub: subscribeElement.setClassAndNext.bind(subscribeElement),
    subs: subscribeElement,
    disableLast() {
      pubSub.once();
    }
  };
}

export function subscribeSliderConstructor(className = 'active') {
  const pubSub = {
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

  const subscribeElement = {
    element: [],
    classNameToSet: ' ' + className,

    set(elem) {
      this.element.push(elem);
    },

    next() {
      const i = this.element.length - 1;
      if (!this.element.length || !this.element[i].nextSibling) {
        return false;
      }
      this.setClassAndNext(this.element[i].nextSibling, this.classNameToSet);
      return true;
    },

    setClassAndNext(elemArg, classNameArg) {
      const elem = elemArg;
      const oldClass = elem.className;
      elem.className += ' ' + classNameArg;
      pubSub.sub(() => {
        elem.className = oldClass;
      });
      subscribeElement.set(elem, classNameArg);
    },

    prev() {
      const i = this.element.length - 1;
      if (!this.element.length || !this.element[i].previousSibling) {
        return false;
      }

      this.element.pop();
      pubSub.last();
      return true;
    }
  };

  return {
    sub: subscribeElement.setClassAndNext.bind(subscribeElement),
    subs: subscribeElement
  };
}

export function appendSlider(parent, appendChilds, localData, setClassAndNext) {
  let activeSet = false;

  function appendToParent(num, localIndex, localArr) {
    const slider = createElement('div', 'slider');
    for (let i = 0; i < num; i++) {
      appendChilds(slider, i, localArr);
    }

    if (!activeSet) {
      if (setClassAndNext) setClassAndNext.sub(slider, 'active');
      activeSet = true;
    }
    parent.appendChild(slider);
  }

  localData.forEach((arr, i) => appendToParent(arr.length, i, arr));
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

/* eslint-disable */
export function animate() {
  const prev = document.getElementById('indicators_prev');
  const next = document.getElementById('indicators_next');
  const stop = 4;
  const timer = 200;

  function add(globalInc = 0) {
    function func() {
      clear(globalInc);
      next.click();

      globalInc++;
    }

    const int = setInterval(func, timer);

    function clear(i) {
      if (i === stop) {
        clearInterval(int);
        del();
      }
    }
  }

  function del(globalInc = 0) {
    function func() {
      clear(globalInc);
      prev.click();
      globalInc++;
    }

    const int = setInterval(func, timer);

    function clear(i) {
      if (i === stop) {
        clearInterval(int);
        add();
      }
    }
  }

  add();
}
