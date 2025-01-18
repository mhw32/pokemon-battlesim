import React, { useEffect, useState } from 'react';
import { Box, Typography } from "@mui/material";
import SlowText from "../shared/SlowText";
import BlinkingArrow from "../shared/BlinkingArrow";
import BlinkingSideArrow from "../shared/BlinkingSideArrow";
import Pokeballs from './Pokeballs';
import Healthbar from './Healthbar';
import WinOutro from './WinOutro';
import LoseOutro from './LoseOutro';
import './Battle.css';

const PokemonTypes = {
  Fighting: 0,
  Normal: 1,
  Grass: 2,
  Water: 3,
  Fire: 4,
  Psychic: 5,
  Ground: 6,
  Electric: 7,
  Flying: 8,
  Ghost: 9,
  Dark: 10,
}

// -----

type Move = {
  name: string;
  sound: string;
  animate: string;
  animationTarget: number;
  power: number;
  type: number;
  accuracy: number;
  overlay?: string;
  effect?: (self: Pokemon, opponent: Pokemon, damage: number) => [Pokemon, Pokemon, string];
}

// -----

type Pokemon = {
  name: string;
  frontImage: string;
  backImage: string;
  type: number;
  curHealth: number;
  maxHealth: number;
  level: number;
  attack: number;
  defense: number;
  moves: Move[];
  isDead: boolean;
}

const animations = [
  `${process.env.PUBLIC_URL}/animations/charm.png`,
  `${process.env.PUBLIC_URL}/animations/drip-drop.png`,
  `${process.env.PUBLIC_URL}/animations/exclamation.png`,
  `${process.env.PUBLIC_URL}/animations/knock-up.png`,
  `${process.env.PUBLIC_URL}/animations/pound.png`,
  `${process.env.PUBLIC_URL}/animations/slash.png`,
  `${process.env.PUBLIC_URL}/animations/string-shot.png`,
  `${process.env.PUBLIC_URL}/animations/swift.png`,
  `${process.env.PUBLIC_URL}/animations/vogue.png`,
  `${process.env.PUBLIC_URL}/animations/makeitrain.png`,
  `${process.env.PUBLIC_URL}/animations/ice.png`,
];

/**
 * Get Connie's team
 * @returns (Pokemon[])
 */
