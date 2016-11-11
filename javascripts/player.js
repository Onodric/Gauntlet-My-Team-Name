"use strict";

let Classes = require('./classes.js');
let Species = require('./species.js');
let Weapons = require('./weapons.js');
let Spells = require('./spells.js');

const Names = ["Jimmy", "Thoror", "Hlundig", "Breuskie", "Ned Nederlander", "Lucky Day", "Dusty Bottoms", "John Pinkston", "Mr. Holmes"];
 
let Gauntlet = {};
// Gauntlet.Combatants = {};

Gauntlet.Player = function(name) {
  this.species = null;
  this.class = null;
  this.weapon = "bare hands";

  this.playerName = name || "Unknown Adventurer";
  this.health = Math.floor(Math.random() * 40 + 50);
  this.limbs = ["head", "neck", "arm", "leg", "torso"];
  this.skinColor = "gray";
  this.skinColors = [this.skinColor];
  this.strength = 90;
  this.intelligence = 90;
  this.critChance = 0.05;
  this.critDamage = 20;

  this.toString = function() {
    let output = [this.playerName,
      ": a ",
      this.skinColor,
      " skinned ",
      this.species,
      " ",
      this.class,
      " with ",
      this.health,
      " health. ",
      (this.class.magical) ? "Able to cast " : " Wielding a ",
      this.weapon.toString(),
      "!"
    ].join("");
    return output;
  };
};

Gauntlet.Player.prototype.setName = function(newName) {
  // from App.js
  this.playerName = newName;
};

Gauntlet.Player.prototype.setSpecies = (newSpecies) => {
  this.species = Species[newSpecies];
};

Gauntlet.Player.prototype.setClass = (newClass) => {
  // gets a class from classes.js
  console.log("Documentation: ", value);
  this.class = Classes[newClass];
  console.log("this: ", this);
  this.health += this.class.healthBonus;
  this.strength += this.class.strengthBonus;
  this.intelligence += this.class.intelligenceBonus; 
  this.critChance = this.class.critChance;
  this.critDamage = this.class.critDamage;
};

Gauntlet.Player.prototype.setWeapon = function(newWeapon) {
  // this gets "Sphere" or weapon.name !!!FROM app.js!!!
  if (this.magical){
   this.weapon = Spells.Sphere; 
  } else {
   this.weapon = Weapons[newWeapon]; 
  }
  // this.magical ? this.weapon = Spells.Sphere : this.weapon = Weapons[newWeapon];
};

// RANDOMIZER

Gauntlet.Player.prototype.generateClass = function() {
  // Get a random index from the allowed classes array
  let classes = Object.keys(Classes);
  let randClsIndex = Math.floor(Math.random() * (classes.length));
  return classes[randClsIndex];
};

Gauntlet.Player.prototype.generateWeapon = function() {
  let weapons = Object.keys(Weapons);
  let randWepIndex = Math.floor(Math.random() * (weapons.length));
  return weapons[randWepIndex];
};

Gauntlet.Player.prototype.generateName = function() {
  let randNameIndex = Math.floor(Math.random() * (Names.length));
  return Names[randNameIndex];
};

Gauntlet.Player.prototype.generateSpecies = function() {
  let species = Object.keys(Species);
  let randSpcIndex = Math.floor(Math.random() * (species.length));
  return species[randSpcIndex];
};

console.log("Gauntlet: ", Gauntlet);
var genericPc = new Gauntlet.Player("Bobo");
genericPc.setSpecies("Human");
genericPc.setClass("Warrior");
genericPc.setWeapon("WarAxe");
console.log("genericPc: ", genericPc);

module.exports = Gauntlet;