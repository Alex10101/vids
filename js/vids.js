function vidsConstructor(arr) {
  let vids = document.getElementById('vids')
  let sliderSub = subscribeColorConstructor()
  let inc = 0
  let slidersArr = []

  function joinChunkFromEnd (arr, len) {
    let chunks = []

    while (arr.length !== 0) {
      chunks.push(arr.splice(-len).join(''));
    }

    return chunks.reverse();
  }

  function fillDots(num) {
    return joinChunkFromEnd(num.split(''), 3).join('.')
  }

  function appendElement(parent, index, data) {
    data = data[index]
    index === 0 && slidersArr.push(parent)
    
    
    let container      = createElement('div', 'vids-container')
    let linkContainer  = createElement('div', 'vids-link')
    let briefContainer = createElement('div', 'brief-container')

    let img  = createElement('img', 'vids-img', { src: data.image })
    let link = createElement(
      'a', false, {
        href: `https://www.youtube.com/watch?v=${data.videoId}`,
        textContent: data.title
      }
    );

    parent.appendChild        (container)
    container.appendChild     (img)
    container.appendChild     (linkContainer)
    linkContainer.appendChild (link)
    container.appendChild     (briefContainer)
    // briefContainer.appendChild(createElement('div', 'brief-title befored', {textContent: data.channelTitle}))
    briefContainer.appendChild(createElement('div', 'brief-title befored', {textContent: inc++}))
    briefContainer.appendChild(createElement('div', 'brief-date befored', {textContent: data.date}))
    briefContainer.appendChild(createElement('div', 'brief-views befored', {textContent: fillDots(data.view_count)}))
    container.appendChild     (createElement('div', 'vids-description', {textContent: data.description}))
  }

  appendSlider(vids, appendElement, arr, sliderSub)

  return {
    next() {
      sliderSub.subs.next()
    },
    prev() {
      sliderSub.subs.prev()
    },
    sub(page) {
      sliderSub.sub(slidersArr[page - 1], 'active')
    },
    repaint(data) {
      appendSlider(vids, appendElement, data)
    },
    resize(data) {
      appendSlider(vids, appendElement, data, sliderSub)
    }
  }
}