const getConnieTeam = (): Pokemon[] => {
  const Parker: Pokemon = {
    name: "Parker",
    backImage: `${process.env.PUBLIC_URL}/pokemon/parker-self.png`,
    frontImage: `${process.env.PUBLIC_URL}/pokemon/parker-opponent.png`,
    type: PokemonTypes.Fighting,
    curHealth: 85,
    maxHealth: 85,
    level: 30,
    attack: 84,
    defense: 76,
    isDead: false,
    moves: [
      {
        name: "Night Shade",
        sound: `${process.env.PUBLIC_URL}/sounds/Parker-NightShade.wav`,
        animate: 'set-black-box-pulse', //pulse full screen opacity
        animationTarget: 0,
        power: 80,
        type: PokemonTypes.Ghost,
        accuracy: 100,
      },
      {
        name: "Confuse Ray",
        sound: `${process.env.PUBLIC_URL}/sounds/Parker-ConfuseRay.wav`,
        animate: 'set-black-box-pulse', //pulse full screen opacity
        animationTarget: 0,
        power: 0,
        type: PokemonTypes.Ghost,
        accuracy: 50,
        effect: (self: Pokemon, opponent: Pokemon, damage: number) => {
          self.defense = self.defense * 0.67;
          const message = `${opponent.name.toUpperCase()} is confused! Its defense is lowered.`;
          return [self, opponent, message];
        }
      },
      {
        name: "Swift Exit",
        sound: `${process.env.PUBLIC_URL}/sounds/Parker-SwiftExit.wav`,
        overlay: `${process.env.PUBLIC_URL}/animations/swift.png`,
        animate: 'overlayEffect 1s ease-in-out 1s', //pulse star overlay on opponent
        animationTarget: 1,
        power: 60,
        type: PokemonTypes.Normal,
        accuracy: 100,
      },
      {
        name: "Bulk Up",
        sound: `${process.env.PUBLIC_URL}/sounds/Parker-BulkUp.wav`,
        animate: 'tempGrow 1s ease-in-out 1s', //grow self
        animationTarget: 0,
        power: 0,
        type: PokemonTypes.Fighting,
        accuracy: 100,
        effect: (self: Pokemon, opponent: Pokemon, damage: number) => {
          self.defense = self.defense * 1.25;
          self.attack = self.attack * 1.25;
          const message = `Its attack and defense rose!`;
          return [self, opponent, message];
        }
      },
    ],
  }
  const Robbie: Pokemon = {
    name: "Robbie",
    backImage: `${process.env.PUBLIC_URL}/pokemon/robbie-self.png`,
    frontImage: `${process.env.PUBLIC_URL}/pokemon/robbie-opponent.png`,
    type: PokemonTypes.Grass,
    curHealth: 83,
    maxHealth: 83,
    level: 30,
    attack: 75,
    defense: 75,
    isDead: false,
    moves: [
      {
        name: "Taunt",  // growl
        sound: `${process.env.PUBLIC_URL}/sounds/Robbie-Taunt.wav`,
        animate: 'wigglePokemon 1s ease-in-out 1s', //wiggle opponent
        animationTarget: 0,
        power: 0,
        type: PokemonTypes.Normal,
        accuracy: 100,
        effect: (self: Pokemon, opponent: Pokemon, damage: number) => {
          opponent.attack = opponent.attack * 0.67;
          const message = `The foe ${opponent.name.toUpperCase()}'s attack fell!`;
          return [self, opponent, message];
        }
      },
      {
        name: "Cheap Shot",
        sound: `${process.env.PUBLIC_URL}/sounds/Robbie-StringShot.wav`,
        overlay: `${process.env.PUBLIC_URL}/animations/string-shot.png`,
        animate: 'overlayEffect 1s ease-in-out 1s', //pulse lines overlay on opponent
        animationTarget: 1,
        power: 40,
        type: PokemonTypes.Grass,
        accuracy: 100,
        effect: (self: Pokemon, opponent: Pokemon, damage: number) => {
          opponent.defense = opponent.defense * 0.67;
          const message = `The foe ${opponent.name.toUpperCase()}'s defense fell!`;
          return [self, opponent, message];
        }
      },
      {
        name: "Be Submissive",
        sound: `${process.env.PUBLIC_URL}/sounds/Robbie-Submission.wav`,
        animate: 'tempShrink 1s ease-in-out 1s', //shrink self
        animationTarget: 0,
        power: 80,
        type: PokemonTypes.Fighting,
        accuracy: 100,
        effect: (self: Pokemon, opponent: Pokemon, damage: number) => {
          self.curHealth = Math.round(Math.max(0, self.curHealth - damage * 0.25));
          const message = `${self.name.toUpperCase()} is hit with recoil!`;
          return [self, opponent, message];
        }
      },
      {
        name: "Foul Play",
        sound: `${process.env.PUBLIC_URL}/sounds/Robbie-FoulPlay.wav`,
        animate: 'slideAttack 1s ease-in-out 1s', //shift self
        animationTarget: 0,
        power: 95,
        type: PokemonTypes.Dark,
        accuracy: 80,
      },
    ],
  }
  const Laura: Pokemon = {
    name: "Laura",
    backImage: `${process.env.PUBLIC_URL}/pokemon/laura-self.png`,
    frontImage: `${process.env.PUBLIC_URL}/pokemon/laura-opponent.png`,
    type: PokemonTypes.Normal,
    curHealth: 85,
    maxHealth: 85,
    level: 30,
    attack: 65,
    defense: 90,
    isDead: false,
    moves: [
      {
        name: "Shavasana",
        sound: `${process.env.PUBLIC_URL}/sounds/Laura-Shavasana.wav`,
        animate: 'wigglePokemon 1s ease-in-out 1s', //wiggle opponent
        animationTarget: 0,
        power: 0,
        type: PokemonTypes.Grass,
        accuracy: 75,
        effect: (self: Pokemon, opponent: Pokemon, damage: number) => {
          opponent.defense = opponent.defense * 0.67;
          const message = `The foe ${opponent.name.toUpperCase()}'s defense fell!`;
          return [self, opponent, message];
        }
      },
      {
        name: "Blitz",
        sound: `${process.env.PUBLIC_URL}/sounds/Laura-Blitz.wav`,
        overlay: `${process.env.PUBLIC_URL}/animations/pound.png`,
        animate: 'overlayEffect 1s ease-in-out 1s', //pulse pound overlay on opponent
        animationTarget: 1,
        power: 120,
        type: PokemonTypes.Fire,
        accuracy: 100,
        effect: (self: Pokemon, opponent: Pokemon, damage: number) => {
          self.curHealth = Math.round(Math.max(0, self.curHealth - damage * 0.33));
          const message = `${self.name.toUpperCase()} is hit with recoil!`;
          return [self, opponent, message];
        }
      },
      {
        name: "Knock Up",
        sound: `${process.env.PUBLIC_URL}/sounds/Laura-KnockUp.wav`,
        overlay: `${process.env.PUBLIC_URL}/animations/knock-up.png`,
        animate: 'overlayEffect 1s ease-in-out 1s', //pulse egg overlay on opponent
        animationTarget: 1,
        power: 60,
        type: PokemonTypes.Dark,
        accuracy: 100,
      },
      {
        name: "Yes And",
        sound: `${process.env.PUBLIC_URL}/sounds/Laura-YesAnd.wav`,
        animate: 'tempGrow 1s ease-in-out 1s', //grow self
        animationTarget: 0,
        power: 0,
        type: PokemonTypes.Dark,
        accuracy: 100,
        effect: (self: Pokemon, opponent: Pokemon, damage: number) => {
          self.attack = self.attack * 1.5;
          const message = `It's attack rose!`;
          return [self, opponent, message];
        }
      }
    ],
  }
  const Connie: Pokemon = {
    name: "Connie",
    backImage: `${process.env.PUBLIC_URL}/pokemon/connie-self.png`,
    frontImage: `${process.env.PUBLIC_URL}/pokemon/connie-opponent.png`,
    type: PokemonTypes.Psychic,
    curHealth: 94,
    maxHealth: 94,
    level: 29,
    attack: 68,
    defense: 68,
    isDead: false,
    moves: [
      {
        name: "Charm",
        sound: `${process.env.PUBLIC_URL}/sounds/Connie-Charm.wav`,
        overlay: `${process.env.PUBLIC_URL}/animations/charm.png`,
        animate: 'overlayEffect 1s ease-in-out 1s', //pulse hearts overlay on opponent
        animationTarget: 1,
        power: 0,
        type: PokemonTypes.Normal,
        accuracy: 100,
        effect: (self: Pokemon, opponent: Pokemon, damage: number) => {
          opponent.attack = opponent.attack * 0.5;
          const message = `The foe ${opponent.name.toUpperCase()}'s attack greatly fell!`;
          return [self, opponent, message];
        }
      },
      {
        name: "Bum Rush",
        sound: `${process.env.PUBLIC_URL}/sounds/Connie-BumRush.wav`,
        overlay: `${process.env.PUBLIC_URL}/animations/pound.png`,
        animate: 'overlayEffect 0.2s linear 1s', //flash pound overlay on opponent
        animationTarget: 1,
        power: 0,
        type: PokemonTypes.Normal,
        accuracy: 100,
        effect: (self: Pokemon, opponent: Pokemon, damage: number) => {
          let message: string;
          if (self.curHealth < (self.maxHealth / 2)) {
            message = `But ${self.name.toUpperCase()}'s HP is too low!`;
          } else {
            self.attack = self.attack * 4.0;
            self.curHealth -= Math.round(self.maxHealth / 2);
            message = `${self.name.toUpperCase()} cut its own HP and maximized its attack!`;
          }
          return [self, opponent, message];
        }
      },
      {
        name: "Take Down",
        sound: `${process.env.PUBLIC_URL}/sounds/Connie-TakeDown.wav`,
        animate: 'slideAttack 1s ease-in-out 1s', //shift self
        animationTarget: 0,
        power: 90,
        type: PokemonTypes.Normal,
        accuracy: 85,
        effect: (self: Pokemon, opponent: Pokemon, damage: number) => {
          self.curHealth = Math.round(Math.max(0, self.curHealth - damage * 0.25));
          const message = `${self.name.toUpperCase()} is hit with recoil!`;
          return [self, opponent, message];
        }
      },
      {
        name: "Facade",
        sound: `${process.env.PUBLIC_URL}/sounds/Connie-Facade.wav`,
        animate: 'fadeAway 1s ease-in-out 1s', //fade self
        animationTarget: 0,
        power: 70,
        type: PokemonTypes.Normal,
        accuracy: 100,
      },
    ],
  }
  return [Parker, Connie, Robbie, Laura];
}

/**
 * Get Mike's team
 * @returns (Pokemon[])
 */
