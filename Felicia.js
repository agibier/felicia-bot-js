/*
  A ping pong bot, whenever you send "ping", it replies "pong".
*/

// import the discord.js module
const Discord = require('discord.js');
const fs = require("fs");

// create an instance of a Discord Client, and call it bot
const bot = new Discord.Client();

// the token of your bot - https://discordapp.com/developers/applications/me
const token = 'MjMwNzQ5MjkxNjYzMTk2MTYx.Cs5cfw.YYsf2K1PMeULnqaRvPYaoTxgPbw';

// the ready event is vital, it means that your bot will only start reacting to information
// from Discord _after_ ready is emitted.
bot.on('ready', () => {
    console.log('I am ready!');
});

// create an event listener for messages
bot.on('message', message => {

   if (message.content === 'ping' && message.author != bot.user)
   {
	   if(typeof message.channel === "TextChannel")
	   {
	       message.channel.sendMessage('pong');
	   }
	   else
	   {
	       message.channel.sendMessage('Private pong')
	   }    
  }

  if (message.content === 'pong' && message.author != bot.user)
  {
      // send "pong" to the same channel.
      if (typeof message.channel === "TextChannel") {
          message.channel.sendMessage('ping');
      }
      else {
          message.channel.sendMessage('Private ping')
      }
  }

  if (message.isMentioned(bot.user) &&
      ( message.content.indexOf("bonjour") > -1
      ||message.content.indexOf("salut") > -1
      ||message.content.indexOf("Bonjour") > -1
      ||message.content.indexOf("Salut") > -1
      ))
  {
      var selected = greetings[randomInt(0, greetings.length)];
      message.channel.sendMessage(selected+message.author);  
  }

  if (message.isMentioned(bot.user) &&
      (message.content.indexOf("merci") > -1
      || message.content.indexOf("Merci") > -1
      )) {
      var selected = urwelcome[randomInt(0, urwelcome.length)];
      message.channel.sendMessage(selected);
  }

  if (message.content.indexOf("(╯°□°）╯︵ ┻━┻") > -1)
  {
      var selected = unflip[randomInt(0, unflip.length)];
      message.channel.sendMessage('┬─┬﻿ ノ( ゜-゜ノ) ');
      message.channel.sendMessage(selected);
  }

  if ( message.content.indexOf("Tentacules") > -1
     || message.content.indexOf("tentacules") > -1
      || message.content.indexOf("Tentacule") > -1
      || message.content.indexOf("tentacule") > -1) {
      message.channel.sendMessage('Yamete!');
  }

  if (message.isMentioned(bot.user) &&
      ( message.content.indexOf("a quoi on joue") > -1
      ||message.content.indexOf("à quoi on joue") > -1
      ||message.content.indexOf("trouve nous un jeu") > -1 )
      )
  {
      //message.channel.sendMessage('Je ne suis pas encore bien formée à la connaissance des jeux, mais je saurais vous aider sous peu');
      var selectedGame = gameList[randomInt(0, gameList.length)];
      var proposal = gameproposal[randomInt(0, gameproposal.length)];
      message.channel.sendMessage(proposal + selectedGame);
  }

  if (message.content === '!toss')
  {
      if (randomIntInc(1, 2) === 1)
          message.channel.sendMessage('pile');
      else
          message.channel.sendMessage('face');
  }

  if (message.content === '!1d4') {
      message.channel.sendMessage('Le résultat est : ' + randomIntInc(1, 4));
  }

  if (message.content === '!1d6' ||
      (message.isMentioned(bot.user) &&
      (message.content.indexOf("lance un dé") > -1
      )))
  {
      if (message.isMentioned(bot.user))
      {
          message.channel.sendMessage('Et voici le dé du destin...')
      }
      message.channel.sendMessage('Le résultat est : ' + randomIntInc(1, 6));
  }

  if (message.content === '!1d10')
  {
      message.channel.sendMessage('Le résultat est : ' + randomIntInc(1, 10));
  }

  if (message.content === '!1d20')
  {
      message.channel.sendMessage('Le résultat est : ' + randomIntInc(1, 20));
  }

  if(message.content === '!1d100')
  {
      message.channel.sendMessage("Le résultat est : " + randomIntInc(1, 100));
  }

  if (message.content === '!1d100')
  {
      message.channel.sendMessage("Le résultat est : " + randomIntInc(1, 100));
  }
});

// log our bot in
bot.login(token);

var contents = fs.readFileSync("data.json");
var jsonContent = JSON.parse(contents);
var gameList = jsonContent.games;
var unflip = jsonContent.cleanUpResponse;
var greetings = jsonContent.Greetings;
var urwelcome = jsonContent.UrWelcome;
var gameproposal = jsonContent.gameProposal;

function randomIntInc(low, high) {
    return Math.floor(Math.random() * (high - low + 1) + low);
}

function randomInt (low, high) {
    return Math.floor(Math.random() * (high - low) + low);
}