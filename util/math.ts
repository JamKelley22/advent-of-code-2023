export function gcd(a: number, b: number) {
  for (let temp = b; b !== 0; ) {
    b = a % b;
    a = temp;
    temp = b;
  }
  return a;
}

export function lcm(a: number, b: number) {
  const gcdValue = gcd(a, b);
  return (a * b) / gcdValue;
}
