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
  const useExample = false;
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

  // This would be a cool way to solve it if the actual input didn't have solved histories that went 20 deep (that's an order 20 polynomial)
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
          // https://www.youtube.com/watch?v=vMUpBT7_9Xw
          // Something like that youtube video will allow me to calculate A,B,and C of the general quadratic
          return null;
        };
      case 5:
        // Ax^3 + Bx^2 + Cx + D = 0
        return (x: number) => null;

      case 6:
        // Ax^4 + Bx^3 + Cx^2 + Dx + E = 0.
        return (x: number) => null;
    }
  });

  //   console.log(util.inspect(solvedHistories, false, null, true));

  console.log(
    solvedHistories.reduce((acc, solvedHistory) => {
      if (solvedHistory.orders.length > acc) return solvedHistory.orders.length;
      return acc;
    }, Number.MIN_SAFE_INTEGER)
  );
} catch (e: any) {
  console.log("Error:", e.stack);
}
