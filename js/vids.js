function vidsConstructor(arr) {
  let vids = document.getElementById('vids')
  let sliderSub = subscribeColorConstructor()
  let inc = 1
  let page = 0
  let slidersArr = [
    {
      parent: null,
      childs: []
    }, 
    {
      parent: null,
      childs: []
    }
  ]
  
  let sliders = {
    prevSlider: 0,
    activeSlider: 1,
    
    hiddenSliderClassName: 'slider',
    activeSliderClassName: 'slider active',

    setActivePage: function() {
      slidersArr[this.prevSlider].parent.className = this.hiddenSliderClassName 
      slidersArr[this.activeSlider].parent.className = this.activeSliderClassName
      this.prevSlider = this.activeSlider
    },

    fillData: function(data) {
      let arr = slidersArr[this.activeSlider].childs
      data.forEach((data, index) => {
        arr[index].link.href = `https://www.youtube.com/watch?v=${data.videoId}`
        arr[index].link.textContent = data.title
        arr[index].img.src = data.image
        // arr[index].title.textContent: data.channelTitle
        arr[index].title.textContent = `i ${inc++} page ${page}`
        arr[index].date.textContent = data.date
        arr[index].views.textContent = fillDots(data.view_count)
        arr[index].description.textContent = data.description
      })
      // console.log(23, arr.length, data.length)
      if(arr.length < data.length) {
        // console.log(arr.length, data.length, arr.splice(0, data.length))
      }
    },
    
    set: function(data, newPage) {
      let even_odd = newPage % 2 > 0 ? 1 : 0
      this.activeSlider = even_odd
      // console.log(even_odd, newPage)
      this.fillData(data)
      this.setActivePage()
    }
  }
  
  // console.log(arr)
  
  function appendElement(parent, index, data) {
    data = data[index]
    
    let container      = createElement('div', 'vids-container')
    let linkContainer  = createElement('div', 'vids-link')
    let briefContainer = createElement('div', 'brief-container')
    
    if(index === 0) {
      page++
      slidersArr[page - 1].parent = parent
    }
    
    let link = createElement(
      'a', false, {
        href: `https://www.youtube.com/watch?v=${data.videoId}`,
        textContent: data.title
      }
    );
    
    let DOMlinks = {
      link,
      img: createElement('img', 'vids-img', { src: data.image }),
      // title: createElement('div', 'brief-title befored', {textContent: data.channelTitle}),
      title: createElement('div', 'brief-title befored', {textContent: `i ${inc++} page ${page}`}),
      date: createElement('div', 'brief-date befored', {textContent: data.date}),
      views: createElement('div', 'brief-views befored', {textContent: fillDots(data.view_count)}),
      description: createElement('div', 'vids-description', {textContent: data.description})
    }
    
    slidersArr[page - 1].childs.push(DOMlinks)
      
    parent.appendChild        (container)
    container.appendChild     (DOMlinks.img)
    container.appendChild     (linkContainer)
    linkContainer.appendChild (link)
    container.appendChild     (briefContainer)
    briefContainer.appendChild(DOMlinks.title)
    briefContainer.appendChild(DOMlinks.date)
    briefContainer.appendChild(DOMlinks.views)
    container.appendChild     (DOMlinks.description)
  }

  appendSlider(vids, appendElement, arr.slice(0,2), sliderSub)
  // console.log(slidersArr)
  
  return {
    sub(newPage) {
      // sliderSub.sub(slidersArr[page - 1].parent, 'active')
      sliders.set(data[newPage - 1])
    },
    set(data, newPage) {
      page = newPage
      sliders.set(data, newPage)
    },
    resize(data) {
      appendSlider(vids, appendElement, data, sliderSub)
    }
  }
}