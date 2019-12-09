import { appendSlider, createElement, subscribeColorConstructor } from 'utils';

export default function vidsConstructor(arr) {
  const vids = document.getElementById('content');
  const sliderSub = subscribeColorConstructor();
  const slidersArr = [];
  let inc = 0;

  function joinChunkFromEnd(JCarr, len) {
    const chunks = [];

    while (JCarr.length !== 0) {
      chunks.push(JCarr.splice(-len).join(''));
    }

    return chunks.reverse();
  }

  function fillDots(num) {
    return joinChunkFromEnd(num.split(''), 3).join('.');
  }

  function appendElement(parent, index, dataArg) {
    let data = dataArg;
    data = data[index];
    if (index === 0) slidersArr.push(parent);

    const container = createElement('div', 'vids-container');
    const linkContainer = createElement('div', 'vids-link');
    const briefContainer = createElement('div', 'brief-container');

    const img = createElement('img', 'vids-img', { src: data.image });
    const link = createElement('a', false, {
      href: `https://www.youtube.com/watch?v=${data.videoId}`,
      textContent: data.title
    });

    parent.appendChild(container);
    container.appendChild(img);
    container.appendChild(linkContainer);
    linkContainer.appendChild(link);
    container.appendChild(briefContainer);
    // briefContainer.appendChild(createElement('div', 'brief-title befored', {textContent: data.channelTitle}))
    briefContainer.appendChild(createElement('div', 'brief-title befored', { textContent: inc++ }));
    briefContainer.appendChild(
      createElement('div', 'brief-date befored', { textContent: data.date })
    );
    briefContainer.appendChild(
      createElement('div', 'brief-views befored', { textContent: fillDots(data.view_count) })
    );
    container.appendChild(
      createElement('div', 'vids-description', { textContent: data.description })
    );
  }

  appendSlider(vids, appendElement, arr, sliderSub);

  return {
    next() {
      sliderSub.subs.next();
    },
    prev() {
      sliderSub.subs.prev();
    },
    sub(page) {
      sliderSub.sub(slidersArr[page - 1], 'active');
    },
    repaint(data) {
      appendSlider(vids, appendElement, data);
    },
    resize(data) {
      appendSlider(vids, appendElement, data, sliderSub);
    }
  };
}
