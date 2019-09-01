let deferredData = []

function chunk(array, size) {
  let chunked_arr = [];

  if(deferredData.length) { // deferred data can't be longer than 'size' variable
    chunked_arr.push(deferredData)
    deferredData = []
  }

  for (let i = 0; i < array.length; i++) {
    const tail = chunked_arr[chunked_arr.length - 1];

    if (!tail || tail.length === size) {
      chunked_arr.push([array[i]]);
    } else {
      tail.push(array[i]);
    }
  }

  const findChunk = () => {
    let page = false
    let last = size
    chunked_arr.forEach((item, index) => {
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
    deferredData = chunked_arr.pop()
  }

  return chunked_arr;
}


testChunk()
function testChunk() {
  function logTests() {
    console.log()
    console.log('tests')

    ;[].forEach.call(arguments, (data) => {
      console.log()
      console.log(data)
      // if(data.length) {
      //   // console.log(JSON.stringify({data}).split(':')[1])
      //   console.log(data[0], data[1])
      // } else {
      //   console.log(data)
      // }
    })
  }

  function compare(arr1, arr2) {
    return JSON.stringify({data: arr1}) ===
      JSON.stringify({data: arr2})
  }

  function compareDeferred(arr) {
    return compare(deferredData, arr) ? true : [arr, deferredData, false]
  }

  function test(data, size, mustBe) {
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

  // singleNestedArrayTests()
  function singleNestedArrayTests() {
    let test1 = test([1, 2, 3], 3, [[1, 2, 3]])
    let test2 = test([1, 2, 3, 4], 3, [[1, 2 ,3]])
    let test2_1 = compare(deferredData, [4])

    function log1() {
      logTests(
        test1,
        test2,
        ['deferredMustBe', test2_1, deferredData]
      )
    }
    // console.log(deferredData)
    // console.log(test2)
    deferredData = [4]
    let test3 = test([1, 2], 3, [[4, 1, 2]])
    // console.log(test3)

    deferredData = []
    let test4 = test([1, 2, 3, 4, 5], 3, [[1, 2 ,3]])
    let test4_1 = compareDeferred([4, 5])
    console.log(test4, test4_1, deferredData)
  }

  multiNestedArrayTests() // fail: deferredData contains only 1 element
  function multiNestedArrayTests() {
    function test1 () {
      let test1 = test([1, 2, 3, 4, 5, 6, 7, 8], 3, [[1, 2, 3], [4, 5, 6]])
      let test1_1 = compare(deferredData, [7, 8])
      // console.log(test1, test1_1, deferredData)
    }

    function test2() {
      deferredData = [7, 8]
      let deferredDataDump = [...deferredData]
      let test3 = test(
        [1, 2, 3, 4, 5, 6, 7, 8],
        3,
        [[7, 8, 1], [2, 3, 4], [5, 6, 7]]
      )

      console.log(test3)
      console.log('def before', deferredDataDump)
      console.log('def after', deferredData)
    }
  }

  // unemptyDeferredTests()
  function unemptyDeferredTests() {

    function deferredEqualToChunkSize() {
      deferredData = [1, 2, 3]
      let test1 = test([], 3, [[1, 2, 3]])
      let test1_1 = compareDeferred([])
      console.log(test1)
      console.log('deferredEmpty', test1_1)
    }

    // deferredMoreThanChunkSize()
    function deferredMoreThanChunkSize() {
      deferredData = [1, 2, 3, 4]
      let test1 = test([], 3, [[1, 2, 3]])
      let test1_1 = compareDeferred([])
      let test1_2 = compareDeferred([4])
      console.log(test1)
      console.log('deferredEmpty', test1_1)
      console.log('deferredMustBe', test1_2)
    }

    // unemptyDeferredTestsWithData()
    function unemptyDeferredTestsWithData() {
      // moreData()
      function moreData() {
        deferredData = [1, 2, 3, 4]
        let deferredDataDump = [...deferredData]
        let test1 = test(
          [5, 6, 7],
          3,
          [[1, 2, 3], [4, 5, 6]]
        )
        let test1_1 = compareDeferred([])
        let test1_2 = compareDeferred([3])

        logTests(
          ['deferredData', deferredDataDump],
          test1,
          ['deferredEmpty', test1_1],
          ['deferredMustBe', test1_2]
        )
      }

      // oneDeferred()
      function oneDeferred() {
        deferredData = [1]
        let test1 = test([1, 2, 3], 3, [[1, 1, 2]])
        let test1_1 = compareDeferred([])
        let test1_2 = compareDeferred([3])
        console.log(test1)
        console.log('deferredEmpty', test1_1)
        console.log('deferredMustBe', test1_2)
      }

      // twoDeferred()
      function twoDeferred() {
        deferredData = [1, 2]
        let test1 = test([1, 2, 3], 3, [[1, 2, 1]])
        let test1_1 = compareDeferred([])
        let test1_2 = compareDeferred([2, 3])

        logTests(
          ['deferredData', deferredData],
          test1,
          ['deferredEmpty', test1_1],
          ['deferredMustBe', test1_2]
        )
      }
    }
  }
}