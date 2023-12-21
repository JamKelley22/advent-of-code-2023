import {
  BroadcastModule,
  ButtonModule,
  ConjunctionModule,
  FlipFlopModule,
  Module,
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
    tempModuleMap.set(moduleName, destinationModuleNames);
    moduleMap.set(moduleName, module);
  });

  tempModuleMap.forEach((destinationModuleNames, moduleName) => {
    const destinationModules = destinationModuleNames.reduce(
      (acc, destinationModuleName) => {
        const destinationModule = moduleMap.get(destinationModuleName);
        if (destinationModule) return [...acc, destinationModule];
        return acc;
      },
      [] as Module[]
    );
    const module = moduleMap.get(moduleName);
    if (module) module.destinationModules = destinationModules;
  });

  return moduleMap;
};

try {
  const useExample = true;
  const filePath = useExample ? "input-example1.txt" : "input.txt";
  const input: string = fs.readFileSync(filePath, "utf8");

  const moduleConfiguration = parseModuleConfiguration(input);
  const buttonModule = new ButtonModule("button");
  const broadcasterModule = moduleConfiguration.get("broadcaster");
  broadcasterModule?.receivePulse(false, buttonModule);
  broadcasterModule?.destinationModules.forEach((module) => {
    module.sendPulse();
  });

  //   moduleConfiguration.forEach((value,key) => {
  //     value.
  //   })
  console.log(moduleConfiguration);
} catch (e: any) {
  console.log("Error:", e.stack);
}
