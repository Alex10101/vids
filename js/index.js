// ToDo: Constants in separate file

function setContentClass() {
  let contentElement = document.getElementById("content");

  let initClasses = {
    "1": "one_block",
    "2": "two_blocks",
    "3": ""
  };

  window.innerWidth < 1200 && (itemsPerPage = 2);
  window.innerWidth < 800 && (itemsPerPage = 1);

  contentElement.className = initClasses[itemsPerPage] + " skip_transition";
  setTimeout(() => (contentElement.className = initClasses[itemsPerPage]), 0);
}

setAutocomplete(document.getElementById("autocomplete_search"));
setContentClass();
init();

function init() {
  let page = 1;
  let indicatorsContainer = document.getElementsByClassName(
    "indicators-container"
  )[0];

  nextData(itemsPerPage);

  let content = contentConstructor(data);
  let buttons = buttonsConstructor([
    data.slice(page - 1, page - 1 + itemsPerPage)
  ]);

  function setContent() {
    content.set(data[page - 1], page);
  }

  indicatorsContainer.onclick = e => {
    if (e.target.className.indexOf("indicators-button") > -1) {
      let symbol = e.target.textContent.trim();

      let config = {
        ">": next,
        "<": prev
      };

      config[symbol] ? config[symbol]() : sub(e);

      function sub(e) {
        if (page === e.target.textContent) return;
        page = e.target.textContent;
        buttons.sub(e);
        setContent();
      }

      function next() {
        page++;
        if (page === data.length) {
          nextData(itemsPerPage, page);
        }
        buttons.next();
        setContent();
      }

      function prev() {
        if (page - 1 < 1) return;
        page--;
        buttons.prev();
        setContent();
      }
    }
  };

  function resize(num = Math.floor(window.innerWidth / 400)) {
    itemsPerPage = num;
    let page = 0; // count needed state

    buttons.resize(page);
    content.resize(data[page - 1], page);
  }

  window.onresize = () => {
    let itemSize = 400;
    let num = Math.floor(window.innerWidth / itemSize);

    let checkSize = num !== 0 && itemsPerPage !== num && num <= pages;

    if (checkSize) {
      resize(num);
    }
  };
}
