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

  let nextHistorySum = 0;

  for (
    let solvedHistoryIndex = 0;
    solvedHistoryIndex < solvedHistories.length;
    solvedHistoryIndex++
  ) {
    const currSolvedHistory = solvedHistories[solvedHistoryIndex];

    currSolvedHistory.orders[currSolvedHistory.orders.length - 1].unshift(0);

    for (
      let currentOrderIndex = currSolvedHistory.orders.length - 1;
      currentOrderIndex > 0;
      currentOrderIndex--
    ) {
      const nextLowerOrder = currSolvedHistory.orders[currentOrderIndex - 1];
      const currentOrder = currSolvedHistory.orders[currentOrderIndex];
      //   const lastNumberInCurrentOrder = currentOrder[currentOrder.length - 1];
      const firstNumberInCurrentOrder = currentOrder[0];
      const delta = firstNumberInCurrentOrder;
      //   const lastNumberInLowerOrder = nextLowerOrder[currentOrder.length - 1];
      const firstNumberInLowerOrder = nextLowerOrder[0];

      // console.log({
      //   currentOrderIndex,
      //   delta,
      //   lastNumberInCurrentOrder,
      //   lastNumberInLowerOrder,
      // });

      currSolvedHistory.orders[currentOrderIndex - 1].unshift(
        firstNumberInLowerOrder - delta
      );
    }

    nextHistorySum += currSolvedHistory.orders[0][0];
  }

  console.log(util.inspect(solvedHistories, false, null, true));
  console.log(nextHistorySum);
} catch (e: any) {
  console.log("Error:", e.stack);
}
