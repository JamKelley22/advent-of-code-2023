export const getOverlap = (
  x1: bigint,
  x2: bigint,
  y1: bigint,
  y2: bigint
): { min: bigint; max: bigint } | null => {
  if (x1 <= y2 && y1 <= x2) {
    // There is overlap
    if (x1 <= y1 && x2 <= y2) {
      return { min: y1, max: x2 };
    }
    if (y1 <= x1 && y2 <= x2) {
      return { min: x1, max: y2 };
    }
    if (x1 <= y1 && x2 >= y2) {
      return { min: y1, max: y2 };
    }
    if (y1 <= x1 && y2 >= x2) {
      return { min: x1, max: x2 };
    }
    return { min: BigInt(-1), max: BigInt(-1) };
  }
  return null;
};

export const removeYRangeFromX = (
  x1: bigint,
  x2: bigint,
  y1: bigint,
  y2: bigint
): { min: bigint; max: bigint }[] => {
  if (x1 <= y2 && y1 <= x2) {
    // There is overlap
    if (x1 <= y1 && x2 <= y2) {
      // x1=============x2
      //    y1================y2

      return [{ min: x1, max: y1 }];
    }
    if (y1 <= x1 && y2 <= x2) {
      //       x1=============x2
      // y1================y2
      return [{ min: y2, max: x2 }];
    }
    if (x1 <= y1 && x2 >= y2) {
      // x1======================x2
      //    y1================y2
      return [
        { min: x1, max: y1 },
        { min: y2, max: x2 },
      ];
    }
    if (y1 <= x1 && y2 >= x2) {
      //       x1=============x2
      //    y1====================y2
      return [];
    }
    //???
    return [{ min: BigInt(-1), max: BigInt(-1) }];
  }
  return [{ min: x1, max: x2 }];
};

export const isNumber = (char: string): boolean => {
  if (char.length > 1) throw new Error("isNumber only accepts one character");
  const charCode = char.charCodeAt(0),
    zeroCharCode = "0".charCodeAt(0),
    nineCharCode = "9".charCodeAt(0);
  if (charCode > nineCharCode || charCode < zeroCharCode) return false;
  return true;
};
