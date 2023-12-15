export const transpose = <T>(array: T[][]): T[][] =>
  array[0].map((_, colIndex) => array.map((row) => row[colIndex]));

export const Surface = ["#", "."] as const;
export type SurfaceType = (typeof Surface)[number];

export function isOfTypeSurface(keyInput: string): keyInput is SurfaceType {
  return Surface.includes(keyInput as SurfaceType);
}

export const calculateMaxReflectionFromMaxReflectionDistancesAtSplitIndices = (
  maxReflectionDistancesAtSplitIndices: {
    [splitIndex: number]: number;
  }[],
  log: boolean = false
): { splitIndex: number; maxReflectionDistance: number } => {
  if (log)
    console.log(
      { maxReflectionDistancesAtSplitIndices },
      Object.keys(maxReflectionDistancesAtSplitIndices[0]).length
    );

  const minReflectionDistancesAtSplitIndex: { [splitIndex: number]: number } =
    {};
  for (
    let splitIndex = 0;
    splitIndex < Object.keys(maxReflectionDistancesAtSplitIndices[0]).length;
    splitIndex++
  ) {
    maxReflectionDistancesAtSplitIndices.forEach((lineReflectionIndex) => {
      if (
        lineReflectionIndex[splitIndex] <
        (minReflectionDistancesAtSplitIndex[splitIndex] ??
          Number.MAX_SAFE_INTEGER)
      ) {
        minReflectionDistancesAtSplitIndex[splitIndex] =
          lineReflectionIndex[splitIndex];
      }
    });
  }
  if (log) console.log({ minReflectionDistancesAtSplitIndex });

  const maxReflection = Object.entries(
    minReflectionDistancesAtSplitIndex
  ).reduce(
    (acc, [key, value]) => {
      const numericKey = parseInt(key);
      if (!isNaN(numericKey) && value > acc.maxReflectionDistance) {
        return {
          splitIndex: numericKey,
          maxReflectionDistance: value,
        };
      }
      return acc;
    },
    { splitIndex: -1, maxReflectionDistance: Number.MIN_SAFE_INTEGER }
  );

  return maxReflection;
};

export const findLineReflectionIndex = (
  line: SurfaceType[]
): { [splitIndex: number]: number } => {
  const maxReflectionDistancesAtSplitIndex: { [splitIndex: number]: number } =
    {};
  for (let splitIndex = 0; splitIndex < line.length; splitIndex++) {
    const [left, right] = [
      line.slice(0, splitIndex),
      line.slice(splitIndex, line.length),
    ];
    const reversedLeft = left.reverse();

    let lineMaxStepsFromCenter = 0;
    for (
      let stepsFromCenter = 0;
      stepsFromCenter < Math.min(left.length, right.length);
      stepsFromCenter++
    ) {
      if (reversedLeft[stepsFromCenter] !== right[stepsFromCenter]) {
        break;
      }
      lineMaxStepsFromCenter = stepsFromCenter + 1;
    }
    maxReflectionDistancesAtSplitIndex[splitIndex] = lineMaxStepsFromCenter;
  }

  return maxReflectionDistancesAtSplitIndex;
};
