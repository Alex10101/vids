let width = 1500;
let prevSize = width;
let itemsPerPage = 3;

const onresize = (width) => {
  let itemSize = 500;
  let num = Math.floor(width / itemSize);

  itemsPerPage !== num && (itemsPerPage = num);

  console.log();
  return;

  let w = width;
  let result = 0;

  let config = {
    '<': {
      1500: 2,
      800: 1
    },
    '>': {
      1500: 3,
      800: 2
    }
  };
  let moreOrLess = w > prevSize ? '>' : '<';
  let obj = config[moreOrLess];

  Object.keys(obj).forEach((item) => {
    if (!obj[result]) result = item;
    let count = item - w;
    count > 0 && item < result && (result = item);
  });

  if (prevSize !== result) {
    itemsPerPage = obj[result];
    console.log(moreOrLess, itemsPerPage + ' res ' + result + 'px; data', w + 'px');
  }

  prevSize = result;
};

// < 800
// < 1500
// > 800
// > 1500

function test(px, itemsCount) {
  onresize(px);
  // !(itemsCount === itemsPerPage) &&
  let count = itemsPerPage;
  defer((o) => console.log(`${count} | ${itemsCount}; ${px}px`));
}

// defer(o=> console.log())

// <
// test(1400, 2)
// test(799, 1)

// >
// test(1400, 2)
// test(1500, 3)

function defer(cb) {
  setImmediate(cb);
}

let arr = '1234567890'.split('');

function joinChunkFromEnd(arr, len) {
  let chunks = [];

  while (arr.length !== 0) {
    chunks.push(arr.splice(-len).join(''));
  }

  return chunks.reverse();
}

let d = joinChunkFromEnd(arr, 3).join('.');
console.log(d);
