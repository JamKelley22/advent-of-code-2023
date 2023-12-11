export type Galaxy = {
  field: Set<string>;
  width: number;
  height: number;
};

export type Point = {
  x: number;
  y: number;
};

export const getEncodedCoordinates = (p: Point): string => `[${p.y},${p.x}]`;
export const getDecodedCoordinates = (encoded: string): Point => {
  const [y, x] = encoded
    .slice(1, encoded.length - 1)
    .split(",")
    .map((numStr) => parseInt(numStr));
  return {
    y,
    x,
  };
};

//The Manhattan Distance between two points (X1, Y1) and (X2, Y2) is given by c.
export const manhattanDistance = (p1: Point, p2: Point) => {
  return Math.abs(p1.x - p2.x) + Math.abs(p1.y - p2.y);
};

export const getEmptyRowColumnIndices = (
  galaxy: Galaxy
): { rows: Set<number>; cols: Set<number> } => {
  const { field, height, width } = galaxy;
  const rows = new Set(Array.from(Array(height).keys())),
    cols = new Set(Array.from(Array(width).keys()));

  field.forEach((coordsStr) => {
    const coords = getDecodedCoordinates(coordsStr);
    rows.delete(coords.y);
    cols.delete(coords.x);
  });
  return { rows, cols };
};

export const expandGalaxy = (
  galaxy: Galaxy,
  expandMultiplier: number = 2
): Galaxy => {
  const { field, height, width } = galaxy;
  const expandedField = new Set(field);

  let newHeight = height,
    newWidth = width;

  const { rows: rowIndicesForExpansion, cols: colIndicesForExpansion } =
    getEmptyRowColumnIndices(galaxy);

  newHeight += rowIndicesForExpansion.size;
  newWidth += colIndicesForExpansion.size;

  let fieldPointToExpandedFieldPoint = new Map<string, Point>();
  field.forEach((coordsStr) => {
    const coordsPoint = getDecodedCoordinates(coordsStr);
    fieldPointToExpandedFieldPoint.set(coordsStr, {
      y: coordsPoint.y,
      x: coordsPoint.x,
    });
  });

  rowIndicesForExpansion.forEach((rowIndex) => {
    field.forEach((coordsStr) => {
      const ogCoords = getDecodedCoordinates(coordsStr);
      const correctedCoords =
        fieldPointToExpandedFieldPoint.get(coordsStr) ??
        getDecodedCoordinates(coordsStr);

      if (ogCoords.y > rowIndex) {
        expandedField.delete(getEncodedCoordinates(correctedCoords));
        expandedField.add(
          getEncodedCoordinates({
            x: correctedCoords.x,
            y: correctedCoords.y + expandMultiplier - 1,
          })
        );
        fieldPointToExpandedFieldPoint.set(coordsStr, {
          y: correctedCoords.y + expandMultiplier - 1,
          x: correctedCoords.x,
        });
      }
    });
  });

  colIndicesForExpansion.forEach((colIndex) => {
    field.forEach((coordsStr) => {
      const ogCoords = getDecodedCoordinates(coordsStr);
      const correctedCoords =
        fieldPointToExpandedFieldPoint.get(coordsStr) ??
        getDecodedCoordinates(coordsStr);

      if (ogCoords.x > colIndex) {
        expandedField.delete(getEncodedCoordinates(correctedCoords));
        expandedField.add(
          getEncodedCoordinates({
            x: correctedCoords.x + expandMultiplier - 1,
            y: correctedCoords.y,
          })
        );
        fieldPointToExpandedFieldPoint.set(coordsStr, {
          x: correctedCoords.x + expandMultiplier - 1,
          y: correctedCoords.y,
        });
      }
    });
  });

  return { field: expandedField, height: newHeight, width: newWidth };
};