const getMikeTeam = (): Pokemon[] => {
  const Don: Pokemon = {
    name: "Don",
    backImage: `${process.env.PUBLIC_URL}/pokemon/don-self.png`,
    frontImage: `${process.env.PUBLIC_URL}/pokemon/don-opponent.png`,
    type: PokemonTypes.Ground,
    curHealth: 83,
    maxHealth: 83,
    level: 30,
    attack: 84,
    defense: 85,
    isDead: false,
    moves: [
      {
        name: "Sandbag",
        sound: `${process.env.PUBLIC_URL}/sounds/Don-Sandbag.wav`,
        animate: 'tempShrink 1s ease-in-out 1s', //shrink self
        animationTarget: 0,
        power: 0,
        type: PokemonTypes.Ground,
        accuracy: 100,
        effect: (self: Pokemon, opponent: Pokemon, damage: number) => {
          self.defense = self.defense * 0.67;
          const message = `${self.name.toUpperCase()}'s defense fell!`;
          return [self, opponent, message];
        }
      },
      {
        name: "Amnesia",
        sound: `${process.env.PUBLIC_URL}/sounds/Don-Amnesia.wav`,
        animate: 'pulseBrightness 1s ease-in-out 1s', //pulse self
        animationTarget: 0,
        power: 0,
        type: PokemonTypes.Psychic,
        accuracy: 100,
        effect: (self: Pokemon, opponent: Pokemon, damage: number) => {
          self.defense = self.defense * 1.5;
          self.attack = self.attack * 1.5;
          const message = `Its attack and defense rose!`;
          return [self, opponent, message];
        }
      },
      {
        name: "Hero Point",
        sound: `${process.env.PUBLIC_URL}/sounds/Don-HeroPoint.wav`,
        overlay: `${process.env.PUBLIC_URL}/animations/pound.png`,
        animate: 'overlayEffect 0.2s linear 1s', //flash pound overlay on opponent
        animationTarget: 1,
        power: 100,
        type: PokemonTypes.Ground,
        accuracy: 50,
      },
      {
        name: "Vogue",
        sound: `${process.env.PUBLIC_URL}/sounds/Don-Vogue.wav`,
        overlay: `${process.env.PUBLIC_URL}/animations/vogue.png`,
        animate: 'overlayEffect 1s ease-in-out 1s', //pulse sparkle overlay on opponent
        animationTarget: 1,
        power: 80,
        type: PokemonTypes.Normal,
        accuracy: 90,
      },
    ],
  }
  const Michael: Pokemon = {
    name: "Michael",
    backImage: `${process.env.PUBLIC_URL}/pokemon/michael-self.png`,
    frontImage: `${process.env.PUBLIC_URL}/pokemon/michael-opponent.png`,
    type: PokemonTypes.Flying,
    curHealth: 84,
    maxHealth: 84,
    level: 30,
    attack: 80,
    defense: 77,
    isDead: false,
    moves: [
      {
        name: "Peakbag",
        sound: `${process.env.PUBLIC_URL}/sounds/Michael-AscendMountain.wav`,
        // overlay: `${process.env.PUBLIC_URL}/animations/pound.png`,
        animate: 'slideYAttack 1s ease-in-out 1s', //shift self
        animationTarget: 0,
        power: 50,
        type: PokemonTypes.Flying,
        accuracy: 95,
      },
      {
        name: "Ranger Slash",
        sound: `${process.env.PUBLIC_URL}/sounds/Michael-RangerSlash.wav`,
        overlay: `${process.env.PUBLIC_URL}/animations/slash.png`,
        animate: 'overlayEffect 0.2s linear 1s', //flash slash overlay on opponent
        animationTarget: 1,
        power: 65,
        type: PokemonTypes.Flying,
        accuracy: 95,
      },
      {
        name: "Read Book",
        sound: `${process.env.PUBLIC_URL}/sounds/Michael-ReadBook.wav`,
        animate: 'pulseBrightness 1s ease-in-out 1s', //pulse self
        animationTarget: 0,
        power: 0,
        type: PokemonTypes.Normal,
        accuracy: 100,
        effect: (self: Pokemon, opponent: Pokemon, damage: number) => {
          self.defense = self.defense * 1.5;
          const message = `${self.name.toUpperCase()}'s defense rose!`;
          return [self, opponent, message];
        }
      },
      {
        name: "First Aid",
        sound: `${process.env.PUBLIC_URL}/sounds/Michael-FirstAid.wav`,
        overlay: `${process.env.PUBLIC_URL}/animations/charm.png`,
        animate: 'overlayEffect 1s ease-in-out 1s', //pulse hearts overlay on SELF
        animationTarget: 0,
        power: 0,
        type: PokemonTypes.Flying,
        accuracy: 100,
        effect: (self: Pokemon, opponent: Pokemon, damage: number) => {
          self.curHealth += Math.round(self.maxHealth / 4)
          if (self.curHealth > self.maxHealth) {
            self.curHealth = self.maxHealth;
          }
          const message = `${self.name.toUpperCase()} regained health!`;
          return [self, opponent, message];
        }
      },
    ],
  }
  const Steven: Pokemon = {
    name: "Steven",
    backImage: `${process.env.PUBLIC_URL}/pokemon/steven-self.png`,
    frontImage: `${process.env.PUBLIC_URL}/pokemon/steven-opponent.png`,
    type: PokemonTypes.Electric,
    curHealth: 94,
    maxHealth: 94,
    level: 30,
    attack: 84,
    defense: 83,
    isDead: false,
    moves: [
      {
        name: "Double Down",
        sound: `${process.env.PUBLIC_URL}/sounds/Steven-DoubleDown.wav`,
        overlay: `${process.env.PUBLIC_URL}/animations/pound.png`,
        animate: 'overlayEffect 0.2s linear 1s 2', //flash pound overlay TWICE on opponent
        animationTarget: 1,
        power: 70,
        type: PokemonTypes.Normal,
        accuracy: 80,
      },
      {
        name: "Outburst",
        sound: `${process.env.PUBLIC_URL}/sounds/Steven-ShockingOutburst.wav`,
        overlay: `${process.env.PUBLIC_URL}/animations/exclamation.png`,
        animate: 'overlayEffect 0.2s linear 1s', //flash exclamation overlay on opponent
        animationTarget: 1,
        power: 60,
        type: PokemonTypes.Electric,
        accuracy: 100,
      },
      {
        name: "Big Stretch",
        sound: `${process.env.PUBLIC_URL}/sounds/Steven-MorningStretch.wav`,
        animate: 'tempGrow 1s ease-in-out 1s', //grow self
        animationTarget: 0,
        power: 0,
        type: PokemonTypes.Psychic,
        accuracy: 100,
        effect: (self: Pokemon, opponent: Pokemon, damage: number) => {
          self.attack = self.attack * 1.5;
          const message = `It's attack rose!`;
          return [self, opponent, message];
        }
      },
      {
        name: "Power Trip",
        sound: `${process.env.PUBLIC_URL}/sounds/Steven-PowerTrip.wav`,
        animate: 'pulseBrightness 1s ease-in-out 1s', //pulse self
        animationTarget: 0,
        power: 20,
        type: PokemonTypes.Dark,
        accuracy: 100,
        effect: (self: Pokemon, opponent: Pokemon, damage: number) => {
          self.attack = self.attack + 20;
          self.defense = self.defense + 20;
          const message = `It's attack and defense rose!`;
          return [self, opponent, message];
        }
      },
    ],
  }
  const Mike: Pokemon = {
    name: "Mike",
    backImage: `${process.env.PUBLIC_URL}/pokemon/mike-self.png`,
    frontImage: `${process.env.PUBLIC_URL}/pokemon/mike-opponent.png`,
    type: PokemonTypes.Water,
    curHealth: 52,
    maxHealth: 52,
    level: 30,
    attack: 83,
    defense: 84,
    isDead: false,
    moves: [
      {
        name: "Harden",
        sound: `${process.env.PUBLIC_URL}/sounds/Mike-Harden.wav`,
        animate: 'tempGrow 1s ease-in-out 1s', //grow self
        animationTarget: 0,
        power: 0,
        type: PokemonTypes.Normal,
        accuracy: 100,
        effect: (self: Pokemon, opponent: Pokemon, damage: number) => {
          self.defense = self.defense * 1.5;
          const message = `${self.name.toUpperCase()}'s defense rose!`;
          return [self, opponent, message];
        }
      },
      {
        name: "Ice Out", //ice shard
        sound: `${process.env.PUBLIC_URL}/sounds/Mike-IceOut.wav`,
        overlay: `${process.env.PUBLIC_URL}/animations/ice.png`,
        animate: 'overlayEffect 0.2s linear 1s', //flash slash overlay on opponent
        animationTarget: 1,
        power: 60,
        type: PokemonTypes.Water,
        accuracy: 100,
      },
      {
        name: "Make it Rain", 
        sound: `${process.env.PUBLIC_URL}/sounds/Mike-MakeItRain.wav`,
        overlay: `${process.env.PUBLIC_URL}/animations/makeitrain.png`,
        animate: 'overlayEffect 1s ease-in-out 1s', //flash money overlay on opponent
        animationTarget: 1,
        power: 60,
        type: PokemonTypes.Normal,
        accuracy: 90,
      },
      {
        name: "Drip Dropshot",
        sound: `${process.env.PUBLIC_URL}/sounds/Mike-DripDropShot.wav`,
        overlay: `${process.env.PUBLIC_URL}/animations/drip-drop.png`,
        animate: 'overlayEffect 1s ease-in-out 1s', //pulse water overlay on opponent
        animationTarget: 1,
        power: 40,
        type: PokemonTypes.Normal,
        accuracy: 100,
      },
    ],
  }
  return [Don, Mike, Michael, Steven];
}

