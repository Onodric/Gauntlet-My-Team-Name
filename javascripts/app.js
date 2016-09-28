"use strict";

/*
  Use promises to load, in the correct order, the JSON files
  needed to establish all the prototype chains needed.
 */
Gauntlet.WeaponRack.load()
  .then(Gauntlet.Spellbook.load)
  .then(Gauntlet.Horde.load)
  .then(Gauntlet.GuildHall.load)
  .then(() => {

  /*
    Test code to generate a human player and a random enemy
   */
  console.group("Sample Combatants");
  console.log("Creating a new Human instance");
  let warrior = Gauntlet.Army.Human.init("Joe").equip();
  console.log(warrior.toString());
  console.log(" ");
  console.log("Creating a new Enemy instance");
  let enemy = Gauntlet.Horde.random();
  enemy.equip();
  console.log(enemy.toString());
  console.groupEnd("Sample Combatants");

  /*
    To have a sample battle run in the console, without needing
    to select anything in the DOM application, just add console=true
    to the URL.

    Example:
      http://localhost:8080/?console=true

   */
  if (__.getURLParameter("console") === "true") {
    let battleground = new Battleground(warrior, enemy, true);
    let battleTimer = window.setInterval(() => {
      if (!battleground.melee()) {
        window.clearInterval(battleTimer);
      }
    }, 2000);
  }
});

$(document).ready(function() {

  /*
    Show the initial view that accepts player name
   */
  let HumanCombatant = null;
  let EnemyCombatant = null;
  let chosenProfession = null;
  let chosenWeapon = null;
  let battleground = null;

  $("#player-setup").show();

  /*
    When any button with card__link class is clicked,
    move on to the next view.
   */
  $(".card__link").click(function(e) {
    let currentCard = $(this).attr("current");
    let nextCard = $(this).attr("next");
    let moveAlong = false;

    switch (currentCard) {
      case "card--name":
        moveAlong = $("#player-name").val() !== "";
        break;
      case "card--class":
        moveAlong = chosenProfession !== null;
        break;
      case "card--weapon":
        console.log("chosenWeapon",chosenWeapon);
        moveAlong = chosenWeapon !== null;
        break;
    };

    if (moveAlong) {
      /*
        If all requirements met to move along to the next screen, set
        that screen up now if there is any dynamic elements that need
        to be created before it is shown.
       */
      switch (nextCard) {
        case "card--class":
          break;

        case "card--weapon":
          if (chosenProfession.magical) {
            HumanCombatant.equip(chosenProfession);
            nextCard = "card--battleground";
            startCombat();
          } else {
            let weaponEl = $("#weapon-select").children(".card__prompt");
            $(".weapons").remove();

            let block = ['<div class="row weapons">',
                         '<div class="col-sm-6">'];

            chosenProfession.allowedWeapons.each((weapon, index) => {
              let weaponName = Gauntlet.WeaponRack
                                       .weapons()
                                       .find(w => w.id === weapon)
                                       .toString();

              // Close individual rows and start new ones
              if (index === 3) {
                block.push('</div>', '<div class="col-sm-6">');
              }

              // Add weapon block to DOM
              block.push('<div class="card__button">',
                         '<a class="weapon__link btn btn--big btn--blue" href="#">',
                         '<span class="btn__prompt">&gt;</span>',
                         `<span class="btn__text weapon__name" weapon='${weapon}'>${weaponName}</span>`,
                         '</a></div>');
            });
            block.push("</div></div>");
            weaponEl.append(block.join(""));
          }
          break;

        case "card--battleground":
          HumanCombatant.equip(chosenProfession, chosenWeapon);
          startCombat();

          break;
      }

      /*
        Now that any initialization is done, hide all cards and show next one
       */
      $(".card").hide();
      $("." + nextCard).show();
    }
  });

  let continueBattle = true;
  let battleTimer;

  function meleeRound() {
    if (!battleground.melee()) {
      window.clearInterval(battleTimer);

      if (HumanCombatant.health > 0) {
        $("#battle-record").after("<button class=\"btn btn--big btn--yellow btn--another\">Fight another</button>");
      } else {
        $("#battle-record").after("<button class=\"btn btn--big btn--yellow btn--again\">Play Again</button>");
      }
    }

    $(".battle--human").html(HumanCombatant.toString());
    $(".battle--enemy").html(EnemyCombatant.toString());

    $("#battle-record").scrollTop(9999999);
  }

  function startCombat() {
    EnemyCombatant = Gauntlet.Horde.random();
    // EnemyCombatant = Gauntlet.Horde.soldier("Dragon");
    EnemyCombatant.equip();

    $(".battle--human").html(HumanCombatant.toString());
    $(".battle--enemy").html(EnemyCombatant.toString());

    battleground = new Battleground(HumanCombatant, EnemyCombatant);
    battleTimer = window.setInterval(meleeRound, 2000);
  }

  /*
    When the "Fight Another" button is clicked just start
    the battle all over again with the player's existing
    health, and a new opponent.
   */
  $(document).on("click", ".btn--another", function() {
    $(".btn--another").remove();
    startCombat();
  });

  /*
    When the "Fight Again" button is clicked just start
    the battle all over again with the player's existing
    health, and a new opponent.
   */
  $(document).on("click", ".btn--again", function() {
    $(".btn--again").remove();
    $(".card").hide();
    $("#player-setup").show();
    $("#battle-record").empty();
  });

  /*
    Handle user choosing a profession for the human combatant
   */
  $(".class__link").click(function(e) {
    HumanCombatant = Gauntlet.Army.Human.init($("#player-name").val());
    chosenProfession = Gauntlet.GuildHall.classes().get($(this).children(".btn__text").html());
  });


  /*
    Handle user choosing a weapon for the human combatant
   */
  $(document).on("click", ".weapon__link", function(e) {
    let weapon = $(this).find(".btn__text").attr("weapon");
    chosenWeapon = Gauntlet.WeaponRack
                             .weapons()
                             .find(w => w.id === weapon);
  });


  /*
    When the back button clicked, move back a view
   */
  $(".card__back").click(function(e) {
    let previousCard = $(this).attr("previous");
    $(".card").hide();
    $(`.${previousCard}`).show();
  });


});
