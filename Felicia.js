﻿/*
  A ping pong bot, whenever you send "ping", it replies "pong".
*/

// import the discord.js module
const Discord = require('discord.js');
const fs = require("fs");
const redisClient = require('redis').createClient();

// create an instance of a Discord Client, and call it bot
const bot = new Discord.Client();

// the token of your bot - https://discordapp.com/developers/applications/me
const token = 'MjMwNzQ5MjkxNjYzMTk2MTYx.Cs5cfw.YYsf2K1PMeULnqaRvPYaoTxgPbw';


var superUser;
var jsonGames;
var gameList;

// the ready event is vital, it means that your bot will only start reacting to information
// from Discord _after_ ready is emitted.
bot.on('ready', () => {
    console.log('I am ready!');

    //Try to find super user and set it
    if(jsonGames && jsonGames.SuperUser)
    {
        superUser = jsonGames.SuperUser
    }
});

redisClient.on("error", function (err) {
    console.log(err);
});

redisClient.on('connect', function (err) {
    if (err == null)
    {
        console.log('connected to redis');
    }
    else
    {
        console.log('Could not connect to redis');
        console.log('Using local file');

        fs.stat('gamelist.json', function (err, stat) {
            if (err == null) {
                console.log('game list file found');
                jsonGames = JSON.parse(fs.readFileSync("gamelist.json"));
                gameList = jsonGames.games;

            } else if (err.code == 'ENOENT') {
                console.log('game list file not found, create it');
                // file does not exist
                jsonGames = {};
                jsonGames.games = new Array();
                SaveGames();
                gameList = jsonGames.games;
            } else {
                console.log('Some other error: ', err.code);
            }
        });
    }
});

var debug = false;

var contents = fs.readFileSync("data.json");
var jsonContent = JSON.parse(contents);
var unflip = jsonContent.cleanUpResponse;
var greetings = jsonContent.Greetings;
var urwelcome = jsonContent.UrWelcome;
var gameproposal = jsonContent.gameProposal;
var goodbye = jsonContent.Goodbye;
var EightBall = jsonContent.EightBall;
var OWHeroes = jsonContent.OverwatchHeroes;

// create an event listener for messages
bot.on('message', message =>
{
    if (message.author != bot.user)
    {
        if (message.channel.type === "text" || debug) {
            HandleServersMessages(message)
        }
        if (message.channel.type === "dm" || debug) {
            HandleDirectMessages(message);
        }
        if (superUser && message.author.id == superUser)
        {
            HandleSuperUserCommands(message);
        }
        HandleAllMessages(message);
    }    
});

// log our bot in
bot.login(token);

function randomIntInc(low, high) {
    return Math.floor(Math.random() * (high - low + 1) + low);
}

function randomInt(low, high) {
    return Math.floor(Math.random() * (high - low) + low);
}

