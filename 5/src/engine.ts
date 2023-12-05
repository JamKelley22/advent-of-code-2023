import IntervalTree from "@flatten-js/interval-tree";

export const createSeedIntervalTree = (line: string) => {
  if (!line.includes("seeds:")) throw new Error("Invalid Seed Line");
  const seedsNums = line
    .split(":")[1]
    .trim()
    .split(" ")
    .map((seedStr) => parseInt(seedStr));

  if (seedsNums.length % 2 !== 0)
    throw new Error("Invalid number of seeds and ranges");

  let tree = new IntervalTree();

  seedsNums.forEach((seedNum, i, arr) => {
    if (i % 2 === 0) {
      // Grab the range
      const range = arr[i + 1];
      tree.insert([seedNum, seedNum + range], "");
    }
  });

  return tree;
};

export const createMapIntervalTree = (lines: string[]) => {
  let treeSource = new IntervalTree();
  let treeDest = new IntervalTree();
  lines.forEach((line) => {
    const [source, dest, range] = line
      .split(" ")
      .map((strNum) => parseInt(strNum));

    treeSource.insert([source, source + range]);
    treeDest.insert([dest, dest + range]);
  });

  return { treeSource, treeDest };
};
