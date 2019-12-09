import { nextData } from 'store/data';
import constants from 'store/store';
import 'styles/index.scss';

import vidsConstructor from 'components/vids';
import buttonsConstructor from 'components/buttons';
import setAutocomplete from 'components/autocomplete';

const vidsElement = document.getElementById('content');
const setVidsClass = () => {
  const initClasses = {
    '1': 'one_block',
    '2': 'two_blocks',
    '3': ''
  };

  if (window.innerWidth < 1200) constants.itemsPerPage = 2;
  if (window.innerWidth < 800) constants.itemsPerPage = 1;

  vidsElement.className = `${initClasses[constants.itemsPerPage]} skip_transition`;
  setTimeout(() => {
    vidsElement.className = initClasses[constants.itemsPerPage];
  }, 0);
};

const init = () => {
  const indicatorsContainer = document.getElementsByClassName('indicators-container')[0];
  const indicatorsSlider = document.getElementById('indicators-slider');
  nextData(constants.itemsPerPage);

  let vids = vidsConstructor(constants.data);
  let buttons = buttonsConstructor([constants.data]);

  function changeSize(num) {
    buttons.disableLast();
    indicatorsSlider.innerHtml = '';
    vidsElement.innerHTML = '';
    constants.itemsPerPage = num;
    nextData(constants.itemsPerPage);
    vids = vidsConstructor(constants.data);
    buttons = buttonsConstructor([constants.data]);
    setVidsClass(constants.itemsPerPage);
  }

  window.onresize = () => {
    const itemSize = 400;
    const num = Math.floor(window.innerWidth / itemSize);
    const checkSize = num !== 0 && constants.itemsPerPage !== num && num <= constants.pages;

    if (checkSize) {
      changeSize(num);
    }
  };

  function repaintAll() {
    nextData(constants.itemsPerPage);
    vids.repaint(constants.data);
    buttons.repaint([constants.data]);
  }

  function sub(ev) {
    buttons.sub(ev);
    vids.sub(ev.target.textContent);
  }

  function next(arrow) {
    if (buttons.next(arrow) === false) {
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
    buttons.prev();
    vids.prev();
  }

  const config = {
    '>': next,
    '<': prev
  };

  indicatorsContainer.onclick = (e) => {
    if (e.target.className.indexOf('indicators-button') > -1) {
      const arrow = e.target.textContent.trim();
      if (config[arrow]) {
        config[arrow](arrow);
      } else {
        sub(e);
      }
    }
  };

  // setInterval(() => {
  //   indicators_next.click()
  // }, 10)
};

setVidsClass();
setAutocomplete(document.getElementById('autocomplete_search'));
init();