function HandleServersMessages(message)
{
    if (message.content === 'ping' && message.author != bot.user) {
        message.channel.sendMessage('pong');
    }

    if (message.content === 'pong' && message.author != bot.user) {
        message.channel.sendMessage('ping');
    }

    if ((message.isMentioned(bot.user) &&
        (message.content.indexOf("bonjour") > -1
        || message.content.indexOf("salut") > -1
        || message.content.indexOf("Bonjour") > -1
        || message.content.indexOf("Salut") > -1
        ))
        || message.content === "!hi"
        ) {
        var selected = greetings[randomInt(0, greetings.length)];
        message.channel.sendMessage(selected + message.author);
    }

    if ((message.isMentioned(bot.user) &&
        (message.content.indexOf("au revoir") > -1
        || message.content.indexOf("bye") > -1
        || message.content.indexOf("Au revoir") > -1
        || message.content.indexOf("Bye") > -1
        || message.content.indexOf("A plus") > -1
        || message.content.indexOf("a plus") > -1
        || message.content.indexOf("à plus") > -1
        ))
        || message.content === "!bye"
        ) {
        var selected = goodbye[randomInt(0, goodbye.length)];
        message.channel.sendMessage(selected + message.author);
    }

    if (message.isMentioned(bot.user) &&
        (message.content.indexOf("merci") > -1
        || message.content.indexOf("Merci") > -1
        )) {
        var selected = urwelcome[randomInt(0, urwelcome.length)];
        message.channel.sendMessage(selected);
    }

    if (message.content == "sousse"
        || message.content == "Sousse")
    {
        message.channel.sendMessage("Bonsoir.");
    }

    if (message.content.indexOf("(╯°□°）╯︵ ┻━┻") > -1) {
        var selected = unflip[randomInt(0, unflip.length)];
        message.channel.sendMessage('┬─┬﻿ ノ( ゜-゜ノ) ');
        message.channel.sendMessage(selected);
    }

    if (message.content.indexOf("Tentacules") > -1
       || message.content.indexOf("tentacules") > -1
        || message.content.indexOf("Tentacule") > -1
        || message.content.indexOf("tentacule") > -1) {
        message.channel.sendMessage('Yamete!');
    }

    if ((message.isMentioned(bot.user) &&
        (message.content.indexOf("a quoi on joue") > -1
        || message.content.indexOf("à quoi on joue") > -1
        || message.content.indexOf("trouve nous un jeu") > -1
        || message.content.indexOf("A quoi on joue") > -1
        || message.content.indexOf("Trouve nous un jeu") > -1
        || message.content.indexOf("un autre") > -1
        ))
        || message.content === "!pickgame"
        ) {
        var selectedGame = gameList[randomInt(0, gameList.length)];
        var proposal = gameproposal[randomInt(0, gameproposal.length)];
        message.channel.sendMessage(proposal + selectedGame);
    }

    if ((message.isMentioned(bot.user) &&
        (message.content.indexOf("qui est le meilleur") > -1
        ))
        ) {
        var member = message.channel.guild.members.random();
        //var member = members[randomInt(0, members.length)];

        if (member.user === bot.user)
        {
            message.channel.sendMessage("La meilleure c'est incontestablement moi :kissing_closed_eyes:");
        }
        else {
            message.channel.sendMessage(member.user.username);
        }        
    }

    if (message.content.startsWith("!8ball") && message.content.endsWith("?"))
    {
        message.edit(message.content.replace("!8ball", ":8ball:"));
        var selected = EightBall[randomInt(0, EightBall.length)];
        message.channel.sendMessage(selected);
    }

    if ((message.isMentioned(bot.user) &&
        (
            (message.content.indexOf("overwatch") > -1
            || message.content.indexOf("Overwatch") > -1)
        &&
            (message.content.indexOf("héros") > -1)
        ))
        || message.content.startsWith("!OWHero")
        || (message.content === "Le monde a besoin de héros."
        || message.content === "le monde a besoin de héros."
        || message.content === "Le monde a besoin de héros"
        || message.content === "le monde a besoin de héros"
        || message.content === "Le monde a besoin de héros !"
        || message.content === "le monde a besoin de héros !")
        ) {

        var HeroSelection = OWHeroes;
        //if (message.content.indexOf("DPS") > -1 || message.content.indexOf("attaque") > -1 || message.content.indexOf("attaque") > -1 || message.content.indexOf("attaquant") > -1 || message.content.indexOf("offensif") > -1 || message.content.indexOf("offense") > -1)
        //{
        //    HeroSelection = OWHeroes.filter(function (x) { x.type === "Offense" });
        //}
        //else if (message.content.indexOf("défense") > -1 || message.content.indexOf("défensif") > -1)
        //{
        //    HeroSelection = OWHeroes.filter(function (x) { x.type === "Defense" });
        //}
        //else if (message.content.indexOf("tank") > -1 || message.content.indexOf("solide") > -1)
        //{
        //    HeroSelection = OWHeroes.filter(function (x) { x.type === "Tank" });
        //}
        //else if (message.content.indexOf("support") > -1 || message.content.indexOf("soutien") > -1)
        //{
        //    HeroSelection = OWHeroes.filter(function (x) { x.type === "Support" });
        //}

        var selected = HeroSelection[randomInt(0, HeroSelection.length)];
        message.channel.sendMessage("Un héros ? Voilà " + selected.Name + " qui arrive !");
    }

    if (message.content === '!toss') {
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
        ))) {
        if (message.isMentioned(bot.user)) {
            message.channel.sendMessage('Et voici le dé du destin...')
        }
        message.channel.sendMessage('Le résultat est : ' + randomIntInc(1, 6));
    }

    if (message.content === '!1d8') {
        message.channel.sendMessage('Le résultat est : ' + randomIntInc(1, 8));
    }

    if (message.content === '!1d10') {
        message.channel.sendMessage('Le résultat est : ' + randomIntInc(1, 10));
    }

    if (message.content === '!1d20') {
        message.channel.sendMessage('Le résultat est : ' + randomIntInc(1, 20));
    }

    if (message.content === '!1d100') {
        message.channel.sendMessage("Le résultat est : " + randomIntInc(1, 100));
    }
}

