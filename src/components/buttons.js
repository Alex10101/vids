import {
  appendSlider,
  countPointsToSetColor,
  createElement,
  subscribeColorConstructor,
  subscribeSliderConstructor
} from 'utils';

const indicatorsPrev = document.getElementById('indicators_prev');
const indicatorsSlider = document.getElementById('indicators-slider');

export default function buttonsConstructor(globalData) {
  let colorSub = subscribeColorConstructor();
  const sliderSub = subscribeSliderConstructor();

  colorSub = {
    ...colorSub,
    nextPageArr: [],
    prevPageArr: [],
    thisPageActive: 0,

    nextPageActive() {
      this.thisPageActive += 1;
      this.sub(this.nextPageArr[this.thisPageActive], 'red');
    },

    prevPageActive() {
      if (this.thisPageActive !== 0) {
        this.thisPageActive -= 1;
        this.subs.element = this.prevPageArr[this.thisPageActive];

        // this.sub(this.prevPageArr[this.thisPageActive], 'red')
        setTimeout(() => {
          this.sub(this.prevPageArr[this.thisPageActive], 'red');
        }, 50);
      }
    },

    hasPrev() {
      return this.subs.element.previousSibling;
    }
  };

  // Executes colorSub with first created button
  let i = 1; // increment for appendButton
  function appendButton(data, colorizeArg = true) {
    const points = countPointsToSetColor(data, i);
    let pushedToDefaultPageState = false;
    let colorize = colorizeArg;

    return function(parent) {
      const config = {
        textContent: i++
      };

      const button = createElement('button', 'indicators-button', config);

      if (colorize) {
        colorSub.sub(button, 'red');
        colorize = false;
      }

      if (!pushedToDefaultPageState) {
        colorSub.nextPageArr.push(button); // Error. If data = [[1, 2, 3]] it pushes the first created button but works and not works either way
        pushedToDefaultPageState = true;
      }

      if (points[i - 1]) colorSub.nextPageArr.push(button);
      if (points.prev[i - 1]) colorSub.prevPageArr.push(button);

      parent.appendChild(button);
    };
  }

  function appendData(data) {
    // Sets newly created sliderSub active
    appendSlider(indicatorsSlider, appendButton(data, false), data);
  }

  let prevActive = false;
  const setPrevActive = () => {
    indicatorsPrev.className = 'indicators-button';
    prevActive = true;
  };

  const setPrevInactive = () => {
    indicatorsPrev.className += ' inactive';
    prevActive = false;
  };

  function prevButton(symbol) {
    if (!prevActive && symbol !== '1') setPrevActive();
    if (symbol === '1') setPrevInactive();
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

  // eslint-disable-next-line consistent-return
  function next(symbol) {
    prevButton(symbol);

    const elementsToColorize = () => colorSub.subs.next();

    const getNextSlide = () => {
      if (sliderSub.subs.next()) {
        setTimeout(colorSub.nextPageActive.bind(colorSub), 100);
        // colorSub.nextPageActive.bind(colorSub)
        return true;
      }
      return false;
    };

    if (!elementsToColorize() && !getNextSlide()) return false;
  }

  appendSlider(indicatorsSlider, appendButton(globalData), globalData, sliderSub);

  return {
    next,
    prev,
    sub(e) {
      prevButton(e.target.textContent);
      colorSub.sub(e.target, 'red');
    },
    repaint(newData) {
      appendData(newData);
    },
    disableLast() {
      colorSub.disableLast();
    },
    resize() {
      appendSlider(indicatorsSlider, appendButton(globalData), globalData, sliderSub);
    }
  };
}
