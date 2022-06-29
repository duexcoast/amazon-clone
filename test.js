const item = {
  countInStock: 44,
};

const arr = Array(item.countInStock);
// const arrSpread = [...arr];
const keys = [...arr.keys()];

console.log("item.countInStock: ", item.countInStock);
console.log("arr: ", arr);
console.log(arr.length);
// console.log("arrSpread: ", arrSpread);
console.log("keys: ", keys);
