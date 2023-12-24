export type Pulse = boolean;

export abstract class Module {
  name: string;
  destinationModules: Module[];
  inputModules: Module[];

  constructor(name: string) {
    this.name = name;
    this.destinationModules = [];
    this.inputModules = [];
  }

  abstract receivePulse(
    pulse: Pulse,
    fromModule?: Module
  ): { destinationModules: Module[]; pulseToSend?: Pulse; from?: Module };

  // abstract sendPulse(): { destinationModules: Module[]; sentPulse?: Pulse };
}

export class FlipFlopModule extends Module {
  state: boolean;
  // sendNextPulse: boolean;
  constructor(name: string) {
    super(name);
    this.state = false;
  }
  receivePulse(
    pulse: Pulse,
    fromModule?: Module
  ): { destinationModules: Module[]; pulseToSend?: Pulse; from?: Module } {
    //Ignore all high pulses
    if (pulse) {
      //High Pulse
      return {
        destinationModules: [],
        pulseToSend: undefined,
        from: undefined,
      };
    }
    this.state = !this.state;
    const pulseToSend = this.state;
    return {
      destinationModules: this.destinationModules,
      pulseToSend,
      from: this,
    };
    // this.destinationModules.forEach((module) => {
    //   module.receivePulse(pulseToSend, this);
    // });
  }
  // sendPulse(): { destinationModules: Module[]; sentPulse?: Pulse } {
  //   // if (!this.sendNextPulse)
  //   //   return { destinationModules: [], sentPulse: undefined };

  //   const pulseToSend = this.state;
  //   this.destinationModules.forEach((module) => {
  //     module.receivePulse(pulseToSend, this);
  //   });
  //   return {
  //     destinationModules: this.destinationModules,
  //     sentPulse: pulseToSend,
  //   };
  // }
}

export class ConjunctionModule extends Module {
  mostRecentReceivedPulses: Map<string, Pulse>;
  constructor(name: string) {
    super(name);
    this.mostRecentReceivedPulses = new Map<string, Pulse>();
  }
  receivePulse(
    pulse: Pulse,
    fromModule?: Module
  ): { destinationModules: Module[]; pulseToSend?: Pulse; from?: Module } {
    if (this.mostRecentReceivedPulses.size === 0) {
      //Update w/ input modules first time
      this.inputModules.forEach((inModule) => {
        this.mostRecentReceivedPulses.set(inModule.name, false);
      });
    }
    //When a pulse is received, the conjunction module first updates its memory for that input
    this.mostRecentReceivedPulses.set(fromModule?.name ?? "???", pulse);
    // console.log(
    //   this.name,
    //   // fromModule?.name,
    //   // "this.mostRecentReceivedPulses",
    //   // this.mostRecentReceivedPulses,
    //   this.destinationModules
    // );

    //Then, if it remembers high pulses for all inputs, it sends a low pulse
    const allHighMemoryPulses = [...this.mostRecentReceivedPulses].every(
      ([moduleName, mostRecentPulse]) => mostRecentPulse === true
    );

    // console.log({ allHighMemoryPulses });

    const pulseToSend = allHighMemoryPulses ? false : true;
    return {
      destinationModules: this.destinationModules,
      pulseToSend,
      from: this,
    };
    // this.destinationModules.forEach((module) => {
    //   module.receivePulse(pulseToSend, this);
    // });
  }
  // sendPulse(): { destinationModules: Module[]; sentPulse: Pulse } {
  //   //Then, if it remembers high pulses for all inputs, it sends a low pulse
  //   const allHighMemoryPulses = [...this.mostRecentReceivedPulses].every(
  //     ([moduleName, mostRecentPulse]) => mostRecentPulse === true
  //   );
  //   // if (allHighMemoryPulses) {
  //   //   return false;
  //   // }
  //   // //otherwise, it sends a high pulse.
  //   // return true;

  //   const pulseToSend = allHighMemoryPulses ? false : true;
  //   this.destinationModules.forEach((module) => {
  //     module.receivePulse(pulseToSend, this);
  //   });
  //   return {
  //     destinationModules: this.destinationModules,
  //     sentPulse: pulseToSend,
  //   };
  // }
}

export class BroadcastModule extends Module {
  state: boolean;
  constructor(name: string) {
    super(name);
    this.state = false;
  }
  receivePulse(pulse: Pulse): {
    destinationModules: Module[];
    pulseToSend?: Pulse;
    from?: Module;
  } {
    this.state = pulse;
    const pulseToSend = this.state;
    return {
      destinationModules: this.destinationModules,
      pulseToSend,
      from: this,
    };
    // this.destinationModules.forEach((module) => {
    //   module.receivePulse(pulseToSend, this);
    // });
  }
  // sendPulse(): { destinationModules: Module[]; sentPulse: Pulse } {
  //   const pulseToSend = this.state;
  //   this.destinationModules.forEach((module) => {
  //     module.receivePulse(pulseToSend, this);
  //   });
  //   return {
  //     destinationModules: this.destinationModules,
  //     sentPulse: pulseToSend,
  //   };
  // }
}

export class ButtonModule extends Module {
  constructor(name: string) {
    super(name);
  }
  receivePulse(
    pulse: Pulse,
    fromModule?: Module
  ): { destinationModules: Module[]; pulseToSend?: Pulse; from?: Module } {
    const pulseToSend = false;
    return {
      destinationModules: this.destinationModules,
      pulseToSend,
      from: this,
    };
    // this.destinationModules.forEach((module) => {
    //   module.receivePulse(pulseToSend, this);
    // });
  }
  // sendPulse(): { destinationModules: Module[]; sentPulse: Pulse } {
  //   const pulseToSend = false;
  //   this.destinationModules.forEach((module) => {
  //     module.receivePulse(pulseToSend, this);
  //   });
  //   return {
  //     destinationModules: this.destinationModules,
  //     sentPulse: pulseToSend,
  //   };
  // }
}

export class OutputModule extends Module {
  constructor(name: string) {
    super(name);
  }
  receivePulse(
    pulse: Pulse,
    fromModule?: Module
  ): { destinationModules: Module[]; pulseToSend?: Pulse; from?: Module } {
    return {
      destinationModules: [],
      pulseToSend: undefined,
      from: undefined,
    };
  }
}