// -----

/**
 * MOD: 2 if super effective, 0.5 if not
 */
const getModifier = (attacker: Pokemon, defender: Pokemon, move: Move): number => {
  if (defender.type === PokemonTypes.Fighting) {
    if (move.type === PokemonTypes.Psychic) {
      return 2.0;
    } else if (move.type === PokemonTypes.Dark) {
      return 0.5;
    } else {
      return 1.0;
    }
  } else if (defender.type === PokemonTypes.Normal) {
    if (move.type === PokemonTypes.Fighting) {
      return 2.0;
    } else if (move.type === PokemonTypes.Ghost) {
      return 0.0;
    } else {
      return 1.0;
    }
  } else if (defender.type === PokemonTypes.Grass) {
    if (move.type === PokemonTypes.Fire) {
      return 2.0;
    } else if (move.type === PokemonTypes.Water) {
      return 0.5;
    } else if (move.type === PokemonTypes.Ground) {
      return 0.5;
    } else if (move.type === PokemonTypes.Grass) {
      return 0.5;
    } else if (move.type === PokemonTypes.Flying) {
      return 2.0;
    } else if (move.type === PokemonTypes.Electric) {
      return 0.5;
    } else {
      return 1.0;
    }
  } else if (defender.type === PokemonTypes.Water) {
    if (move.type === PokemonTypes.Grass) {
      return 2.0;
    } else if (move.type === PokemonTypes.Fire) {
      return 0.5;
    } else if (move.type === PokemonTypes.Electric) {
      return 2.0;
    } else if (move.type === PokemonTypes.Water) {
      return 0.5;
    } else {
      return 1.0;
    }
  } else if (defender.type === PokemonTypes.Fire) {
    if (move.type === PokemonTypes.Water) {
      return 2.0;
    } else if (move.type === PokemonTypes.Ground) {
      return 2.0;
    } else if (move.type === PokemonTypes.Grass) {
      return 0.5;
    } else if (move.type === PokemonTypes.Fire) {
      return 0.5;
    } else {
      return 1.0;
    }
  } else if (defender.type === PokemonTypes.Psychic) {
    if (move.type === PokemonTypes.Psychic) {
      return 0.5;
    } else if (move.type === PokemonTypes.Fighting) {
      return 0.5;
    } else if (move.type === PokemonTypes.Dark) {
      return 2.0;
    } else {
      return 1.0;
    } 
  } else if (defender.type === PokemonTypes.Ground) {
    if (move.type === PokemonTypes.Water) {
      return 2.0;
    } else if (move.type === PokemonTypes.Grass) {
      return 2.0;
    } else {
      return 1.0;
    } 
  } else if (defender.type === PokemonTypes.Electric) {
    if (move.type === PokemonTypes.Electric) {
      return 0.5;
    } else if (move.type === PokemonTypes.Ground) {
      return 2.0;
    } else if (move.type === PokemonTypes.Flying) {
      return 0.5;
    } else {
      return 1.0;
    }
  } else if (defender.type === PokemonTypes.Flying) {
    if (move.type === PokemonTypes.Electric) {
      return 2.0;
    } else if (move.type === PokemonTypes.Grass) {
      return 0.5;
    } else if (move.type === PokemonTypes.Ghost) {
      return 2.0;
    } else if (move.type === PokemonTypes.Fighting) {
      return 0.5;
    } else if (move.type === PokemonTypes.Ground) {
      return 0;
    } else {
      return 1.0;
    } 
  } else if (defender.type === PokemonTypes.Ghost) {
    if (move.type === PokemonTypes.Normal) {
      return 0.0;
    } else if (move.type === PokemonTypes.Fighting) {
      return 0.0;
    } else if (move.type === PokemonTypes.Ghost) {
      return 1.0;
    } else if (move.type === PokemonTypes.Dark) {
      return 2.0;
    } else {
      return 1.0;
    }
  } else if (defender.type === PokemonTypes.Dark) {
    if (move.type === PokemonTypes.Fighting) {
      return 2.0;
    } else if (move.type === PokemonTypes.Psychic) {
      return 0.0;
    } else if (move.type === PokemonTypes.Ghost) {
      return 0.5;
    } else if (move.type === PokemonTypes.Dark) {
      return 0.5;
    } else {
      return 1.0;
    }
  } else {
    return 1.0;
  }
}

const getZ = () => {
  return Math.floor(Math.random() * (255 - 217 + 1)) + 217;
}

const getDamage = (
  attacker: Pokemon,
  defender: Pokemon,
  move: Move,
): number => {
  if (move.power === 0) return 0;
  /**
   * Compute the damage. 
   * ((((2A/5+2)BC)/D)/50)+2)*X)Y/10)Z)/255 
   * A: The attacker's level
   * B: The attacker's attack or special
   * C: The attack power
   * D: The defender's defense or special
   * STAB: The same-type attack bonus, which is either 1 or 1.5
   * MOD: 2 if super effective, 0.5 if not
   * Z: A random number between 217 and 255
   */
  const A = attacker.level;
  const B = attacker.attack;
  const C = move.power;
  const D = defender.defense;
  const Z = getZ();
  const base = ((2*A/5+2)*B*C/D/50)+2;
  const stab = move.type === attacker.type ? 1.5 : 1.0;
  const mod = getModifier(attacker, defender, move);
  const damage = base * stab * mod * (Z / 255);
  return damage;
}

type InputProps = {
  team: number;
  onWin: (score: number, team: number) => void;
  stopAudio: () => void;
}

