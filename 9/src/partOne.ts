var fs = require("fs");
const util = require("util");

type History = {
  orders: number[][];
};

export const parseHistory = (line: string): History => ({
  orders: [line.split(" ").map((numStr) => parseInt(numStr))],
});

export const parseHistories = (lines: string[]): History[] =>
  lines.map((line) => parseHistory(line));

export const computeNextOrder = (order: number[]) => {
  return order.reduce((acc, num, i, arr) => {
    if (i === arr.length - 1) return acc;
    const nextNum = arr[i + 1];
    return [...acc, nextNum - num];
  }, [] as number[]);
};

try {
  const useExample = true;
  const filePath = useExample ? "input-example1.txt" : "input.txt";
  const input = fs.readFileSync(filePath, "utf8");

  const lines: string[] = input.split("\n");

  const histories = parseHistories(lines);

  const solvedHistories = histories.map((history) => {
    const orders = [history.orders[0]];

    for (let orderIndex = 0; ; orderIndex++) {
      const nextOrder = computeNextOrder(orders[orderIndex]);
      orders.push(nextOrder);
      if (nextOrder.every((num) => num === 0)) break;
    }

    return {
      orders: [...orders],
    };
  });

  const equations = solvedHistories.map((solvedHistory) => {
    switch (solvedHistory.orders.length) {
      case 0:
        throw new Error("How did we have nothing?");
      case 1:
        return (x: number) => 0; //The line was all 0's, next term will def be 0
      case 2:
        return (x: number) => x; //The line was all the same number, y=x
      case 3:
        return (x: number) => {
          const b = solvedHistory.orders[0][0];
          const m = solvedHistory.orders[0][1];
          return m * x + b;
        }; //
      case 4:
        return (x: number) => {
          const C = solvedHistory.orders[0][0];
          const xs = [0, 1, 2];
          const ys = solvedHistory.orders[0].slice(0, 3);
          const A =
            (ys[1] - ys[0]) / (xs[1] - xs[0]) -
            (ys[2] - ys[1]) / (xs[2] - xs[1]);
          const B = (ys[1] - ys[0]) / (xs[1] - xs[0]) - A * (xs[0] + xs[1]);

          return A * Math.pow(x, 2) + B * x + C;
        };
      case 5:
        return (x: number) => null;
    }
  });

  //   console.log(util.inspect(solvedHistories, false, null, true));

  console.log(equations[1]?.(4));
} catch (e: any) {
  console.log("Error:", e.stack);
}
