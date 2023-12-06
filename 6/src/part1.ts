var fs = require("fs");

type Race = {
  recordDistanceMM: number;
  raceTimeMS: number;
};

export const parseRaces = (input: string): Race[] => {
  const lines: string[] = input.split("\n");
  const times = lines[0]
    .split(":")[1]
    .split(" ")
    .reduce((acc, timeStr) => {
      if (timeStr) return [...acc, parseInt(timeStr.trim())];
      return acc;
    }, [] as number[]);

  const distances = lines[1]
    .split(":")[1]
    .split(" ")
    .reduce((acc, distStr) => {
      if (distStr) return [...acc, parseInt(distStr.trim())];
      return acc;
    }, [] as number[]);

  return times.map((time, i) => ({
    recordDistanceMM: distances[i],
    raceTimeMS: time,
  }));
};

export const calculateRaceWinningHoldTimes = (
  race: Race,
  boatStartSpeedMS: number,
  buttonAccelerationMMMS: number
): number[] => {
  let winningDistance = race.recordDistanceMM,
    holdTimesForWinningDistance = [];
  for (let buttonHoldMS = 0; buttonHoldMS <= race.raceTimeMS; buttonHoldMS++) {
    const boatSpeed = buttonHoldMS;
    const remainingRaceTime = race.raceTimeMS - buttonHoldMS;
    const distance = remainingRaceTime * boatSpeed;
    // console.log(
    //   `HoldMS: ${buttonHoldMS}\tRemainingRaceTime: ${remainingRaceTime}\tDistanceTraveled: ${distance}`
    // );

    if (distance > winningDistance) {
      holdTimesForWinningDistance.push(buttonHoldMS);
    }
  }
  return holdTimesForWinningDistance;
};

try {
  const useExample = false;
  const filePath = useExample ? "input-example1.txt" : "input.txt";
  const input = fs.readFileSync(filePath, "utf8");
  const races = parseRaces(input);
  const BOAT_START_SPEED_MS = 0;
  const BUTTON_ACCELERATION_MM_MS = 1;
  const res = races.reduce((acc, race) => {
    const winningHoldTimes = calculateRaceWinningHoldTimes(
      race,
      BOAT_START_SPEED_MS,
      BUTTON_ACCELERATION_MM_MS
    );
    return acc * winningHoldTimes.length;
  }, 1);
  console.log(res);
} catch (e: any) {
  console.log("Error:", e.stack);
}
