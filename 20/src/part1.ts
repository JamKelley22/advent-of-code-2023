import {
  BroadcastModule,
  ButtonModule,
  ConjunctionModule,
  FlipFlopModule,
  Module,
  OutputModule,
  Pulse,
} from "./engine";

var fs = require("fs");
const util = require("util");
const readline = require("readline");

export const parseModuleConfiguration = (
  input: string
): Map<string, Module> => {
  const lines = input.split("\n");
  const moduleMap = new Map<string, Module>();
  const tempModuleMap = new Map<string, string[]>();
  lines.forEach((line) => {
    const [moduleStr, destinationModuleStrs] = line.split(" -> ");
    const moduleType = moduleStr.slice(0, 1);
    let moduleName = moduleStr.slice(1);
    let module: Module;
    switch (moduleType) {
      case "%":
        // Flip-Flop
        module = new FlipFlopModule(moduleName);
        break;
      case "&":
        // Conjunction
        module = new ConjunctionModule(moduleName);
        break;
      case "b":
        // (b)roadcast
        moduleName = "broadcaster";
        module = new BroadcastModule(moduleName);
        break;
      default:
        throw new Error(`Unknown type of module: ${moduleStr}`);
    }
    const destinationModuleNames = destinationModuleStrs.split(", ");
    console.log(destinationModuleNames);

    tempModuleMap.set(moduleName, destinationModuleNames);
    // console.log(tempModuleMap);

    moduleMap.set(moduleName, module);
  });

  // moduleMap.set("output", new OutputModule("output"));

  tempModuleMap.forEach((destinationModuleNames, moduleName) => {
    const destinationModules = destinationModuleNames.reduce(
      (acc, destinationModuleName) => {
        const destinationModule = moduleMap.get(destinationModuleName);
        if (destinationModule) return [...acc, destinationModule];
        else {
          moduleMap.set(
            destinationModuleName,
            new OutputModule(destinationModuleName)
          );
          return [...acc, new OutputModule(destinationModuleName)];
        }
        // return acc;
      },
      [] as Module[]
    );
    const module = moduleMap.get(moduleName);
    if (module) module.destinationModules = destinationModules;
    module?.destinationModules.forEach((destMod) => {
      destMod.inputModules.push(module);
    });
  });

  return moduleMap;
};

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false, // Set this to false to disable echoing the input
});

const waitForEnter = async () => {
  return new Promise<void>((resolve) => {
    rl.question("", () => {
      resolve();
    });
  });
};

const pushTheButton = async (buttonModule: Module) => {
  let lowPulses = 0,
    highPulses = 0;
  const ret = buttonModule.receivePulse(false, buttonModule);
  // lowPulses++;

  const modulesToProcess: { module: Module; pulse: Pulse; from?: Module }[] = [
    ...ret.destinationModules.map((module) => ({
      module: module,
      pulse: ret.pulseToSend ?? false,
      from: ret.from,
    })),
  ];

  while (modulesToProcess.length > 0) {
    // await waitForEnter();
    const currentModule = modulesToProcess.shift();
    if (!currentModule) {
      throw new Error("Invalid current module");
    }
    const pulseSend = currentModule.module.receivePulse(
      currentModule.pulse,
      currentModule.from
    );
    if (currentModule.pulse) {
      highPulses++;
    } else {
      lowPulses++;
    }

    modulesToProcess.push(
      ...(pulseSend.destinationModules.map((module) => ({
        module: module,
        pulse: pulseSend.pulseToSend ?? false,
        from: pulseSend.from,
      })) ?? [])
    );
    pulseSend?.destinationModules.forEach((module) => {
      console.log(
        `${currentModule.module.name} -${
          pulseSend.pulseToSend ? "High" : "Low"
        }-> ${module.name}`,
        `[${modulesToProcess.map((module) => module.module.name).join(",")}]`
      );
    });
  }
  // console.count();
  // console.log("done");
  // console.log({ lowPulses, highPulses }, lowPulses * highPulses);
  return { highPulses, lowPulses };
};

const main = async (input: string) => {
  const moduleConfiguration = parseModuleConfiguration(input);
  console.log(moduleConfiguration);

  const buttonModule = new ButtonModule("button");
  const broadcasterModule = moduleConfiguration.get("broadcaster");
  if (!broadcasterModule) {
    throw new Error("Can not find broadcaster module");
  }
  buttonModule.destinationModules.push(broadcasterModule);

  let totalHighPulses = 0,
    totalLowPulses = 0;

  for (let buttonPressIndex = 0; buttonPressIndex < 1000; buttonPressIndex++) {
    const { highPulses, lowPulses } = await pushTheButton(buttonModule);
    totalHighPulses += highPulses;
    totalLowPulses += lowPulses;
    console.count();
  }
  console.log(
    { totalHighPulses, totalLowPulses },
    totalHighPulses * totalLowPulses
  );
};

try {
  const useExample = false;
  const filePath = useExample ? "input-example3.txt" : "input.txt";
  const input: string = fs.readFileSync(filePath, "utf8");

  main(input);

  //775766576 too low
  //796815156 too low
} catch (e: any) {
  console.log("Error:", e.stack);
}
