let deferredData = []

function chunk(array, size) {
  if(deferredData.length + array.length < size) {
    deferredData = [...deferredData, ...array]
    return false
  }
  
  let chunks = [];

  if(deferredData.length > size) {
    let deferredDump = [...deferredData]
    deferredData = []
    chunks = chunk(deferredDump, size)
  }
  
  if(deferredData.length) {
    chunks.push(deferredData)
    deferredData = []
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
    let page = false
    let last = size
    chunks.forEach((item, index) => {
      let len = item.length
      if(item.length !== last) {
        page = index
      }
      last = len
    })

    return page // first page is 0
  }

  let unequalChunk = findChunk()
  if(unequalChunk && unequalChunk > -1) {
    deferredData = chunks.pop()
  }
  
  return chunks;
}


testChunk()
function testChunk() {
  function logTests() {
    console.log()
    console.log('tests')

    ;[].forEach.call(arguments, (data) => {
      console.log()
      console.log(data)
    })
  }

  function compare(arr1, arr2) {
    return JSON.stringify({data: arr1}) === JSON.stringify({data: arr2})
  }

  function compareDeferred(arr) {
    return compare(deferredData, arr) ? true : [arr, deferredData, false]
  }


  function test(obj) {
    let {data, size, mustBe} = obj
    let res = chunk(data, size)

    return {
      res: compare(res, mustBe),
      result: res,
      mustBe,
      _data: {
        arr: data,
        size
      },
    }
  }


  _default()
  function _default() {
    test1()
    function test1 () {
      let test1 = test({
        size: 3,
        data: [1, 2, 3, 4, 5, 6, 7, 8],
        mustBe: [[1, 2, 3], [4, 5, 6]]
      })
      let test1_1 = compare(deferredData, [7, 8])
      
      function log() {
        logTests(test1, [test1_1, deferredData])
      }
      
      if(!test1.res || !test1_1) log()
      deferredData = []
    }

    test2()
    function test2() {
      deferredData = [7, 8]
      let deferredDataDump = [...deferredData]
      let test1 = test({
        data: [1, 2, 3, 4, 5, 6, 7, 8],
        size: 3,
        mustBe: [[7, 8, 1], [2, 3, 4], [5, 6, 7]]
      })

      let test1_1 = compare(deferredData, [8])

      function log() {
        logTests(
          test1,
          ['def before', deferredDataDump,
            'def after', deferredData]
        )
      }

      if(!test1.res || !test1_1) log()
      deferredData = []
    }
  }
  
  dynamic()
  function dynamic() {
    test1()
    function test1 () {
      deferredData = []
      let deferredDataDump = [...deferredData]
      let test1 = test({
        data: [1, 2, 3, 4, 5, 6, 7, 8, 9],
        size: 5,
        mustBe: [[1, 2, 3, 4, 5]]
      })

      let test1_1 = compare(deferredData, [6, 7, 8, 9])

      function log() {
        logTests(
          test1,
          ['def before', deferredDataDump,
            'def after', deferredData]
        )
      }

      if(!test1.res || !test1_1) log()
      deferredData = []
    }

    longerDeferEqualToSize()
    function longerDeferEqualToSize() {
      deferredData = [4, 5, 6, 7, 8, 9]
      let deferredDataDump = [...deferredData]
      let test1 = test({
        data: [1, 2, 3],
        size: 3,
        mustBe: [[4, 5, 6], [7, 8, 9], [1, 2, 3]]
      })

      let test1_1 = compare(deferredData, [])

      function log() {
        logTests(
          test1,
          ['def before', deferredDataDump,
            'def after', deferredData]
        )
      }

      if(!test1.res || !test1_1) log()
      // if(test1.res && test1_1) console.log(true)
      deferredData = []
    }
    
    deferUnequalToSize()
    function deferUnequalToSize() {
      deferredData = [4, 5, 6, 7, 8]
      let deferredDataDump = [...deferredData]
      let test1 = test({
        data: [1, 2, 3],
        size: 3,
        mustBe: [[4, 5, 6], [7, 8, 1]]
      })

      let test1_1 = compare(deferredData, [2, 3])

      function log() {
        logTests(
          test1,
          ['def before', deferredDataDump,
            'def after', deferredData]
        )
      }

      if(!test1.res || !test1_1) log()
      // if(test1.res && test1_1) console.log(true)
      deferredData = []
    }
  }
  
  lessDataThanLength()
  function lessDataThanLength() {
    test1()
    function test1() {
      deferredData = []
      let deferredDataDump = [...deferredData]
      let test1 = test({
        data: [1, 2, 3],
        size: 6,
        mustBe: false
      })

      let test1_1 = compare(deferredData, [1, 2, 3])

      function log() {
        logTests(
          test1,
          ['def before', deferredDataDump,
            'def after', deferredData]
        )
      }

      if(!test1.res || !test1_1) log()
      // if(test1.res && test1_1) console.log(true)
      deferredData = []
    }

    test2()
    function test2() {
      deferredData = [4]
      let deferredDataDump = [...deferredData]
      let test1 = test({
        data: [1, 2, 3],
        size: 6,
        mustBe: false
      })

      let test1_1 = compare(deferredData, [4, 1, 2, 3])

      function log() {
        logTests(
          test1,
          ['def before', deferredDataDump,
            'def after', deferredData]
        )
      }

      if(!test1.res || !test1_1) log()
      // if(test1.res && test1_1) console.log(true)
      deferredData = []
    }

    test3()
    function test3() {
      deferredData = [4, 5, 6]
      let deferredDataDump = [...deferredData]
      let test1 = test({
        data: [1, 2, 3],
        size: 6,
        mustBe: [[4, 5, 6, 1, 2, 3]]
      })

      let test1_1 = compare(deferredData, [])

      function log() {
        logTests(
          test1,
          ['def before', deferredDataDump,
            'def after', deferredData]
        )
      }
      
      if(!test1.res || !test1_1) log()
      // if(test1.res && test1_1) console.log(true)
      deferredData = []
    }
    
  }


  // dumbWithNumChange()
  function dumbWithNumChange() {
    dumb1()
    function dumb1() {
      deferredData = [4, 5, 6, 7, 8]
      let deferredDataDump = [...deferredData]
      let test1 = test({
        data: [1, 2, 3],
        size: 1,
        mustBe: [[4], [5], [6], [7], [8], [1], [2], [3]]
      })

      let test1_1 = compare(deferredData, [])

      function log() {
        logTests(
          test1,
          ['def before', deferredDataDump,
            'def after', deferredData]
        )
      }

      if(!test1.res || !test1_1) log()
      // if(test1.res && test1_1) console.log(true)
      deferredData = []
    }

    dumb2()
    function dumb2() {
      deferredData = [4, 5, 6, 7, 8]
      let deferredDataDump = [...deferredData]
      let test1 = test({
        data: [1, 2, 3],
        size: 2,
        mustBe: [[4, 5], [6, 7], [8, 1], [2, 3]]
      })

      let test1_1 = compare(deferredData, [])

      function log() {
        logTests(
          test1,
          [
            'def before', deferredDataDump,
            'def after',  deferredData
          ]
        )
      }

      if(!test1.res || !test1_1) log()
      // if(test1.res && test1_1) console.log(true)
      deferredData = []
    }

    dumb3()
    function dumb3() {
      deferredData = [4, 5, 6, 7, 8]
      let deferredDataDump = [...deferredData]
      let test1 = test({
        data: [1, 2, 3],
        size: 3,
        mustBe: [[4, 5, 6], [7, 8, 1]]
      })

      let test1_1 = compare(deferredData, [2, 3])

      function log() {
        logTests(
          test1,
          ['def before', deferredDataDump,
            'def after', deferredData]
        )
      }

      if(!test1.res || !test1_1) log()
      // if(test1.res && test1_1) console.log(true)
      deferredData = []
    }

    dumb4()
    function dumb4() {
      deferredData = [4, 5, 6, 7, 8]
      let deferredDataDump = [...deferredData]
      let test1 = test({
        data: [1, 2, 3],
        size: 4,
        mustBe: [[4, 5, 6, 7], [8, 1, 2, 3]]
      })

      let test1_1 = compare(deferredData, [])

      function log() {
        logTests(
          test1,
          ['def before', deferredDataDump,
            'def after', deferredData]
        )
      }

      if(!test1.res || !test1_1) log()
      // if(test1.res && test1_1) console.log(true)
      deferredData = []
    }

    dumb5()
    function dumb5() {
      deferredData = [4, 5, 6, 7, 8]
      let deferredDataDump = [...deferredData]
      let test1 = test({
        data: [1, 2, 3],
        size: 5,
        mustBe: [[4, 5, 6, 7, 8]]
      })

      let test1_1 = compare(deferredData, [1, 2, 3])

      function log() {
        logTests(
          test1,
          ['def before', deferredDataDump,
            'def after', deferredData]
        )
      }

      if(!test1.res || !test1_1) log()
      // if(test1.res && test1_1) console.log(true)
      deferredData = []
    }

    dumb6()
    function dumb6() {
      deferredData = [4, 5, 6, 7, 8]
      let deferredDataDump = [...deferredData]
      let test1 = test({
        data: [1, 2, 3],
        size: 6,
        mustBe: [[4, 5, 6, 7, 8, 1]]
      })

      let test1_1 = compare(deferredData, [2, 3])

      function log() {
        logTests(
          test1,
          ['def before', deferredDataDump,
            'def after', deferredData]
        )
      }

      if(!test1.res || !test1_1) log()
      // if(test1.res && test1_1) console.log(true)
      deferredData = []
    }

    dumb7()
    function dumb7() {
      deferredData = [4, 5, 6, 7, 8]
      let deferredDataDump = [...deferredData]
      let test1 = test({
        data: [1, 2, 3],
        size: 7,
        mustBe: [[4, 5, 6, 7, 8, 1, 2]]
      })

      let test1_1 = compare(deferredData, [3])

      function log() {
        logTests(
          test1,
          ['def before', deferredDataDump,
            'def after', deferredData]
        )
      }

      if(!test1.res || !test1_1) log()
      // if(test1.res && test1_1) console.log(true)
      deferredData = []
    }

    dumb10()
    function dumb10() {
      deferredData = [4, 5, 6, 7, 8]
      let deferredDataDump = [...deferredData]
      let test1 = test({
        data: [1, 2, 3],
        size: 10,
        mustBe: [[4, 5, 6, 7, 8, 1, 2, 3]]
      })

      let test1_1 = compare(deferredData, [])

      function log() {
        logTests(
          test1,
          ['def before', deferredDataDump,
            'def after', deferredData]
        )
      }

      if(!test1.res || !test1_1) log()
      // if(test1.res && test1_1) console.log(true)
      deferredData = []
    }
  }
}