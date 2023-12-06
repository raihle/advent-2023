export function sum(acc, next) {
  return acc + next;
}

export function product(acc, next) {
  return acc * next;
}

export function min(array) {
  let smallest = Number.MAX_SAFE_INTEGER;
  for (const num of array) {
    if (num < smallest) {
      smallest = num;
    }
  }
  return smallest;
}