const Battle = ({ team, onWin, stopAudio }: InputProps) => {
  const [isMyFirst, setIsMyFirst] = useState<boolean>(true);
  const [isOpFirst, setIsOpFirst] = useState<boolean>(true);
  const [myTeam, setMyTeam] = useState<Pokemon[]>(team === 0 ? getConnieTeam() : getMikeTeam());
  const [opTeam, setOpTeam] = useState<Pokemon[]>(team === 0 ? getMikeTeam() : getConnieTeam());
  // which index of pokemon am i on
  const [myIdx, setMyIdx] = useState<number>(0);
  const [myPokemonImageKey, setMyPokemonImageKey] = useState<number>(0);
  // which index of pokemon is op on
  const [opIdx, setOpIdx] = useState<number>(0);
  const [opPokemonImageKey, setOpPokemonImageKey] = useState<number>(0);
  // which move index do i choose
  const [myMoveIdx, setMyMoveIdx] = useState<number>(0);
  const [myMoveEffect, setMyMoveEffect] = useState<string>();
  // which move index does op choose
  const [opMoveEffect, setOpMoveEffect] = useState<string>();
  const [mode, setMode] = useState<number>(0); //11 is lose, 12 is win
  const [turn, setTurn] = useState<number>(0);
  const [showActionMenu, setShowActionMenu] = useState<boolean>(false);
  const [showMoveMenu, setShowMoveMenu] = useState<boolean>(false);
  const [showTeamMenu, setShowTeamMenu] = useState<boolean>(false);
  const [showWinOutro, setShowWinOutro] = useState<boolean>(false);
  const [showLoseOutro, setShowLoseOutro] = useState<boolean>(false);
  const [selectedAction, setSelectedAction] = useState<number>(0);
  const [selectedPokemon, setSelectedPokemon] = useState<number>(0);
  const [showMyChar, setShowMyChar] = useState<boolean>(true);
  const [showOpChar, setShowOpChar] = useState<boolean>(true);
  // What is shown for me and others
  const [curText, setCurText] = useState<string>("Professor Oak wants to fight!");
  // Variables for move sounds  
  const [actionSoundUrl, setActionSoundUrl] = useState<string>();
  const [actionSoundIsPlaying, setActionSoundIsPlaying] = useState<boolean>(false);
  // Variables for animations
  const [showBlackBoxAnimation, setShowBlackBoxAnimation] = useState<boolean>(false);
  const [showMyOverlayAnimation, setShowMyOverlayAnimation] = useState<number>(-1);
  const [showOpOverlayAnimation, setShowOpOverlayAnimation] = useState<number>(-1);
  const [myPokemonAnimation, setMyPokemonAnimation] = useState<string | undefined>('slideInFromLeft 1s ease-in-out 1s forwards');
  const [opPokemonAnimation, setOpPokemonAnimation] = useState<string | undefined>('slideInFromRight 1s ease-in-out 1s forwards');
  const [myPokemonOpacity, setMyPokemonOpacity] = useState<number>(0);
  const [opPokemonOpacity, setOpPokemonOpacity] = useState<number>(0);
  
  useEffect(() => {
    if (showBlackBoxAnimation) {
      const timer = setTimeout(() => setShowBlackBoxAnimation(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [showBlackBoxAnimation]);

  useEffect(() => {
    if (showMyOverlayAnimation !== -1) {
      const timer = setTimeout(() => setShowMyOverlayAnimation(-1), 3000);
      return () => clearTimeout(timer);
    }
  }, [showMyOverlayAnimation]);

  useEffect(() => {
    if (showOpOverlayAnimation !== -1) {
      const timer = setTimeout(() => setShowOpOverlayAnimation(-1), 1000);
      return () => clearTimeout(timer);
    }
  }, [showOpOverlayAnimation]);

  // Pokemon & team
  const myPokemon = myTeam[myIdx];
  const opPokemon = opTeam[opIdx];

  useEffect(() => {
    setMyPokemonImageKey(prevKey => prevKey + 1);
  }, [myIdx]);

  useEffect(() => {
    setOpPokemonImageKey(prevKey => prevKey + 1);
  }, [opIdx]);

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'Enter') {
        // Mode 0 - Start of battle and you send out a pokemon
        if (mode === 0) {
          setShowMyChar(false);
          setCurText(`Go! ${myPokemon.name.toUpperCase()}!`);
          if (isMyFirst) {
            setMode(1);
            setIsMyFirst(false);
          } else {
            // I send out my next pokemon
            setMode(3);
          }
        } else if (mode === 1) {
          // Mode 1 - Opponent sends out their first pokemon
          setShowOpChar(false);
          setCurText(`Professor Oak sends out ${opPokemon.name.toUpperCase()}!`);
          if (isOpFirst) {
            setMode(2);
            setIsOpFirst(false);
          } else {
            // Opponent sends out their next pokemon
            setMode(7);
          }
        } else if (mode === 2) {
          // Mode 2 - Show user action menus
          setCurText("");
          setShowActionMenu(true);
          setShowMoveMenu(false);
          setShowTeamMenu(false);
          setMode(3);
        } else if (mode === 3) {
          // Mode 3 - Hide action menus and show move menu
          setShowTeamMenu(false);
          setShowMoveMenu(false);
          setShowActionMenu(false);
          if (selectedAction === 0) {
            setShowMoveMenu(true);
            setMode(4);
          } else if (selectedAction === 1) {  // switch
            setShowTeamMenu(true);
            setMode(5);
          }
        } else if (mode === 4) {
          if (myMoveIdx === 4) {
            // go back because user wants to
            setShowMoveMenu(false);
            setShowActionMenu(true);
            setShowTeamMenu(false);
            setMode(3);
          } else {
            // User chose a move
            setShowMoveMenu(false);
            setShowActionMenu(false);
            setShowTeamMenu(false);
            // My pokemon takes action now...
            const results = takeAction(team, myMoveIdx);
            setCurText(results.text);
            setMyMoveEffect(results.effect);
            setTurn(1);
            // If there's an effect we need an extra state
            if (results.effect) {
              setMode(6);
            } else if (myTeam[myIdx].curHealth <= 0) {
              // Check if all my pokemon are dead
              let totalHealth = 0;
              for (let i = 0; i < myTeam.length; i++) {
                totalHealth += myTeam[i].curHealth;
              }
              if (totalHealth <= 0) {
                setMode(11);  // game is over
              } else {
                setMode(9);   // my curr pokemon is dead
              }
            } else if (opTeam[opIdx].curHealth <= 0) {
              // Check if all opponent's pokemon are dead
              let totalHealth = 0;
              for (let i = 0; i < opTeam.length; i++) {
                totalHealth += opTeam[i].curHealth;
              }
              if (totalHealth <= 0) {
                setMode(12);  // game is over - you win
              } else {
                setMode(10);  // op's curr pokemon is dead
              }
            } else {
              setMode(7);
            }
          }
        } else if (mode === 5) {
          // User chose a pokemon to switch to
          setSelectedAction(0);
          if (selectedPokemon === 4) {
            // go back 
            setShowMoveMenu(false);
            setShowActionMenu(true);
            setShowTeamMenu(false);
            setMode(3);
          } else {
            // Check if the pokemon is dead or if it's the same as the current pokemon
            if (myTeam[selectedPokemon].isDead) {
              return;
            } else if (myTeam[selectedPokemon].name === myPokemon.name) {
              return;
            }
            setMyIdx(selectedPokemon);
            setMyMoveIdx(0);
            setShowMoveMenu(false);
            setShowActionMenu(false);
            setShowTeamMenu(false);
            // Start action for new pokemon
            setCurText(`Go! ${myTeam[selectedPokemon].name.toUpperCase()}!`);
            setMode(7);
          }
        } else if (mode === 6) {
          // Show effect from my Pokemon's move
          setCurText(myMoveEffect!);
          // Check again if any pokemon are dead
          if (myTeam[myIdx].curHealth <= 0) {
            // Check if all my pokemon are dead
            let totalHealth = 0;
            for (let i = 0; i < myTeam.length; i++) {
              totalHealth += myTeam[i].curHealth;
            }
            if (totalHealth <= 0) {
              setMode(11);  // game is over
            } else {
              setMode(9);   // my curr pokemon is dead
            }
          } else if (opTeam[opIdx].curHealth <= 0) {
            // Check if all opponent's pokemon are dead
            let totalHealth = 0;
            for (let i = 0; i < opTeam.length; i++) {
              totalHealth += opTeam[i].curHealth;
            }
            if (totalHealth <= 0) {
              setMode(12);  // game is over - you win
            } else {
              setMode(10);  // op's curr pokemon is dead
            }
          } else {
            setMode(7);
          }
        } else if (mode === 7) {
          // Opponent pokemon takes an action now
          // Pick a random move
          const randomMoveIdx = Math.floor(Math.random() * 4);
          const results = takeAction(1 - team, randomMoveIdx);
          setCurText(`Enemy ${results.text}`);
          setOpMoveEffect(results.effect);
          setTurn(0);
          // If there's an effect we need an extra state
          if (results.effect) {
            setMode(8);
          } else if (myTeam[myIdx].curHealth === 0) {
            // Check if all my pokemon are dead
            let totalHealth = 0;
            for (let i = 0; i < myTeam.length; i++) {
              totalHealth += myTeam[i].curHealth;
            }
            if (totalHealth === 0) {
              setMode(11);  // game is over
            } else {
              setMode(9);   // my curr pokemon is dead
            }
          } else if (opTeam[opIdx].curHealth === 0) {
            // Check if all opponent's pokemon are dead
            let totalHealth = 0;
            for (let i = 0; i < opTeam.length; i++) {
              totalHealth += opTeam[i].curHealth;
            }
            if (totalHealth === 0) {
              setMode(12);  // game is over - you win
            } else {
              setMode(10);  // op's curr pokemon is dead
            }
          } else {
            setMode(3); // back to start!
          }
        } else if (mode === 8) {
          // Show effect from op Pokemon's move
          setCurText(opMoveEffect!);
          // Check if any pokemon are dead
          if (myTeam[myIdx].curHealth === 0) {
            // Check if all my pokemon are dead
            let totalHealth = 0;
            for (let i = 0; i < myTeam.length; i++) {
              totalHealth += myTeam[i].curHealth;
            }
            if (totalHealth === 0) {
              setMode(11);  // game is over
            } else {
              setMode(9);   // my curr pokemon is dead
            }
          } else if (opTeam[opIdx].curHealth === 0) {
            // Check if all opponent's pokemon are dead
            let totalHealth = 0;
            for (let i = 0; i < opTeam.length; i++) {
              totalHealth += opTeam[i].curHealth;
            }
            if (totalHealth === 0) {
              setMode(12);  // game is over - you win
            } else {
              setMode(10);  // op's curr pokemon is dead
            }
          } else {
            setMode(3); // back to start!
          }
        } else if (mode === 9) {
          setCurText(`${myPokemon.name.toUpperCase()} fainted!`);
          // Find the next pokemon that is not dead, wrapping around to index 0 if needed
          // We are guaranteed to find a pokemon that is not dead because we check if all 
          // pokemon are dead at the start of each turn
          let nextIdx = (myIdx + 1) % myTeam.length;
          while (myTeam[nextIdx].isDead) {
            nextIdx = (nextIdx + 1) % myTeam.length;
            if (nextIdx === myIdx) {
              // We've checked all Pokemon and they're all dead
              break;
            }
          }
          setMyIdx(nextIdx);  // next Pokemon
          // My pokemon fainted but i have more
          setMyPokemonOpacity(0);
          setMyPokemonAnimation('slideInFromLeft 1s ease-in-out 1s forwards');
          if (turn === 0) {
            setMode(0);
          } else {
            setMode(1);
          }
        } else if (mode === 10) {
          setCurText(`Enemy ${opPokemon.name.toUpperCase()} fainted!`);
          // Find the next pokemon that is not dead, wrapping around to index 0 if needed
          // We are guaranteed to find a pokemon that is not dead because we check if all 
          // pokemon are dead at the start of each turn
          let nextIdx = (opIdx + 1) % opTeam.length;
          while (opTeam[nextIdx].isDead) {
            nextIdx = (nextIdx + 1) % opTeam.length;
            if (nextIdx === opIdx) {
              // We've checked all Pokemon and they're all dead
              break;
            }
          }
          setOpIdx(nextIdx);  // next Pokemon
          setOpPokemonOpacity(0);
          setOpPokemonAnimation('slideInFromRight 1s ease-in-out 1s forwards');
          if (turn === 0) {
            setMode(0);
          } else {
            setMode(1);
          }
        } else if (mode === 11) {
          // Op pokemon fainted & I'm out
          setCurText("You lost to Professor Oak...");
          setMode(13);
        } else if (mode === 12) {
          // My pokemon fainted & I'm out
          setCurText("You defeated Professor Oak!");
          setMode(14);
        } else if (mode === 13) {
          setShowLoseOutro(true);
          stopAudio();
        } else if (mode === 14) {
          setShowWinOutro(true);
          stopAudio();
        }
      } else if (e.key === 'Backspace') {
        if (mode === 4 || mode === 5) {
          setShowMoveMenu(false);
          setShowTeamMenu(false);
          setShowActionMenu(true);
          setMode(3);
        }
        e.preventDefault();
      } else if (e.key === 'ArrowDown') {
        if (mode === 3) {
          if (selectedAction === 0) {
            setSelectedAction(1);
          }
        } else if (mode === 4) {
          if (myMoveIdx === 0) {
            setMyMoveIdx(1);
          } else if (myMoveIdx === 1) {
            setMyMoveIdx(2);
          } else if (myMoveIdx === 2) {
            setMyMoveIdx(3);
          } 
        } else if (mode === 5) {
          if (selectedPokemon === 0) {
            setSelectedPokemon(1);
          } else if (selectedPokemon === 1) {
            setSelectedPokemon(2);
          } else if (selectedPokemon === 2) {
            setSelectedPokemon(3);
          }
        }
        e.preventDefault();
      } else if (e.key === 'ArrowUp') {
        if (mode === 3) {
          if (selectedAction === 1) {
            setSelectedAction(0);
          }
        } else if (mode === 4) { 
          if (myMoveIdx === 3) {
            setMyMoveIdx(2);
          } else if (myMoveIdx === 2) {
            setMyMoveIdx(1);
          } else if (myMoveIdx === 1) {
            setMyMoveIdx(0);
          }
        } else if (mode === 5) { 
          if (selectedPokemon === 3) {
            setSelectedPokemon(2);
          } else if (selectedPokemon === 2) {
            setSelectedPokemon(1);
          } else if (selectedPokemon === 1) {
            setSelectedPokemon(0);
          }
        } 
        e.preventDefault();
      } 
    }
    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [mode, myPokemon, opPokemon, selectedAction, myMoveIdx, myIdx, opIdx, 
      selectedPokemon, myMoveEffect, opMoveEffect, turn, myTeam, opTeam]);

  const checkIfHit = (move: Move): boolean => {
    const random = Math.floor(Math.random() * 100);
    return (random < move.accuracy);
  }

  /**
   * Get the score of the game
   * @returns the score
   */
  const getScore = (): number => {
    let score = 0;
    for (let i = 0; i < myTeam.length; i++) {
      score += myTeam[i].curHealth;
    }
    return score;
  }

  const takeAction = (curTeam: number, moveIdx: number): { text: string, effect?: string} => {
    let output: { text: string, effect?: string} = { text: "", effect: undefined};
    if (curTeam === team) {
      const myPokemon = myTeam[myIdx];
      const myMove = myPokemon.moves[moveIdx];
      if (!checkIfHit(myMove)) {
        output = {
          text: `${myPokemon.name.toUpperCase()} used ${myMove.name.toUpperCase()}!`,
          effect: `But it failed!`,
        }
        return output;
      }
      // compute damage
      const damage = getDamage(myPokemon, opTeam[opIdx], myMove);
      opTeam[opIdx].curHealth = Math.round(Math.max(0, opTeam[opIdx].curHealth - damage));
      // compute effects
      if (myMove.effect) {
        const [A, B, effectMsg] = myMove.effect(myTeam[myIdx], opTeam[opIdx], damage);
        myTeam[myIdx] = A;
        opTeam[opIdx] = B;
        output = {
          text: `${myPokemon.name.toUpperCase()} used ${myMove.name.toUpperCase()}!`,
          effect: effectMsg,
        }
      } else {
        output = {
          text: `${myPokemon.name.toUpperCase()} used ${myMove.name.toUpperCase()}!`,
          effect: undefined,
        }
      }
      // compute health
      if (opTeam[opIdx].curHealth === 0) {
        opTeam[opIdx].isDead = true;
      }
      setMyTeam([...myTeam]);
      setOpTeam([...opTeam]);
      // Play sound
      setActionSoundUrl(myMove.sound);
      // Play animation
      if (myMove.animate === 'set-black-box-pulse') {
        setShowBlackBoxAnimation(true);
      } else if (myMove.overlay) {
        const idx = animations.indexOf(myMove.overlay);
        if (idx !== -1) {
          if (myMove.animationTarget === 0) {
            setShowMyOverlayAnimation(idx);
          } else if (myMove.animationTarget === 1) {
            setShowOpOverlayAnimation(idx);
          }
        }
      } else if (!myMove.overlay && myMove.animate) {
        if (myMove.animationTarget === 0) {
          setMyPokemonAnimation(myMove.animate);
        } else if (myMove.animationTarget === 1) {
          setOpPokemonAnimation(myMove.animate);
        }
      }
    } else {
      const opPokemon = opTeam[opIdx];
      const opMove = opPokemon.moves[moveIdx];
      if (!checkIfHit(opMove)) {
        output = {
          text: `${opPokemon.name.toUpperCase()} used ${opMove.name.toUpperCase()}!`,
          effect: 'But it failed!',
        }
        return output;
      }
      // compute damage
      const damage = getDamage(opTeam[opIdx], myTeam[myIdx], opTeam[opIdx].moves[moveIdx]);
      myTeam[myIdx].curHealth = Math.round(Math.max(0, myTeam[myIdx].curHealth - damage));
      // compute effects
      if (opMove.effect) {
        const [A, B, effectMsg] = opMove.effect(opTeam[opIdx], myTeam[myIdx], damage);
        opTeam[opIdx] = A;
        myTeam[myIdx] = B;
        output = {
          text: `${opPokemon.name.toUpperCase()} used ${opMove.name.toUpperCase()}!`,
          effect: effectMsg,
        }
      } else {
        output = {
          text: `${opPokemon.name.toUpperCase()} used ${opMove.name.toUpperCase()}!`,
          effect: undefined,
        }
      }
      // compute health
      if (myTeam[myIdx].curHealth === 0) {
        myTeam[myIdx].isDead = true;
      }
      setMyTeam([...myTeam]);
      setOpTeam([...opTeam]);
      setActionSoundUrl(opMove.sound);
      // Play animation
      if (opMove.animate === 'set-black-box-pulse') {
        setShowBlackBoxAnimation(true);
      } else if (opMove.overlay) {
        const idx = animations.indexOf(opMove.overlay);
        if (opMove.animationTarget === 0) {
          setShowOpOverlayAnimation(idx);
        } else if (opMove.animationTarget === 1) {
          setShowMyOverlayAnimation(idx);
        }
      } else if (!opMove.overlay && opMove.animate) {
        if (opMove.animationTarget === 0) {
          setOpPokemonAnimation(opMove.animate);
        } else if (opMove.animationTarget === 1) {
          setMyPokemonAnimation(opMove.animate);
        }
      }
    }
    return output;
  }

  const getActionMenu = () => {
    return (
      <Box
        style={{
          position: "absolute", // Absolute positioning for the text box
          bottom: 180, // Adjusts the bottom distance from the white box border
          left: 300,
          width: '100%', // Ensures the box takes full width
        }}
      >
        <img 
          style={{ position: "absolute" }} 
          src={`${process.env.PUBLIC_URL}/text-box-50.png`} 
          width={300}
        />
        <Box
          sx={{ 
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 2 ,
          }}
          style={{ 
            position: "absolute",
            top: 40,
            left: selectedAction === 0 ? 60 : 106,
          }}
        >
          {selectedAction === 0 && <BlinkingSideArrow />}
          <Typography style={{ fontWeight: "light", fontSize: 24, lineHeight: 2.3}}> 
            FIGHT
          </Typography>
        </Box>
        <Box
          sx={{ 
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 2,
          }}
          style={{ 
            position: "absolute",
            top: 100,
            left: selectedAction === 1 ? 60 : 106,
          }}
        >
          {selectedAction === 1 && <BlinkingSideArrow />}
          <Typography style={{ fontWeight: "light", fontSize: 24, lineHeight: 2.3}}> 
            SWITCH
          </Typography>
        </Box>
      </Box>
    );
  }

  const getMoveMenu = () => {
    return (
      <Box
        style={{
          position: "absolute", // Absolute positioning for the text box
          bottom: 180, // Adjusts the bottom distance from the white box border
          left: 150,
          width: '100%', // Ensures the box takes full width
        }}
      >
        <img 
          style={{ position: "absolute" }} 
          src={`${process.env.PUBLIC_URL}/text-box-75.png`} 
          width={450}
        />
        <Box
          sx={{ 
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 2 ,
          }}
          style={{ 
            position: "absolute",
            top: 30,
            left: myMoveIdx === 0 ? 60 : 106,
          }}
        >
          {myMoveIdx === 0 && <BlinkingSideArrow />}
          <Typography style={{ fontWeight: "light", fontSize: 24}}> 
            {myPokemon.moves[0].name.toUpperCase()}
          </Typography>
        </Box>
        <Box
          sx={{ 
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 2,
          }}
          style={{ 
            position: "absolute",
            top: 60,
            left: myMoveIdx === 1 ? 60 : 106,
          }}
        >
          {myMoveIdx === 1 && <BlinkingSideArrow />}
          <Typography style={{ fontWeight: "light", fontSize: 24}}> 
            {myPokemon.moves[1].name.toUpperCase()}
          </Typography>
        </Box>
        <Box
          sx={{ 
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 2,
          }}
          style={{ 
            position: "absolute",
            top: 90,
            left: myMoveIdx === 2 ? 60 : 106,
          }}
        >
          {myMoveIdx === 2 && <BlinkingSideArrow />}
          <Typography style={{ fontWeight: "light", fontSize: 24}}> 
            {myPokemon.moves[2].name.toUpperCase()}
          </Typography>
        </Box>
        <Box
          sx={{ 
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 2,
          }}
          style={{ 
            position: "absolute",
            top: 120,
            left: myMoveIdx === 3 ? 60 : 106,
          }}
        >
          {myMoveIdx === 3 && <BlinkingSideArrow />}
          <Typography style={{ fontWeight: "light", fontSize: 24}}> 
            {myPokemon.moves[3].name.toUpperCase()}
          </Typography>
        </Box>
      </Box>
    );
  }

  const getTeamMenu = () => {
    return (
      <Box
        style={{
          position: "absolute", // Absolute positioning for the text box
          bottom: 180, // Adjusts the bottom distance from the white box border
          left: 150,
          width: '100%', // Ensures the box takes full width
        }}
      >
        <img 
          style={{ position: "absolute" }} 
          src={`${process.env.PUBLIC_URL}/text-box-75.png`} 
          width={450}
        />
        <Box
          sx={{ 
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 2 ,
          }}
          style={{ 
            position: "absolute",
            top: 20,
            left: selectedPokemon === 0 ? 60 : 106,
          }}
        >
          {selectedPokemon === 0 && <BlinkingSideArrow />}
          <Typography style={{ fontWeight: "light", fontSize: 24, lineHeight: 2.3, opacity: (myTeam[0].isDead || myPokemon.name == myTeam[0].name) ? 0.4 : 1 }}> 
            {myTeam[0].name.toUpperCase()}
          </Typography>
        </Box>
        <Box
          sx={{ 
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 2,
          }}
          style={{ 
            position: "absolute",
            top: 50,
            left: selectedPokemon === 1 ? 60 : 106,
          }}
        >
          {selectedPokemon === 1 && <BlinkingSideArrow />}
          <Typography style={{ fontWeight: "light", fontSize: 24, lineHeight: 2.3, opacity: (myTeam[1].isDead || myPokemon.name == myTeam[1].name) ? 0.4 : 1 }}> 
            {myTeam[1].name.toUpperCase()}
          </Typography>
        </Box>
        <Box
          sx={{ 
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 2,
          }}
          style={{ 
            position: "absolute",
            top: 80,
            left: selectedPokemon === 2 ? 60 : 106,
          }}
        >
          {selectedPokemon === 2 && <BlinkingSideArrow />}
          <Typography style={{ fontWeight: "light", fontSize: 24, lineHeight: 2.3, opacity: (myTeam[2].isDead || myPokemon.name == myTeam[2].name) ? 0.4 : 1 }}> 
            {myTeam[2].name.toUpperCase()}
          </Typography>
        </Box>
        <Box
          sx={{ 
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 2,
          }}
          style={{ 
            position: "absolute",
            top: 110,
            left: selectedPokemon === 3 ? 60 : 106,
          }}
        >
          {selectedPokemon === 3 && <BlinkingSideArrow />}
          <Typography style={{ fontWeight: "light", fontSize: 24, lineHeight: 2.3, opacity: (myTeam[3].isDead || myPokemon.name == myTeam[3].name) ? 0.4 : 1 }}> 
            {myTeam[3].name.toUpperCase()}
          </Typography>
        </Box>
      </Box>
    );
  }

  if (showWinOutro) {
    return <WinOutro onWin={() => onWin(getScore(), team)} />;
  }

  if (showLoseOutro) {
    return <LoseOutro />;
  }

  /**
   * Render components for the opponent's animations
   * @returns 
   */
  const getOpAnimationOverlays = () => {
    return animations.map((animation, index) => {
      return (index === showOpOverlayAnimation) && (
        <Box 
          style={{ 
            position: "absolute", top: 30, left: 360, height: '100%', zIndex: 1000,
            animation: 'overlayEffect 0.5s ease-in-out infinite',
          }}
          key={`animation-op-${animation}`}
        >
          <img src={animation} height={180} />
        </Box>
      )
    });
  }

  /**
   * Render components for the player's animations
   * @returns 
   */
  const getMyAnimationOverlays = () => {
    return animations.map((animation, index) => {
      return (index === showMyOverlayAnimation) && (
        <Box 
          style={{ 
            position: "absolute", top: 240, left: 40, height: '100%', zIndex: 1000,
            animation: 'overlayEffect 0.5s ease-in-out infinite',
          }}
          key={`animation-my-${animation}`}
        >
          <img src={animation} height={180} />
        </Box>
      )
    });
  }

  return (
    <Box 
      justifyContent="center"
      alignItems="center"
      style={{ 
        backgroundColor: "white",
        width: 600,
        height: 600,
        margin: "0 auto",
        borderRadius: 4,
        position: 'relative', // Add relative positioning
      }}
    >
      {showBlackBoxAnimation && (
        <Box
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "black",
            zIndex: 1000,
            animation: 'overlayEffect 0.5s ease-in-out infinite',
          }}
        />
      )}
      {getOpAnimationOverlays()}
      {getMyAnimationOverlays()}
      {actionSoundUrl && <audio autoPlay src={actionSoundUrl} />}
      {showOpChar ? (
        <Box
          style={{
            position: "absolute", // Absolute positioning for the text box
            top: 40, // Adjusts the bottom distance from the white box border
            left: 440,
            height: '100%', // Ensures the box takes full width
          }}
        >
          <img 
            src={`${process.env.PUBLIC_URL}/professor.png`} 
            height={180} 
          />
        </Box>
      ) : (
        <Box
          style={{
            position: "absolute", // Absolute positioning for the text box
            top: 40, // Adjusts the bottom distance from the white box border
            left: 360,
            height: '100%', // Ensures the box takes full width
          }}
        >
          <img 
            key={opPokemonImageKey}
            src={opPokemon.frontImage} 
            height={180} 
            style={{
              opacity: opPokemonOpacity,
              animation: opPokemonAnimation,
            }}
            onAnimationEnd={() => {
              setOpPokemonOpacity(1);
              setOpPokemonAnimation(undefined);
            }}
          />
        </Box>
      )}
      <Box
        style={{
          position: "absolute", // Absolute positioning for the text box
          top: 40,
          left: 40,
        }}
      >
        {showOpChar ? (
          <Pokeballs 
            isActive={opTeam.map(x => !x.isDead)}
            isOpponent={true}
            numTotal={6}
          />
        ) : (
          <Healthbar
            name={opPokemon.name}
            level={opPokemon.level}
            curHealth={opPokemon.curHealth}
            maxHealth={opPokemon.maxHealth}
            isOpponent={true}
          />
        )}
      </Box>
      {showMyChar ? (
        <Box
          style={{
            position: "absolute", // Absolute positioning for the text box
            bottom: 180, // Adjusts the bottom distance from the white box border
            left: 40,
            width: '100%', // Ensures the box takes full width
          }}
        >
          <img src={`${process.env.PUBLIC_URL}/ash.png`} height={200} />
        </Box>
      ): (
        <Box
          style={{
            position: "absolute", // Absolute positioning for the text box
            bottom: 180, // Adjusts the bottom distance from the white box border
            left: 40,
            width: '100%', // Ensures the box takes full width
          }}
        >
          <img 
            key={myPokemonImageKey}
            src={myPokemon.backImage} 
            height={200} 
            style={{
              opacity: myPokemonOpacity,
              animation: myPokemonAnimation,
            }}
            onAnimationEnd={() => {
              setMyPokemonOpacity(1);
              setMyPokemonAnimation(undefined);
            }}
          />
        </Box>
      )}
      <Box
        style={{
          position: "absolute", // Absolute positioning for the text box
          bottom: 210, // Adjusts the bottom distance from the white box border
          left: 300,
        }}
      >
        {showMyChar ? (
          <Pokeballs 
            isActive={myTeam.map(x => !x.isDead)}
            isOpponent={false}
            numTotal={6}
          />
        ) : (
          <Healthbar
            name={myPokemon.name}
            level={myPokemon.level}
            curHealth={myPokemon.curHealth}
            maxHealth={myPokemon.maxHealth}
            isOpponent={false}
          />
        )}
      </Box>
      <Box
        style={{
          position: "absolute", // Absolute positioning for the text box
          bottom: 180, // Adjusts the bottom distance from the white box border
          left: 0,
          width: '100%', // Ensures the box takes full width
        }}
      >
        <img 
          style={{ position: "absolute" }} 
          src={`${process.env.PUBLIC_URL}/text-box.png`} 
          width={600} 
        />
        <Box
          sx={{ px: 7, pt: 5 }}
          style={{ position: "absolute" }}
        >
          {curText && (
            <Typography style={{ fontWeight: "light", fontSize: 24, lineHeight: 2.3 }}> 
              <SlowText text={curText} speed={50} />
            </Typography>
          )}
        </Box>
        <Box
          style={{ 
            position: "absolute",
            right: 40,
            top: 120,
          }} 
        >
          <BlinkingArrow />
        </Box>
      </Box>
      {showActionMenu && getActionMenu()}
      {showMoveMenu && getMoveMenu()}
      {showTeamMenu && getTeamMenu()}
    </Box>
  );
}

export default Battle;