function HandleDirectMessages(message)
{
    if (message.content === 'ping') {
        message.channel.sendMessage('pong rien que pour vous');
    }

    if (message.content === 'pong') {
        message.channel.sendMessage('ping rien que pour vous');
    }

    if (message.content == "ClaimUser")
    {
        jsonGames.SuperUser = message.author.id;
        SaveGames();
        superUser = jsonGames.SuperUser;
    }

    if(message.content.startsWith("!addgame"))
    {
        console.log("Ouais ouais on ajoute un jeu");
        parameters = message.content.replace("!addgame", "").split(',');
        for (var i = 0, len = parameters.length; i < len; i++)
        {
            parameters[i] = parameters[i].trim();
            gameList.push(parameters[i]);
        }
        console.log("added games : " + parameters);
        console.log("game list : " + gameList);
        SaveGames();
        message.channel.sendMessage("J'ai donc ajouté les jeux suivant à votre ludothèque : "+parameters);
    }

    if (message.content.startsWith("!removegame")) {
        console.log("Ouais ouais on retire des jeux");
        parameters = message.content.replace("!removegame", "").split(',');
        var removedGames = new Array();
        var notFoundGames = new Array();
        for (var i = 0, len = parameters.length; i < len; i++) {
            parameters[i] = parameters[i].trim();
            var index = gameList.indexOf(parameters[i])
            if (index > -1)
            {
                gameList.splice(index, 1);
                removedGames.push(parameters[i]);
            }
            else
            {
                notFoundGames.push(parameters[i]);
            }
        }
        console.log("removed games : " + removedGames);
        console.log("games not found : " + notFoundGames);
        console.log("game list : " + gameList);
        SaveGames();
        if(removedGames.length > 0)
        {
            message.channel.sendMessage("J'ai retiré les jeux suivant de votre ludothèque : " + removedGames);
        }
        if(notFoundGames.length > 0)
        {
            message.channel.sendMessage("Je n'ai pas trouvé les jeux suivant dans votre ludothèque : " + notFoundGames);
        }
    }
}

function HandleAllMessages(message)
{
    if(message.content === '!help')
    {
        message.channel.sendMessage("Voici les commandes que vous pouvez utiliser : \n"+
                                    "!help      : affiche la liste des commandes.\n"+
                                    "!pickgame  : choisi un jeu parmis la ludothèque.\n"+
                                    "!gamelist  : affiche la liste des jeux dans la ludothèque.\n"+
                                    "!toss      : lance une pièce pour un pile ou face.\n"+
                                    "!1d4       : lance un dé à 4 faces.\n"+
                                    "!1d6       : lance un dé à 6 faces.\n"+
                                    "!1d8       : lance un dé à 8 faces.\n"+
                                    "!1d10      : lance un dé à 10 faces.\n"+
                                    "!1d20      : lance un dé à 20 faces.\n"+
                                    "!1d100     : lance un dé à 100 faces.\n" +
                                    "!8ball     : répond à une question grace au pouvoir de la 8-ball.\n" +
                                    "!hi        : dire bonjour.\n"+
                                    "!bye       : dire au revoir.\n"+
                                    "\n"+
                                    "Ces commandes ne sont utilisables qu'en message privé : \n"+
                                    "!addgame game1[,game2,game3,...] : ajoute des jeux à la ludothèque.\n"+
                                    "!removegame game1[,game2,game3,...] : retire des jeux de la ludothèque.\n"
                                    );
    }

    if (message.content === '!gamelist') {
        message.channel.sendMessage(gameList);
    }
}

function HandleSuperUserCommands(message)
{
    if (message.content.startsWith("!Felicia ")) {
        console.log("Message forcé");
        var response = message.content.replace("!Felicia ", "")
        message.delete();
        message.channel.sendMessage(response);
    }
}

function SaveGames()
{
    fs.writeFile("gamelist.json", JSON.stringify(jsonGames, null, 4), function (err) {
        if (err) {
            console.log(err);
        } else {
            console.log("JSON saved to gamelist.json");
        }
    });
}