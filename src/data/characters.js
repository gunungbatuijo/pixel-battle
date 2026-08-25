export const CHARACTERS = [
  {
    id: "ryo",
    name: "Ryo Kazen",
    title: "Street Martial Artist",
    style: "Balanced",
    build: "normal",
    feature: "headband",
    koStyle: "warrior",
    description: "A disciplined street fighter with fast punches and sharp counter attacks. Well-rounded and reliable.",
    palette: {
      skin: "#e8b890",
      skinShade: "#c89070",
      hair: "#1a1a1a",
      shirt: "#c8442a",
      shirtShade: "#8a2a18",
      pants: "#2a3a5a",
      pantsShade: "#1a2a44",
      accent: "#f0d050",
      boots: "#3a2a1a"
    },
    stats: { hp: 100, speed: 3.4, power: 11, skillPower: 16, range: 46 },
    moves: {
      skill1: { name: "Kazen Wave", kind: "projectile", dmg: 12, speed: 6.2, color: "#f0a040", size: 11, kb: 6, cd: 90 },
      skill2: { name: "Rising Fist", kind: "launcher", dmg: 16, kb: 6, up: 9, reach: 12, cd: 140 },
      skill3: { name: "Reppu Rush", kind: "dashstrike", dmg: 20, kb: 9, dist: 64, cd: 200 }
    }
  },
  {
    id: "brutus",
    name: "Brutus Kane",
    title: "Heavy Brawler",
    style: "Grappler",
    build: "heavy",
    feature: "beard",
    koStyle: "behemoth",
    description: "A slow but devastating brawler. Armored attacks and brutal grapples crush anyone who gets too close.",
    palette: {
      skin: "#d8a878",
      skinShade: "#a87850",
      hair: "#2a1a0a",
      shirt: "#4a4a4a",
      shirtShade: "#2a2a2a",
      pants: "#5a3a1a",
      pantsShade: "#3a2410",
      accent: "#a8442a",
      boots: "#2a1a0a"
    },
    stats: { hp: 130, speed: 2.3, power: 17, skillPower: 24, range: 50 },
    moves: {
      skill1: { name: "Iron Grip", kind: "grab", dmg: 15, kb: 11, reach: 6, cd: 90 },
      skill2: { name: "Quake Slam", kind: "aoe", dmg: 18, radius: 78, kb: 7, cd: 140 },
      skill3: { name: "Bull Charge", kind: "dashstrike", dmg: 22, kb: 12, dist: 72, cd: 200 }
    }
  },
  {
    id: "ayumi",
    name: "Ayumi Rei",
    title: "Agile Ninja",
    style: "Speed",
    build: "slim",
    feature: "mask",
    koStyle: "shadow",
    description: "A lightning-fast ninja with air mobility and smoke tricks. Low damage but relentless combos.",
    palette: {
      skin: "#e0c0a0",
      skinShade: "#b89070",
      hair: "#0a0a0a",
      shirt: "#3a2a4a",
      shirtShade: "#241830",
      pants: "#2a1a3a",
      pantsShade: "#180a24",
      accent: "#c060c0",
      boots: "#1a0a1a"
    },
    stats: { hp: 85, speed: 4.2, power: 8, skillPower: 13, range: 42 },
    moves: {
      skill1: { name: "Shuriken", kind: "projectile", dmg: 8, speed: 9, color: "#c060c0", size: 6, kb: 4, cd: 70 },
      skill2: { name: "Shadow Dash", kind: "dashstrike", dmg: 12, kb: 5, dist: 84, cd: 110 },
      skill3: { name: "Cyclone", kind: "aoe", dmg: 14, radius: 62, kb: 6, cd: 160 }
    }
  },
  {
    id: "axel",
    name: "Axel Volt",
    title: "Former Military",
    style: "Tactical",
    build: "normal",
    feature: "cap",
    koStyle: "soldier",
    description: "A tactical ex-soldier with knife combos and dash strikes. Precise, mobile, and punishing.",
    palette: {
      skin: "#d8a880",
      skinShade: "#a8805a",
      hair: "#4a3a2a",
      shirt: "#5a6a3a",
      shirtShade: "#3a4a24",
      pants: "#3a4a2a",
      pantsShade: "#243018",
      accent: "#c8c830",
      boots: "#2a2a1a"
    },
    stats: { hp: 105, speed: 3.6, power: 12, skillPower: 18, range: 48 },
    moves: {
      skill1: { name: "Knife Throw", kind: "projectile", dmg: 10, speed: 8, color: "#c8c830", size: 5, kb: 4, cd: 80 },
      skill2: { name: "Lunge Slash", kind: "dashstrike", dmg: 15, kb: 7, dist: 66, cd: 130 },
      skill3: { name: "Frag Lob", kind: "projectile", dmg: 20, speed: 5, vy: -7, arc: true, color: "#8a4a2a", size: 9, aoe: 55, kb: 8, cd: 200 }
    }
  },
  {
    id: "hiro",
    name: "Hiroshi Tanaka",
    title: "Wandering Samurai",
    style: "Balanced",
    build: "normal",
    feature: "topknot",
    koStyle: "warrior",
    description: "A ronin who cuts down foes with iaijutsu draws and rising blade strikes.",
    palette: {
      skin: "#e0b888",
      skinShade: "#b08458",
      hair: "#0a0a0a",
      shirt: "#1a2a4a",
      shirtShade: "#0a1a2a",
      pants: "#2a1a1a",
      pantsShade: "#180a0a",
      accent: "#c83030",
      boots: "#1a0a0a"
    },
    stats: { hp: 100, speed: 3.3, power: 12, skillPower: 18, range: 50 },
    moves: {
      skill1: { name: "Iai Slash", kind: "dashstrike", dmg: 13, kb: 6, dist: 64, cd: 90 },
      skill2: { name: "Rising Blade", kind: "launcher", dmg: 16, kb: 6, up: 10, reach: 12, cd: 140 },
      skill3: { name: "Gale Cutter", kind: "aoe", dmg: 19, radius: 62, kb: 8, cd: 190 }
    }
  },
  {
    id: "rex",
    name: "Rex Bolder",
    title: "Prize Fighter",
    style: "Tactical",
    build: "normal",
    feature: "beard",
    koStyle: "warrior",
    description: "A washed-up heavyweight boxer with devastating hooks and a weaving dash.",
    palette: {
      skin: "#d8a880",
      skinShade: "#a87850",
      hair: "#2a1a0a",
      shirt: "#c82828",
      shirtShade: "#8a1818",
      pants: "#1a1a1a",
      pantsShade: "#0a0a0a",
      accent: "#f0e0c0",
      boots: "#1a1a1a"
    },
    stats: { hp: 108, speed: 3.4, power: 14, skillPower: 18, range: 47 },
    moves: {
      skill1: { name: "Jab Rush", kind: "dashstrike", dmg: 12, kb: 5, dist: 58, cd: 85 },
      skill2: { name: "Liver Hook", kind: "launcher", dmg: 16, kb: 6, up: 9, reach: 12, cd: 135 },
      skill3: { name: "Haymaker", kind: "aoe", dmg: 19, radius: 60, kb: 8, cd: 185 }
    }
  },
  {
    id: "jin",
    name: "Jin Park",
    title: "Taekwondo Master",
    style: "Speed",
    build: "slim",
    feature: "headband",
    koStyle: "shadow",
    description: "A spinning-kick specialist with long range and aerial dominance.",
    palette: {
      skin: "#e0b888",
      skinShade: "#b08458",
      hair: "#1a1a1a",
      shirt: "#f0f0e8",
      shirtShade: "#c8c8b8",
      pants: "#1a1a1a",
      pantsShade: "#0a0a0a",
      accent: "#c83030",
      boots: "#1a1a1a"
    },
    stats: { hp: 92, speed: 4.0, power: 10, skillPower: 16, range: 49 },
    moves: {
      skill1: { name: "Side Kick", kind: "dashstrike", dmg: 12, kb: 6, dist: 70, cd: 80 },
      skill2: { name: "Spinning Heel", kind: "launcher", dmg: 15, kb: 6, up: 11, reach: 14, cd: 130 },
      skill3: { name: "Tornado Kick", kind: "aoe", dmg: 17, radius: 64, kb: 7, cd: 170 }
    }
  }
];

export const getCharacter = (id) => CHARACTERS.find((c) => c.id === id) || CHARACTERS[0];
