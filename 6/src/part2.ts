var fs = require("fs");

type Race = {
  recordDistanceMM: number;
  raceTimeMS: number;
};

export const parseRace = (input: string): Race => {
  const lines: string[] = input.split("\n");
  const time = parseInt(lines[0].split(":")[1].replace(/ /g, ""));

  const distance = parseInt(lines[1].split(":")[1].replace(/ /g, ""));

  return {
    recordDistanceMM: distance,
    raceTimeMS: time,
  };
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
  const race = parseRace(input);
  const BOAT_START_SPEED_MS = 0;
  const BUTTON_ACCELERATION_MM_MS = 1;
  const winningHoldTimes = calculateRaceWinningHoldTimes(
    race,
    BOAT_START_SPEED_MS,
    BUTTON_ACCELERATION_MM_MS
  );
  const res = winningHoldTimes.length;
  console.log(res);

  //   const res = races.reduce((acc, race) => {
  //     const winningHoldTimes = calculateRaceWinningHoldTimes(
  //       race,
  //       BOAT_START_SPEED_MS,
  //       BUTTON_ACCELERATION_MM_MS
  //     );
  //     return acc * winningHoldTimes.length;
  //   }, 1);
  //   console.log(res);
} catch (e: any) {
  console.log("Error:", e.stack);
}
