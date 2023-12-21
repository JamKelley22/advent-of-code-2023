export type Pulse = boolean;

export abstract class Module {
  name: string;
  destinationModules: Module[];

  constructor(name: string) {
    this.name = name;
    this.destinationModules = [];
  }

  abstract receivePulse(pulse: Pulse, fromModule: Module): Pulse;

  sendPulse = (pulse: Pulse) => {
    this.destinationModules.forEach((module) => {
      module.receivePulse(pulse, this);
    });
  };
}

export class FlipFlopModule extends Module {
  state: boolean;
  constructor(name: string) {
    super(name);
    this.state = false;
  }
  receivePulse(pulse: Pulse): Pulse {
    //Ignore all high pulses
    if (!pulse) {
      this.state = !this.state;
    }
    return this.state;
  }
}

export class ConjunctionModule extends Module {
  mostRecentReceivedPulses: Map<string, Pulse>;
  constructor(name: string) {
    super(name);
    this.mostRecentReceivedPulses = new Map<string, Pulse>();
  }
  receivePulse(pulse: Pulse, fromModule: Module): Pulse {
    //When a pulse is received, the conjunction module first updates its memory for that input
    this.mostRecentReceivedPulses.set(fromModule.name, pulse);
    //Then, if it remembers high pulses for all inputs, it sends a low pulse
    const allHighMemoryPulses = [...this.mostRecentReceivedPulses].every(
      ([moduleName, mostRecentPulse]) => mostRecentPulse === true
    );
    if (allHighMemoryPulses) {
      return false;
    }
    //otherwise, it sends a high pulse.
    return true;
  }
}

export class BroadcastModule extends Module {
  constructor(name: string) {
    super(name);
  }
  receivePulse(pulse: Pulse): Pulse {
    return pulse;
  }
}

export class ButtonModule extends Module {
  constructor(name: string) {
    super(name);
  }
  receivePulse(pulse: Pulse, fromModule: Module): Pulse {
    throw new Error("Button Module can not receive pulses");
  }
}
