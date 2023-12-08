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

export function lcm(a, b) {
  return Math.abs(a * (b / gcd(a, b)));
}

export function gcd(a, b) {
  if (Number.isNaN(a) || Number.isNaN(b)) {
    throw new Error(`NaN ${a}, ${b}`);
  }
  if (a == b) return a;
  if (a == 0) return b;
  if (b == 0) return a;
  if (a > b) {
    return gcd(b, a % b);
  }
  return gcd(a, b % a);
}
