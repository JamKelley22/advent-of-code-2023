import {
  Beam,
  Simulation,
  SimulationStep,
  TileType,
  VelocityDirection,
  decodeVelocity,
  directionChangeMap,
  encodeLocation,
  encodeVelocity,
  isOfTypeTile,
  sleep,
} from "./engine";

var fs = require("fs");
const util = require("util");
const readline = require("readline");

export const parseSimulation = (input: string): Simulation => {
  const tileMap = new Map<string, TileType>();
  const steps = [] as SimulationStep[];

  steps.push({
    energizedTiles: new Set<string>(),
    beams: [],
  });

  const lines = input.split("\n");

  lines.forEach((line, i) =>
    line.split("").forEach((char, j) => {
      if (!isOfTypeTile(char)) {
        throw new Error(`Invalid Tile Type: ${char}`);
      }
      tileMap.set(encodeLocation({ i, j }), char);
    })
  );
  const width = lines[0].length,
    height = lines.length;

  return {
    steps,
    tileMap,
    width,
    height,
  };
};

export const simulationStepToString = (
  simulation: Simulation,
  stepIndex: number
): string => {
  let ret = "";
  const simulationStep = simulation.steps[stepIndex];
  const beamLocationSet = new Set<string>();
  simulationStep.beams.forEach((beam) =>
    beamLocationSet.add(encodeLocation(beam.location))
  );
  for (let i = 0; i < simulation.width; i++) {
    for (let j = 0; j < simulation.height; j++) {
      const tile = simulation.tileMap.get(encodeLocation({ i, j }));
      const isBeamLocation = beamLocationSet.has(encodeLocation({ i, j }));
      ret += isBeamLocation ? "* " : `${tile} `;
    }
    ret += "|| ";
    for (let j = 0; j < simulation.height; j++) {
      const tileIsEnergized = simulation.steps[stepIndex].energizedTiles.has(
        encodeLocation({ i, j })
      );
      ret += tileIsEnergized ? "# " : ". ";
    }
    ret += "\n";
  }
  ret += "\n";
  ret += `Tiles Energized: ${simulation.steps[stepIndex].energizedTiles.size}\n`;
  //   ret += JSON.stringify([...simulation.steps[stepIndex].energizedTiles]);
  //   ret += "\n";
  return ret;
};

// Create a readline interface to read input from the user
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false, // Set this to false to disable echoing the input
});

const waitForEnter = async () => {
  return new Promise<void>((resolve) => {
    rl.question("Press Enter to continue...\n", () => {
      resolve();
    });
  });
};

export const encodeVisitedFromDirection = (beam: Beam) =>
  `${encodeLocation(beam.location)}-[${beam.velocity.i},${beam.velocity.j}]`;

export const runSimulation = async (
  simulation: Simulation,
  log: boolean = true,
  onDone: (num: number) => void,
  stepDelayMS: number = 1000
): Promise<void> => {
  let logs: { msg: any; i?: number }[] = [];

  const tileVisitedFromDirectionSet = new Set<string>();

  //   const maxSimSteps = 10;
  if (log) {
    console.clear();
    console.log(simulationStepToString(simulation, 0));
  }

  for (let stepIndex = 0; stepIndex < simulation.steps.length; stepIndex++) {
    // await waitForEnter();
    const currentStep = simulation.steps[stepIndex];

    if (stepIndex > 0)
      simulation.steps[stepIndex - 1].beams.forEach((beam) => {
        tileVisitedFromDirectionSet.add(encodeVisitedFromDirection(beam));
      });
    const updatedBeams = currentStep.beams.reduce((acc, beam) => {
      if (
        beam.location.i > simulation.height - 1 ||
        beam.location.i < 0 ||
        beam.location.j > simulation.width - 1 ||
        beam.location.j < 0
      ) {
        return acc;
      }
      const currentTile = simulation.tileMap.get(encodeLocation(beam.location));

      simulation.steps[stepIndex].energizedTiles.add(
        encodeLocation(beam.location)
      );
      //   logs.push({
      //     msg: [...simulation.steps[stepIndex].energizedTiles].slice(-5),
      //   });

      //   let newVelocities = [beam.velocity];
      //   logs.push({ msg: currentTile, i: stepIndex });
      //   logs.push({ msg: tileVisitedFromDirectionSet });
      if (currentTile && currentTile !== ".") {
        const directionChanges = directionChangeMap.get(currentTile);
        const newVelocities = directionChanges
          ?.get(encodeVelocity(beam.velocity))
          ?.map((encodedVelocity) => decodeVelocity(encodedVelocity));
        // logs.push({
        //   msg: [encodeVelocity(beam.velocity), VelocityDirection.East],
        // });

        const newBeams =
          newVelocities?.map((newVelocity) => {
            return {
              location: beam.location,
              velocity: newVelocity,
            };
          }) ?? [];

        const newBeamsWithoutCyclicalBeams = newBeams.reduce(
          (accI, newBeam) => {
            const visitedFromDirection = tileVisitedFromDirectionSet.has(
              encodeVisitedFromDirection(beam)
            );
            if (visitedFromDirection) return accI;
            else return [...accI, newBeam];
          },
          [] as Beam[]
        );

        // logs.push({
        //   msg: newBeams.map((beam) => beam.velocity),
        // });

        return [
          ...acc,
          ...newBeamsWithoutCyclicalBeams.map((beam) => ({
            location: {
              i: beam.location.i + beam.velocity.i,
              j: beam.location.j + beam.velocity.j,
            },
            velocity: beam.velocity,
          })),
        ];
        // logs.push({
        //   msg: additionalBeams,
        // });
        // if (!simulation.steps[stepIndex + 1]) {
        //   simulation.steps[stepIndex + 1] = {
        //     energizedTiles: new Set(),
        //     beams: [],
        //   };
        //   simulation.steps[stepIndex + 1].beams.push(...additionalBeams);
        // }
      }

      return [
        ...acc,
        {
          location: {
            i: beam.location.i + beam.velocity.i,
            j: beam.location.j + beam.velocity.j,
          },
          velocity: beam.velocity,
        },
      ];
    }, [] as Beam[]);

    if (updatedBeams.length) {
      simulation.steps.push({
        energizedTiles: currentStep.energizedTiles,
        beams: updatedBeams,
      });
    }

    if (log) {
      console.clear();
      console.log(simulationStepToString(simulation, stepIndex));
      if (logs.length > 0) {
        logs.forEach((singleLog) => {
          if (singleLog.i) console.log(singleLog.i, singleLog.msg);
          else console.log(singleLog.msg);
        });
        // if (logs.length > 10) logs.shift();
        logs = [];
      }

      //   await sleep(stepDelayMS);
    }
  }

  onDone(simulation.steps[simulation.steps.length - 1].energizedTiles.size);
};

try {
  const useExample = false;
  const filePath = useExample ? "input-example1.txt" : "input.txt";
  const input: string = fs.readFileSync(filePath, "utf8");
  const simulation = parseSimulation(input);
  for (let i = 0; i < simulation.width; i++) {
    const startingBeam: Beam = {
      location: { i: 0, j: 0 },
      velocity: { i: 0, j: 1 },
    };
    simulation.steps[0].beams.push(startingBeam);
    runSimulation(
      simulation,
      false,
      (num) => {
        // console.log("Done");
        console.log(startingBeam);

        console.log(num);
      },
      2000
    );
  }

  //   console.log(simulationStepToString(simulation, 0));
} catch (e: any) {
  console.log("Error:", e.stack);
}
