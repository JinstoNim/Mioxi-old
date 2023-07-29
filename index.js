const Discord = require('discord.js');
const bot = new Discord.Client()
const fs = require("fs");
const { MessageEmbed } = require('discord.js')
const { getMember, formatDate } = require("./functions.js");
const { stripIndents } = require("common-tags"); 
const { promptMessage } = require("./functions.js");
const WOKCommands = require('wokcommands')
const config2 = require ("./config.json")
const math = require('mathjs');
bot.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'))
for(const file of commandFiles){
    const command = require(`./commands/${file}`);
    bot.commands.set(command.name, command);
}

const guildId = '691739004877537380' 
let token = config2.token

let coins = require("./coins.json");
let xp = require("./xp.json");
const { create } = require('domain');
const { config } = require('dotenv');
// const { timeEnd, time } = require('console');

// const getApp = (guildId) => {
//     const app = bot.api.applications(bot.user.id)
//     if (guildId) {
//         app.guilds(guildId)
//     }
//     return app
// }

bot.on('ready', () =>{
    new WOKCommands(bot, {
        commandsDir: 'commands',
        testServers: [guildId],
        showWarms: false
    })
    console.log('This bot is online!')
    bot.user.setStatus('idle')
    let guilds = bot.guilds.cache.size;
    // let users1 = bot.users.cache.size;

    //Set the bots activity to show how many users and servers it is in.
    // bot.user.setActivity("with " + users1 + " users in " + guilds + " servers || mio!help");
    bot.user.setActivity(`with ${guilds} servers || mio!help`)

    // const commands = await getApp(guildId)
    // .commands.get()
// console.log(commands)

    // await getApp(guildId).commands.post({
    //     data: {
    //         name: 'ping',
    //         description: 'A simple ping command',
    //     },
    // })

    // await getApp(guildId).commands.post({
    //     data: {
    //         name: 'embed',
    //         description: 'Displays an Embed',
    //         options: [
    //             {
    //                 name: 'name',
    //                 description: 'Your name',
    //                 required: true,
    //                 type: 3,
    //             }
    //         ]
    //     },
    // })

    // bot.ws.on('INTERACTION_CREATE', (interaction) => {
    //     const { name, options } = interaction.data

    //     const command = name.toLowerCase()

    //     const args = {}

    //     if (options) {
    //         for (const option of options) {
    //             const { name, value } = option
    //             args[name] = value
    //         }
    //     }

    //     if (command === 'ping') {
    //         reply(interaction, 'pong')
    //     } else if (command === 'embed') {
    //         const embed = new Discord.MessageEmbed()
    //             .setTitle(":3")

    //             // for (const arg in args) {
    //             //     const value = args[arg]
    //             //     embed.addField(arg, value)
    //             // }

    //         reply(interaction, embed)
    //     }
    // })
})

// const reply = async (interaction, response) => {
//     let data = {
//         content: response
//     }

//     //Check for embeds
//     if(typeof response === 'object') {
//         data = await createAPIMessage(interaction, response)
//     }
//     bot.api.interactions(interaction.id, interaction.token).callback.post({
//         data : {
//             type: 4,
//             data,
//         }
//     })
// }

// const createAPIMessage = async (interaction, content) => {
//     const { data, files } = await Discord.APIMessage.create(
//         bot.channels.resolve(interaction.channel_id),
//         content
//     )
//     .resolveData()
//     .resolveFiles()

// return { ...data, files }
// }

//When the bot joins a server, send this message.

bot.on('guildCreate', (guild) => {
    guild.members.cache.get(bot.user.id).setNickname(`[mio!] Mioxi`)
    const channel = guild.channels.cache.find(channel => channel.name === "general")
    if(!channel) return;

    //Messages the bot uses to send in the add field function
    const fun1 = "Hug, Headpat, Cheekkiss, and Dance"
    const fun2 = "8ball, randompictures, catpictuures, and rps"

    const basic1 = "level, say, randomfact, ping, quiz"
    const basic2 = "userinfo, avatar, info"

    const mod1 = "clear, config, addrole"
    const mod2 = "removerole, createrole, deleterole"

    const discordv = "v12"
    const created = "3/22/2020"

    //Send an embeded message on join.
    let embed = new Discord.MessageEmbed()
            .setTitle("Thank you for inviting me")
            .setDescription("I am Mioxi, made by Jinsto Nim#6696, I am created to be a 'fun' bot, Most of my commands aren't serious ones, but I do have serious ones.")
            .addField("Features:", `**> Fun:** ${fun1}
            ${fun2}
            **> Basic Commands:** ${basic1}
            ${basic2}
            **> Moderation Commands:** ${mod1}
            ${mod2}`, true)
            .addField("General Information", `**> Discord.js version** ${discordv}
            **> Created:** ${created}`, true)
            .setColor("0FFF00")
            .setFooter(bot.user.username, bot.user.displayAvatarURL())
            .setThumbnail(bot.user.displayAvatarURL({ size: 256 }))
        channel.send(embed)
    // const channel2 = bot.channels.cache.get("889144757991907338")
    // let embed2 = new Discord.MessageEmbed()
    //     .setTitle("Discord Guild Add")
    //     .addField("Name:", `${}`)
});

//When a new user joins, send a welcome message.
bot.on('guildMemberAdd', member => {
    //Check to see if there is a channel called: "welcome", if not, return and don't send a message
    const channel = member.guild.channels.cache.find(channel => channel.name === "welcome");
    if(!channel) return;

    let welcome_message = JSON.parse(fs.readFileSync("./welcomemessage.json", "utf8"));
    if(!welcome_message[channel.guild.id]){ 
        welcome_message[channel.guild.id] = { 
            welcome_message: "Welcome to the server, ${member}"
        };
    };
    let welcome_message2 = welcome_message[member.guild && member.guild.id].welcome_message;
    let welcome_message3 = welcome_message2.replace("${member}", `${member}` || "${member.username}", `${member.username}`)

    //Send an embeded message stating that a new user joined.
    let embed = new Discord.MessageEmbed()
        .setAuthor("Member Joined")
        .setDescription(`${welcome_message3}`)
        .setColor("00FF61")
        .setTimestamp()

        //Show how many members are in the server.
        .setFooter(`${member.guild.memberCount} members now!`)
    channel.send(embed);

    //If they are in the mioxi server, automatically add the member role to them.
    if(member.guild.id === "691739004877537380") {
        member.roles.add("692432663423746138");
    };
});

//When a user leaves, display a leaving message.
bot.on('guildMemberRemove', member => {
    if(member.id === "691459358621433866") return;
    const channel = member.guild.channels.cache.find(channel => channel.name === "welcome");
    if(!channel) return;
    let embed = new Discord.MessageEmbed()
        .setAuthor("Member Left")
        .setDescription(`Goodbye, ${member}`)
        .setColor("BF0D0D")
        .setTimestamp()

        //Show how many members are left.
        .setFooter(`${member.guild.memberCount} members now.`)
    channel.send(embed);
});

//Check to see if there is a message update to a command.
bot.on('messageUpdate', (oldMessage, newMessage) => {
    let message = newMessage
    runCommand(message, oldMessage)
});

bot.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const command = bot.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});

bot.on('message', message=>{ 
//Whenever the bot runs into an eror, display an error message instead of crashing the bot.
function catchErr (err, message) {
    let embed = new Discord.MessageEmbed()
        .setTitle("The bot has run into an error.")
        .setDescription(err)
        .setColor("CD0000")
        .setTimestamp()
    message.channel.send(embed)
};


runCommand(message)
})
function runCommand(message, oldMessage){


    let prefixes = JSON.parse(fs.readFileSync("./prefix.json", "utf8"));
    if(!prefixes[message.guild.id]){ prefixes[message.guild.id] = { prefixes: "mio!"};
};

let prefix = prefixes[message.guild.id].prefixes;

let levelup = JSON.parse(fs.readFileSync("./levelup.json", "utf8"));
    if(!levelup[message.guild.id]) {
        levelup[message.guild.id] = {
            levelup: "true"
        }
    }

let levelups = levelup[message.guild.id].levelup;


let morning_messages = JSON.parse(fs.readFileSync("./morning.json", "utf8"));
    if(!morning_messages[message.guild.id]){ morning_messages[message.guild.id] = { morning_messages: "true"};
};

let morning = morning_messages[message.guild.id].morning_messages;

let morning_message = JSON.parse(fs.readFileSync("./morningmessage.json", "utf8"));
    if(!morning_message[message.guild.id]){morning_message[message.guild.id] = { morning_message: `Good morning` };};

let morning_message2 = morning_message[message.guild.id].morning_message;

let welcome_message = JSON.parse(fs.readFileSync("./welcomemessage.json", "utf8"));
    if(!welcome_message[message.guild.id]){ 
        welcome_message[message.guild.id] = { 
            welcome_message: "Welcome to the server, ${member}"
        };
    };

let welcome_messages = JSON.parse(fs.readFileSync("./welcomemessages.json", "utf8"));
    if(!welcome_messages[message.guild.id]){welcome_messages[message.guild.id] = {welcome_messages: `yes`};};

let welcome_messages2 = welcome_messages[message.guild.id].welcome_messages;

let args = message.content.substring(prefix.length).split(" ");

let messageArray = message.content.split(" ");

let cmd = messageArray[0];

let commandfile = bot.commands.get(cmd.slice(prefix.length));

// if(commandfile) commandfile.run(bot,message,args);

    if (message.content.startsWith(prefix + "help") || message.content.startsWith("mio!help")) { 
        let embed = new Discord.MessageEmbed ()
            .setTitle("Server Prefix: " + prefix)
            .addField("**Basic Commands**", "``level``, ``hex``, ``redditsearch``, ``youtubesearch``, ``say``, ``randomfact``, ``ping``, ``quiz``, ``balance``, ``userinfo``, ``members``, ``avatar``, ``info``, ``typing``, ``serverinvite``, ``timestamp``")
            .addField("**Fun Commands**", "``catpictures``, ``randompictures``, ``pat``, ``8ball``, ``hug``, ``cheekkiss``, ``rps``, ``dance``")
            .addField("**Moderation Commands**", "``clear``, ``config``, ``addrole``, ``removerole``, ``createrole``, ``deleterole``")
            .addField("**Commands in the works**", "Math")
            .addField("**Broken Commands**", "``userinfo``")
            .setFooter(`Use '${prefix}(command) help' to see how a command works. You can edit a message to '${prefix}command' if you miss spell it.`)
            .setTimestamp()
            .setColor ("2980B9")
            // bot Owner Commands, check to see if the user is the owner, if so, allow them to see these commands.
            if(message.author.id === "703666314488578238") {
                embed.addField("**bot Owner Commands**", "``restart``, ``shutdown``")
            }
        message.channel.send(embed)
    };
    if(message.content.startsWith(prefix + "config")){
        //If the argument specified after "config" is help or is empty, send them the following config list.
        if(!args[1] || args[1] === "help"){
            let embed = new Discord.MessageEmbed ()
                .setTitle("Configuration Menu")
                .addField("Prefix", "-``prefix``")
                .addField("Morning Message", "-``morning_messages`` \n -``morning_message``")
                .addField("Welcome", "-``welcome_message``")
                .addField("Level", "-``levelup``")
                .setFooter("For help, put help after each command.")
                .setColor("2980B9")
                .setTimestamp()
            message.channel.send(embed)
        }; 
        if(args[1] === "levelup"){
            //If the user doesn't have the permission "Manage Guild", return and send them a message
            //If the user has the permission "Manage Guild", allow them to continue
            if(!message.member.hasPermission("MANAGE_GUILD")) return message.channel.send("Sorry, but you are lacking the ``Manage Guild`` permission");
    
            //If the argument is "help" or is empty, return them with a usage guide.
            if(!args[2] || args[2 == "help"]) return message.channel.send(`Usage: ${prefix}config levelup (true/false)`)
    
            
            levelup[message.guild.id] = {levelup: args[2]};
    
            //Writes to the prefix.json file the servers specified setting (true/false)
            fs.writeFile("./levelup.json", JSON.stringify(levelup), (err) => {if(err) console.log(err)});
    
            //Send an embeded message notifying the user of the change
            let embed = new Discord.MessageEmbed()
                .setAuthor("Level up messages configured")
                .setDescription(`Will be sent: ${args[2]}`)
                .setColor("00FF61")
                .setTimestamp()
            message.channel.send(embed);
    
        };
    
        if(args[1] === "prefix"){
            //If the user doesn't have the permission "Manage Guild", return and send them a message
            //If the user has the permission "Manage Guild", allow them to continue
            if(!message.member.hasPermission("MANAGE_GUILD")) return message.channel.send("Sorry, but you are lacking the ``Manage Guild`` permission.");
    
            //If the argument is "help" or is empty, return them with a usage guide.
            if(!args[2] || args[2 == "help"]) return message.channel.send("Usage: " + prefix + "config prefix (prefix)");
    
            //If the user decides to reset the prefix, do the following
            if(args[2 == "reset"]){
            //Sets the prefix back to mio!
            prefixes[message.guild.id] = {prefixes: "mio!"}
    
            //Resets the nickname
            message.guild.members.cache.get(bot.user.id).setNickname(`[mio!] Mioxi`)
    
            //Sends a message to notify the user of the reset
            let embed = new Discord.MessageEmbed()
                .setAuthor("Prefix Reset")
                .setDescription("Reset to ``mio!``")
                .setColor("00FF61")
                .setTimestamp()
            message.channel.send(embed)
            };
    
        //Config to write the prefixes.
        if(!args[2 == "reset"] || !args[2 == "help"]){
            prefixes[message.guild.id] = {prefixes: args[2]};
    
            //Writes to the prefix.json file the servers specified prefix.
            fs.writeFile("./prefix.json", JSON.stringify(prefixes), (err) => {if(err) console.log(err)});
    
            //Send an embeded message notifying the user of the prefix change
                let embed = new Discord.MessageEmbed()
                    .setAuthor("Prefix Changed")
                    .setDescription(`Set to ${args[2]}`)
                    .setColor("00FF61")
                    .setTimestamp()
                message.channel.send(embed);
    
            //Change the bots nickname to have the prefix inside, so it is easier for users to know its prefix
            message.guild.members.cache.get(bot.user.id).setNickname(`[${args[2]}] Mioxi`);
    
        } else return
         
    };
    
        if(args[1] === "morning_messages"){
            //Check to see if the user has the manage guild permission, if not, send an error, if so, allow them to continue.
            if(!message.member.hasPermission("MANAGE_GUILD")) return message.channel.send("Sorry, but you are lacking the ``Manage Guild`` Permission");
    
            //Check to see if they said help (or left the command blank), if so, show them a usage guide.
            if(!args[2] || args[2] === "help") return message.channel.send("Usage: " + prefix + "config morning_messages (true/false) \n Info: Morning messages is a shorter way of saying off of the messages that are sent by the bot when someone says: ``gm``, ``nini``");
        
            //Check to see if they said true or false to either disable or enable them.
            if(args[2] === "false" || args[2] === "true"){
                morning_messages[message.guild.id] = {morning_messages: args[2]}
    
            //Write to morning.json the new change.
            fs.writeFile("./morning.json", JSON.stringify(morning_messages), (err) => {if(err) console.log(err)});
    
            //Send an embeded message to show that the morning messages were either enabled or disabled
            let embed = new Discord.MessageEmbed()
                .setAuthor("Morning Messages Configured")
                .setDescription(`Will be sent: ${args[2]}`)
                .setColor("00FF61")
                .setTimestamp()
            message.channel.send(embed);
        } else {
        
            //Check to see if the user has asked for help.
            if(args[2] === "help") return;
                return message.channel.send("You must specify if you wish to enable/disable morning messages (true/false)");
            };
        };
    
        if(args[1] === "morning_message"){
            //Check to see if they have morning messages enabled
            if(morning === "false") return message.channel.send("You do not have morning messages enabled, enable them to change the message.");
    
            //Check to see if the user has the required permission
            if(!message.member.hasPermission("MANAGE_GUILD")) return message.channel.send("Sorry, but you are lacking the ``Mange Guild`` Permission");
    
            //Check to see if the user has asked for help.
            if(!args[2] || args[2] === "help") return message.channel.send("Usage: ``mio!config morning_message (message)``");
    
            let encode = args.slice(2).join(" ");
            morning_message[message.guild.id] = {morning_message: encode};
    
            //Write the changed message to morningmessage.json
            fs.writeFile("./morningmessage.json", JSON.stringify(morning_message), (err) => {if(err) console.log(err)});
    
            //Send an embeded message to show the new change
                let embed = new Discord.MessageEmbed()
                .setAuthor("Message Changed")
                .setDescription(`Set to ` + encode)
                .setColor("00FF61")
                .setTimestamp()
            message.channel.send(embed);
        };
        if(args[1] === "welcome_message"){
    
            let encode = args.slice(2).join(" ");
    
            //Check to see if they asked for help
            if(args[2] === "help" || !args[2]) return message.channel.send("Usage: ``mio!config welcome_message (sentence)`` must contain: ``@user``, ``name``")
    
            //Check to see if the message is longer than 3 words, if not, send them this error.
            if(!args[4]) return message.channel.send("Your message must be more than 3 words")
    
            //Check to see if they included 'user' or 'name', if not, send them this error.
            if(!encode.includes("user" || "name")) return message.channel.send("Your message must include: ``user``, ``name`` \nuser -> pings the user, name -> shows the username of the user");
    
            //When the user puts "user" in their welcome message.
            if(encode.includes("user")){
    
                welcome_message[message.guild.id] = {welcome_message: encode.replace("user", "${member}")};
    
                //Writes the message into welcomemessage.json   
                fs.writeFile("./welcomemessage.json", JSON.stringify(welcome_message), (err) => {if(err) console.log(err)});
    
                //Send the user an embeded message notifying them of their change
                let embed = new Discord.MessageEmbed()
                    .setAuthor("Message Changed")
                    .setDescription(`Set to ` + encode)
                    .setColor("00FF61")
                    .setTimestamp()
                message.channel.send(embed);
            };
    
            if(encode.includes("name")){
                welcome_message[message.guild.id] = {welcome_message: encode.replace("name", "${member.username}")};
    
                //Writes the message into welcomemessage.json
                fs.writeFile("./welcomemessage.json", JSON.stringify(welcome_message), (err) => {if(err) console.log(err)});
    
                //Send the user an embeded message notifying them of their change
                let embed = new Discord.MessageEmbed()
                    .setAuthor("Message Changed")
                    .setDescription(`Set to ` + encode)
                    .setColor("00FF61")
                    .setTimestamp()
                message.channel.send(embed);
            };
        };
    };
    if(message.content.startsWith(prefix + "createrole")){
        //If the user doesn't have the proper permissions, send them an error
        if(!message.member.hasPermission("MANAGE_ROLES")) return message.channel.send("You don't have the 'MANAGE_ROLES' Permission.");
    
        //If the bot doesn't have the proper permissions, send the user an error
        if(!message.guild.me.hasPermission("MANAGE_ROLES")) return message.channel.send("I need the 'MANGE_ROLES' permission to use this command.");
        let name1 = args[1]
    
        //If the user asks for help or leaves the message blank, send them this
        if(!args[1] || args[1] === "help") return message.channel.send("Usage: ``mio!createrole (name) (color)`` \nThe bot uses hexcodes in place of the name of the color, use ``mio!hexcode`` to see them");
        let color1 = args[2]
    
        //If the user doesn't send the bot a proper color, send them an error
        if(!color1) return message.channel.send("You must mention a valid hexcode. \n Tip: For just a white role, say #00000");
    
        //If all is successful, create the role and send a message stating the roles name and color
        message.guild.roles.create({name: name1, color: color1,}).then(message.channel.send(`Created a new role, ${name1}, with the color, ${color1}`));
    };
    
    if(message.content.startsWith(prefix + "deleterole")){
        //If the user asked for help, send this.
        if(args[1] == "help") {
            let embed = new Discord.MessageEmbed()
                .setTitle("Delete Role")
                .addField("Usage:", `${prefix}deleterole @role`)
                .setDescription("Allows you to delete a role.")
                .setColor("003AFF")
                .setTimestamp()
                .setFooter(message.author.username, message.author.displayAvatarURL())
            message.channel.send(embed)
        return
        }
        //If the user doesn't have the proper permissions, send them an error
        if(!message.member.hasPermission("MANAGE_ROLES")) return message.channel.send("You don't have the 'MANAGE_ROLES' Permission.");
    
        //If the bot doesn't have the proper permissions, send the user an error
        if(!message.guild.me.hasPermission("MANAGE_ROLES")) return message.channel.send("I need the 'MANGE_ROLES' permission to use this command.");
    
        //Define role - Find the role specified through the name, id, or the mentioned role.
        let role = message.guild.roles.cache.find(r => r.name == args[1]) || message.guild.roles.cache.find(r => r.id == args[1]) || message.mentions.roles.first();
    
        //If said role doesn't exist, send an error
        if(!role) return message.channel.send("Please mention a valid role");
    
        //If the role does exist, delete it and send a message
        if(role){
            message.channel.send(`I have deleted the role, ${role}`)
            role.delete();
        };
    };
    
    //XP
    //If there is no xp/coin profile for the user, create one.
    if(!xp[message.author.id]){
        if(message.author.bot) return; 
        xp[message.author.id] = { xp: 0, level: 0 };
    };
    
    if(!coins[message.author.id]){
        if(message.author.bot) return;
        coins[message.author.id] = { coins: 0 };
    };
    
    //Defining xp calculations.
    let xpAdd = Math.floor(Math.random() * 7) + 8;
    let curxp = xp[message.author.id].xp;
    let curlvl = xp[message.author.id].level;
    let nxtLvl = xp[message.author.id].level * 2000;
    xp [message.author.id].xp = curxp + xpAdd;
    
    //Level Up
    if(nxtLvl <= xp[message.author.id].xp){
        xp[message.author.id].level = curlvl + 1;
        if(curlvl + 1 === "1") return;
        //Send a level up message
    
        //Check to see if level is set to false, if so, return
        if(levelups === "false") return;
    
        let lvlup = new Discord.MessageEmbed()
            .setAuthor("Level Up!!! +1 Level!")
            .setColor("00FFE8")
            .addField("New level", curlvl + 1)
        message.channel.send(lvlup).then(
            sentMessage => {
                sentMessage.delete({ timeout: 3000 });
            }
        );
    };
    
    //Writes the current xp into xp.json
    fs.writeFile("./xp.json", JSON.stringify(xp), (err) => {if(err) console.log(err)});
    
    if(message.content.startsWith(prefix + "level")){
        let curxp = xp[message.author.id].xp;
        let curlvl = xp[message.author.id].level;
        let member = getMember(message, args.join(" "));
    
        //If the user asked for help, send this.
        if(args[1] == "help") {
            let embed = new Discord.MessageEmbed()
                .setTitle("Level")
                .addField("Usage:", `${prefix}level`)
                .setDescription("Allows you to see your level.")
                .setColor("003AFF")
                .setTimestamp()
                .setFooter(message.author.username, message.author.displayAvatarURL())
            message.channel.send(embed)
            return
        }
    
        //Send an embeded message displaying your current level, and your current xp.
        let lvlembed = new Discord.MessageEmbed()
            .setAuthor(member.displayName + "'s current level")
            .setThumbnail(member.user.displayAvatarURL())
            .setColor("5500FF")
            .addField("level", curlvl, true)
            .addField("XP", curxp, true)
            .setFooter(member.displayName, member.user.displayAvatarURL())
        message.channel.send(lvlembed);
    };
    
    //Coins
    //Coin calculations
    let coinAmt = Math.floor(Math.random() * 2) + 1;
    let baseAmt = Math.floor(Math.random() * 2) + 1;
    if(coinAmt === baseAmt){
        coins[message.author.id] = {coins: coins[message.author.id].coins + coinAmt}
    };
    
    //Write the amount of coins into coins.json
    fs.writeFile("./coins.json", JSON.stringify(coins), (err) => {if (err) console.log(err)});
    
    if(message.content.startsWith(prefix + "balance")){
        let curcoins = coins[message.author.id].coins;
        
        //If the user asked for help, send this.
        if(args[1] == "help") {
            let embed = new Discord.MessageEmbed()
                .setTitle("Balance")
                .addField("Usage:", `${prefix}balance`)
                .setDescription("Allows you tosee your balance")
                .setColor("003AFF")
                .setTimestamp()
                .setFooter(message.author.username, message.author.displayAvatarURL())
            message.channel.send(embed)
            return
        }
    
    
        //Send an embeded message with the coin count
        let coinEmbed = new Discord.MessageEmbed()
            .setAuthor(message.author.username)
            .setColor("5500FF")
            .addField("💰", `${curcoins} coins.`)
            .setTimestamp()
        message.channel.send(coinEmbed).then(
            msg => {msg.delete(5000)}
        )
    }; 
    
    if(message.content.includes("nini") || message.content.includes("good night") || message.content.startsWith("gn")){
        //Check to see if the author is the bot itself, if so, return.
        if(message.author.id === "691459358621433866") return;
    
        //If morning is set to false, cancel.
        if(morning === "false") return;
    
        //Random responses for the embeded message
        let choice = ["Good night, ", "See you tomorrow, ", "Love you, "]
        let response = choice[Math.floor(Math.random() * choice.length)]
        let user = message.author.username
    
        //Randomly select a gif
        let number = 8;
        let imageNumber = Math.floor(Math.random() * (number - 1 + 1)) + 1;
        
        //If the user's id is the bot, return
        if(user.id === "691459358621433866") return;
    
        //Send an embeded message
        let embed = new Discord.MessageEmbed()
            .setTitle("💤")
            .setDescription(response + user)
            .attachFiles({attachment: `./sleep gifs/${imageNumber}.gif`})
            .setImage(`attachment://${imageNumber}.gif`)
            .setColor("0093FF")
            .setTimestamp()
        message.channel.send(embed);
    };
    
    if(message.content.includes("good morning") || message.content.includes("Good morning") || message.content.includes("Good Morning")){
        //Check to see if morning is set to false, if so, return
        if(morning === "false") return;
    
        ( async () => {
            let encode = args.slice(2).join(" ");
            if(!encode || encode) {
                let user = message.author.username
                    
                //Set a variable for two emojis to send.
                const chooseArr = ["👍", "👎"]
    
                //Send a good morning embeded message
                let embed = new MessageEmbed()
                    .setColor("F0FF00")
                    .setFooter(message.author.username, message.author.avatarURL)
                    .setDescription(morning_message2 + " " + message.author.username + ". How was your sleep?")
                    .setTimestamp();
                const m = await message.channel.send(embed);
                const reacted = await promptMessage(m, message.author, 30, chooseArr);
                
                const result = await getResult(reacted);
                await m.reactions.removeAll();
                embed
                    .setDescription(result)
                    .setFooter("Have a great rest of your day!")
                
                m.edit(embed);
                function getResult(me) {
                    //If the user chooses the down point, the bot gives you a headpat.
                    if((me === "👎")) {
                        let number = 4;
                        let imageNumber = Math.floor(Math.random() * (number - 1 + 1)) + 1;
                        let embed = new Discord.MessageEmbed()            
                            .setTitle("The bot pats " + user + " with joy!")
                            .attachFiles({attachment: `./pat gifs/${imageNumber}.gif`})
                            .setImage(`attachment://${imageNumber}.gif`)
                            .setColor("F0FF00")
                            .setTimestamp()
                        
                        message.channel.send(embed)
                        return("Aww, here, take this, ☕")
                    } if((me === "👍")) {
                        //If the user chooses up point, the bot responds with the message below
                        return ("That is great! Here, lets drink some coffee ☕");
                    } else {
                        //If you don't answer in time, the bot says the message below.
                        return("Are you confused about your sleep?")
                    }
                        
                };
            }
        })();
    };
    
    if(message.content.startsWith(prefix + "say")){
        //If the user asked for help, send this.
        if(args[1] == "help") {
            let embed = new Discord.MessageEmbed()
                .setTitle("Say")
                .addField("Usage:", `${prefix}say (message)`)
                .setDescription("Allows you to make the bot say anything you want.")
                .setColor("003AFF")
                .setTimestamp()
                .setFooter(message.author.username, message.author.displayAvatarURL())
            message.channel.send(embed)
            return
        }
    
        //Defines encode as the text after a command
        let encode = args.slice(1).join(" ");
    
        //If there is no encode, return an error message
        if(!encode) return message.channel.send("Please say what you want the bot to say");
            
        //Send an embeded message with the encode
        let embed = new Discord.MessageEmbed()
            .setURL(message.member.avatarURL)
            .setTitle("A wild message appears!")
            .setDescription(`<@${message.member.id}> Says: ` + encode)
            .setColor("17A589")
            .setFooter("Try not to spam this command")
            .setTimestamp()
        message.channel.send(embed);
    
        //Delete the original message
        message.delete({ timeout: 100 })
    };
    
    if(message.content.startsWith(prefix + "8ball")){
        //If the user asked for help, send this.
        if(args[1] == "help") {
            let embed = new Discord.MessageEmbed()
                .setTitle("8ball")
                .addField("Usage:", `${prefix}8ball (Question)`)
                .setDescription("Allows you to ask the 8ball a question. The question cannot be less than 3 words long.")
                .setColor("003AFF")
                .setTimestamp()
                .setFooter(message.author.username, message.author.displayAvatarURL())
            message.channel.send(embed)
            return
        }
    
        //Defines encode as the text after a command
        let encode = args.slice(1).join(" ");
    
        //If there are less than 3 words, the bot sends you an error
        if(!args[3]) return message.reply("Please ask a full question.");
    
        //8ball replies
        let replies = ["The 8ball says no.", "The 8ball spoke and said.. yes!", "The 8ball is broken, try again later.", "Not even the 8ball knows!"]
        let result = replies[Math.floor(Math.random() * replies.length)]
        
        //Send an embeded message with the encode and the reply
        let embed = new Discord.MessageEmbed()
            .setTitle("8ball")
            .setDescription(result)
            .addField("What you asked:", encode)
            .setColor("5D00FF")
            .setTimestamp()
        message.channel.send(embed)
    };
    
    if(message.content.startsWith(prefix + "avatar")){
        //If the user asked for help, send this.
        if(args[1] == "help") {
            let embed = new Discord.MessageEmbed()
                .setTitle("Avatar")
                .addField("Usage:", `${prefix}avatar @(user) or (userid)`)
                .setDescription("Allows you to check a users avatar by mentioning them or using their id.")
                .setColor("003AFF")
                .setTimestamp()
                .setFooter(message.author.username, message.author.displayAvatarURL())
            message.channel.send(embed)
            return
        }
    
        //Define the mentioned user as wUser
        let wUser = message.mentions.members.first() || message.guild.members.cache.find(m => m.user.tag === args[1]) || message.guild.members.cache.get(args[1]);
        
        //If there is no wUser, send the authors avatar.
        if(!wUser){
            let embed = new Discord.MessageEmbed()
                .setDescription(message.author.username + "'s avatar is:")
                .setImage(message.author.displayAvatarURL({ size: 256 }))
                .setColor("EC00FF")
                .setTimestamp()
            message.channel.send(embed)
        };
            
        //Send an embeded message with the avatar
        if(!wUser) return;
        let embed = new Discord.MessageEmbed()
            .setDescription(wUser.user.username + "'s avatar is:")
            .setImage(wUser.user.displayAvatarURL({ size: 256 }))
            .setColor("EC00FF")
            .setTimestamp()
        message.channel.send(embed)
    };
    
    if(message.content.startsWith(prefix + "catpictures")){
        //If the user asked for help, send this.
        if(args[1] == "help") {
            let embed = new Discord.MessageEmbed()
                .setTitle("Cat Pictures")
                .addField("Usage:", `${prefix}catpictures`)
                .setDescription("Allows you to see a random cat picture")
                .setColor("003AFF")
                .setTimestamp()
                .setFooter(message.author.username, message.author.displayAvatarURL())
            message.channel.send(embed)
            return
        }
    
        //Number of images
        let number = 5
        let imageNumber = Math.floor(Math.random() * (number - 1 + 1)) + 1;
    
        //Send the embeded message with a cat image
        let embed = new Discord.MessageEmbed()
            .setTitle("Cat image #" + imageNumber)
            .attachFiles({attachment: `./cat images/${imageNumber}.PNG`})
            .setImage(`attachment://${imageNumber}.PNG`)
            .setColor("0FFF00")
            .setTimestamp()
        message.channel.send(embed);
    };
    
    if(message.content.startsWith(prefix + "cheekkiss")){
        //If the user asked for help, send this.
        if(args[1] == "help") {
            let embed = new Discord.MessageEmbed()
                .setTitle("Cheek Kiss")
                .addField("Usage:", `${prefix}cheekkiss @(user)`)
                .setDescription("Allows you to cheekkiss a user!")
                .setColor("003AFF")
                .setTimestamp()
                .setFooter(message.author.username, message.author.displayAvatarURL())
            message.channel.send(embed)
            return
        }
    
        //Define wUser as the user you mentioned.
        let wUser = message.guild.member(message.mentions.users.first()) || message.guild.members.cache.get(args[0])
    
        //If a user isn't mentioned, return an error.
        if(!wUser) return message.channel.send("Please mention a valid user");
    
        //If the user mentioned themself, the bot returns an error.
        if(wUser.id === message.author.id) return message.channel.send("You can't kiss yourself 😢");
    
        let name = `${wUser.user.username}`
        let choice = ["Smooch!", "🤭"]
        let response = choice[Math.floor(Math.random() * choice.length)]
        let number = 4;
        let imageNumber = Math.floor(Math.random() * (number - 1 + 1)) + 1;
    
        //Send an embeded message displaying a gif.
        let embed = new Discord.MessageEmbed()            
            .setDescription(message.author.username + " kisses " + name + ", " + response)
            .attachFiles({attachment: `./cheek gifs/${imageNumber}.gif`}).setImage(`attachment://${imageNumber}.gif`)
            .setColor("5D00FF")
            .setTimestamp()
        message.channel.send(embed)
    };
    
    if(message.content.startsWith(prefix + "hex")){
        //If the user asked for help, send this.
        if(args[1] == "help") {
            let embed = new Discord.MessageEmbed()
                .setTitle("Hex")
                .addField("Usage:", `${prefix}hex`)
                .setDescription("Allows you to see a list of hexcodes")
                .setColor("003AFF")
                .setTimestamp()
                .setFooter(message.author.username, message.author.displayAvatarURL())
            message.channel.send(embed)
            return
        }
    
        //Send an embeded message with hex codes.
        let embed = new Discord.MessageEmbed()
            .setTitle("Hexcodes")
            .addField("Basic:", "Red: ``F0000``, Orange: ``FF9700``, Yellow: ``FBFF00``, Green: ``0FFF00``, Blue: ``003AFF``, Purple: ``6800FF``, Pink: ``FF00D1``, White: ``FFFFFF``, Black: ``000000``")
            .addField("Lighter Versions:", "Red: ``FF6666``, Orange: ``FFA966``, Yellow: ``FFEC66``, Green: ``68FF66``, Blue: ``66D1FF``, Purple: ``D166FF``, Pink: ``FF66CA``")
            .addField("Darker Versions:", "Red: ``C10000``, Orange: ``C15800``, Yellow: ``C1C100``, Green: ``00C13D``, Blue: ``051AA1``, Purple: ``4C05A1``, Pink: ``A1058C``")
            .setTimestamp()
            .setFooter(message.author.username, message.author.displayAvatarURL())
        message.channel.send(embed)
    };
    
    if(message.content.startsWith(prefix + "hug")){
        //If the user asked for help, send this.
        if(args[1] == "help") {
            let embed = new Discord.MessageEmbed()
                .setTitle("Hug")
                .addField("Usage:", `${prefix}hug (user)`)
                .setDescription("Allows you to hug another user.")
                .setColor("003AFF")
                .setTimestamp()
                .setFooter(message.author.username, message.author.displayAvatarURL())
            message.channel.send(embed)
            return
        }
    
        //Define wUser as the user you mentioned
        let wUser = message.guild.member(message.mentions.users.first()) || message.guild.members.cache.get(args[0])
    
        //If there is no on mentioned, return an error.
        if(!wUser) return message.channel.send("Please mention a valid user");
    
        //If the mentioned user is the message author, return an error.
        if(wUser.id === message.author.id) return message.channel.send("Do you need someone to hug you?");
    
        //If the mentioned user is the bot, send a special message before and go as usual.
        if(wUser.id === "691459358621433866"){
            message.channel.send(":o, you want to hug me? Aww, come here!")
            let choice = ["Squish!!", "Cute!", "tehehe!"]
            let response = choice[Math.floor(Math.random() * choice.length)]
            let number = 10;
            let imageNumber = Math.floor(Math.random() * (number - 1 + 1)) + 1;
    
            //Send an embeded message containing the hug gif.
            let embed = new Discord.MessageEmbed()            
                .setDescription(`${message.author.username} hugs the bot! ${response}`)
                .attachFiles({attachment: `./hug gifs/${imageNumber}.gif`}).setImage(`attachment://${imageNumber}.gif`)
                .setColor("C5FF00")
                .setTimestamp()
            message.channel.send(embed)
        return;
        };
    
        let name = `${wUser.user.username}`
        let choice = ["Squish!!", "Cute!", "tehehe!"]
        let response = choice[Math.floor(Math.random() * choice.length)] 
        let number = 10;
        let imageNumber = Math.floor(Math.random() * (number - 1 + 1)) + 1;
    
        //Send an embeded message containing the hug gif.
        let embed = new Discord.MessageEmbed()            
            .setDescription(`${message.author.username} hugs ${name}! ${response}`)
            .attachFiles({attachment: `./hug gifs/${imageNumber}.gif`}).setImage(`attachment://${imageNumber}.gif`)
            .setColor("C5FF00")
            .setTimestamp()
        message.channel.send(embed)
    };
    
    if(message.content.startsWith(prefix + "dance")){
        //If the user asked for help, send this.
        if(args[1] == "help") {
            let embed = new Discord.MessageEmbed()
                .setTitle("Dance")
                .addField("Usage:", `${prefix}dance`)
                .setDescription("Allows you to dance!")
                .setColor("003AFF")
                .setTimestamp()
                .setFooter(message.author.username, message.author.displayAvatarURL())
            message.channel.send(embed)
            return
        }
    
        //Set responses for the description
        let choice = ["WOO!", "Show your moves!", "You go girl!"]
        let response = choice[Math.floor(Math.random() * choice.length)]
        let number = 10;
        let imageNumber = Math.floor(Math.random() * (number - 1 + 1)) + 1;
    
        //Send an embeded message with the dance gif.
        let embed = new Discord.MessageEmbed()            
            .setDescription(`${message.author.username} wants to dance! ${response}`)
            .attachFiles({attachment: `./dance gifs/${imageNumber}.gif`}).setImage(`attachment://${imageNumber}.gif`)
            .setColor("C5FF00")
            .setTimestamp()
        message.channel.send(embed);
    };
    
    if(message.content.startsWith(prefix + "invite")){
        //If the user asked for help, send this.
        if(args[1] == "help") {
            let embed = new Discord.MessageEmbed()
                .setTitle("Invitation")
                .addField("Usage:", `${prefix}invite`)
                .setDescription("Allows you to invite the bot to your server by giving you a bot invitation")
                .setColor("003AFF")
                .setTimestamp()
                .setFooter(message.author.username, message.author.displayAvatarURL())
            message.channel.send(embed)
            return
        }
    
        //Send an embeded message with the bot invitation
        let embed = new Discord.MessageEmbed()
            .setAuthor("Invitation","https://www.net-aware.org.uk/siteassets/images-and-icons/application-icons/app-icons-discord.png?w=585&scale=down","https://discord.com/oauth2/authorize?client_id=691459358621433866&scope=bot&permissions=8" )
            .setFooter("Have a good day!")
            .setTimestamp()
            .setColor("5500FF")
        message.channel.send(embed)
    };
    
    if(message.content.startsWith(prefix + "pat")){
        //If the user asked for help, send this.
        if(args[1] == "help") {
            let embed = new Discord.MessageEmbed()
                .setTitle("Head Pats")
                .addField("Usage:", `${prefix}pat (user)`)
                .setDescription("Allows you to give a head pat to any user (including the bot)")
                .setColor("003AFF")
                .setTimestamp()
                .setFooter(message.author.username, message.author.displayAvatarURL())
            message.channel.send(embed)
            return
        }
    
        //Define wUser as the user you have mentioned
        let wUser = message.guild.member(message.mentions.users.first()) || message.guild.members.cache.get(args[0])
    
        //If no one was mentioned, return an error.
        if(!wUser) return message.channel.send("Please mention a valid user");
    
        //If the user mentioned was the author, return an error
        if(wUser.id === message.author.id) return message.channel.send("Do you need someone to pat you?");
    
        let name = `${wUser.user.username}`
        let choice = ["Ewee!", "Adorable ☺", ":3"]
        let response = choice[Math.floor(Math.random() * choice.length)]
        let number = 10;
        let imageNumber = Math.floor(Math.random() * (number - 1 + 1)) + 1;
    
        //Send an embeded message with the pat gif.
        let embed = new Discord.MessageEmbed()            
            .setDescription(message.author.username + " Pats " + name + ", " + response)
            .attachFiles({attachment: `./pat gifs/${imageNumber}.gif`}).setImage(`attachment://${imageNumber}.gif`)
            .setColor("FF6C00")
            .setTimestamp()
        message.channel.send(embed)
    };
    
    // if(message.content.startsWith(prefix + "ping")){
    //     bot.commands.get('ping').execute(message, args);
    // };
    
    if(message.content.startsWith(prefix + "quiz")){
        //If the user asked for help, send this.
        if(args[1] == "help") {
            let embed = new Discord.MessageEmbed()
                .setTitle("Quiz")
                .addField("Usage:", `${prefix}quiz`)
                .setDescription("Gets you a random quiz and allows you to react to pick an answer.")
                .setColor("003AFF")
                .setTimestamp()
                .setFooter(message.author.username, message.author.displayAvatarURL())
            message.channel.send(embed)
            return
        }
    
        //Number of quizes the bot has available
        let number = 10;
    
        //Picks a random number, using the cases to pick
        var random = Math.floor (Math.random() * (number - 1 + 1)) + 1;
        switch (random){
            case 1: 
            ( async () => {
                const chooseArr = ["🇦", "🇧"]
                
                //Send an embeded message containing the quiz.
                let embed = new MessageEmbed()
                    .setColor("5500FF")
                    .setFooter(message.author.username, message.author.avatarURL, "You have 30 seconds to choose!")
                    .setDescription("Difficulty: Easy \n Quiz: \n What year was this bot created? \n🇦 - 2019 \n🇧 - 2020")
                    .setTimestamp();
                const m = await message.channel.send(embed);
                const reacted = await promptMessage(m, message.author, 30, chooseArr);       
    
                const result = await getResult(reacted);
                await m.reactions.removeAll();
                embed
    
                    //Edit the embed to show the users result
                    .setDescription("")
                    .addField(result, "Your choice: " + reacted)
                m.edit(embed);
                
                //Get the result, if the user was right or wrong, using this.
                function getResult(me) 
                {
                    if((me === "🇧")) {
                        return ("Good job! You got it!");
                    } 
                    if((me === "🇦")) {
                        return ("WRONG! This bot was made in 2020")
                    } else {
                            let reacted = "None"
                            return('Please react to the message')
                    }
                }
            })();
        };
    
        switch (random){
            case 2: 
            ( async () => {
                const chooseArr = ["🇦", "🇧", "🇨"]
    
                //Send an embeded message containing the quiz.
                let embed = new MessageEmbed()
                    .setColor("5500FF")
                    .setFooter(message.author.username, message.author.avatarURL, "You have 30 seconds to choose!")
                    .setDescription("Difficulty: Easy \n Quiz: \n What year was IT created? \n🇦 - 2018 \n🇧 - 2017 \n🇨 - 2016")
                    .setTimestamp();
                const m = await message.channel.send(embed);
                const reacted = await promptMessage(m, message.author, 30, chooseArr);
    
                const result = await getResult(reacted);
                await m.reactions.removeAll();
                embed
                
                    //Edit the embed to show the users result.
                    .setDescription("")
                    .addField(result, "Your choice: " + reacted)
                m.edit(embed);
    
                //Get the result, if the user was right or wrong, using this.
                function getResult(me) 
                {
                    if((me === "🇧")) {
                        return ("Good job! You got it!");
                    } 
                    if((me === "🇦")) {
                        return ("WRONG! Try again.")
                    } 
                    if((me === "🇨")) {
                        return ("WRONG! Try again.")
                    } else {
                        let reacted = "None"
                        return('Please react to the message')
                    }
                }
            })();
        };
    
        switch (random){
            case 3: 
            ( async () => {
                const chooseArr = ["🇦", "🇧", "🇨", "🇩"]
                
                //Send an embeded message with the quiz.
                let embed = new MessageEmbed()
                    .setColor("5500FF")
                    .setFooter(message.author.username, message.author.avatarURL, "You have 30 seconds to choose!")
                    .setDescription("Difficulty: Medium \n Quiz: \n What year was the very first model of the iPhone released? \n🇦 - 2005 \n🇧 - 2006 \n🇨 - 2007 \n🇩 - 2008")
                    .setTimestamp();
                const m = await message.channel.send(embed);
                const reacted = await promptMessage(m, message.author, 30, chooseArr);
    
                const result = await getResult(reacted);
                await m.reactions.removeAll();
                embed
                
                    //Edit the embed to show the users result.
                    .setDescription("")
                    .addField(result, "Your choice: " + reacted)
                m.edit(embed);
    
                //Get the result, if the user was right or wrong, using this.
                function getResult(me) 
                {
                    if((me === "🇨")) {
                        return ("Good job! You got it!");
                    } 
                    if((me === "🇦")) { 
                        return ("WRONG! Try again.")
                    }
                    if((me === "🇧")) {
                        return ("WRONG! Try again.")
                    }
                    if((me === "🇩")) {
                        return ("WRONG! Try again.")
                    } else {
                        let reacted = "None"
                    return('Please react to the message')
                    }
                }
            })();
        };
    
        switch (random){
            case 4: 
            ( async () => {
                const chooseArr = ["🇦", "🇧", "🇨", "🇩"]
    
                //Send an embeded message with the quiz.
                let embed = new MessageEmbed()
                    .setColor("5500FF")
                    .setFooter(message.author.username, message.author.avatarURL, "You have 30 seconds to choose!")
                    .setDescription("Difficulty: Hard \n Quiz: \n What was the Turkish city of Instanbul called before 1930? \n🇦 - Ankara \n🇧 - Konya \n🇨 - Constantinople \n🇩 - Bursa")
                    .setTimestamp();
                const m = await message.channel.send(embed);
                const reacted = await promptMessage(m, message.author, 30, chooseArr);        
    
                const result = await getResult(reacted);
                await m.reactions.removeAll();
                embed
            
                    //Edit the embed to show the users result.
                    .setDescription("")
                    .addField(result, "Your choice: " + reacted)
                m.edit(embed);
    
                //Get the result, if the user was right or wrong, using this.
                function getResult(me) 
                    {
                    if((me === "🇦")) {
                        return ("WRONG! Try again.")
                    } 
                    if((me === "🇧")) {
                        return ("WRONG! Try again.")
                    } 
                    if((me === "🇨")) {
                        return ("Good job! You got it!")
                    }
                    if((me === "🇩")) {
                        return ("WRONG! Try again.");
                    } else {
                        let reacted = "None"
                        return('Please react to the message')
                    }
                }
            })();
        };
    
        switch (random){
            case 5: 
            ( async () => {
                const chooseArr = ["🇦", "🇧", "🇨", "🇩"]
    
                //Send an embeded message with the quiz.
                let embed = new MessageEmbed()
                    .setColor("5500FF")
                    .setFooter(message.author.username, message.author.avatarURL, "You have 30 seconds to choose!")
                    .setDescription("Difficulty: Hard \n Quiz: \n What was Twitter's original name? \n🇦 - tooter \n🇧 - tottoo \n🇨 - twitter \n🇩 - twttr")
                    .setTimestamp();
                const m = await message.channel.send(embed);
                const reacted = await promptMessage(m, message.author, 30, chooseArr);        
    
                const result = await getResult(reacted);
                await m.reactions.removeAll();
                embed
            
                    //Edit the embed to show the users result.
                    .setDescription("")
                    .addField(result, "Your choice: " + reacted)
                m.edit(embed);
    
                //Get the result, if the user was right or wrong, using this.
                function getResult(me) 
                    {
                    if((me === "🇩")) {
                        return ("Good job! You got it!");
                    } 
                    if((me === "🇦")) {
                        return ("WRONG! Try again.")
                    } 
                    if((me === "🇧")) {
                        return ("WRONG! Try again.")
                    } 
                    if((me === "🇨")) {
                        return ("WRONG! Try again.")
                    } else {
                        let reacted = "None"
                        return('Please react to the message')
                    }
                }
            })();
        };
    
        switch (random){
            case 6: 
            ( async () => {
                const chooseArr = ["🇦", "🇧", "🇨", "🇩"]
    
                //Send an embeded message with the quiz.
                let embed = new MessageEmbed()
                    .setColor("5500FF")
                    .setFooter(message.author.username, message.author.avatarURL, "You have 30 seconds to choose!")
                    .setDescription("Difficulty: Hard \n Quiz: \n From which US city do the band The Killers originate? \n🇦 - Las Vegas \n🇧 - Paradise \n🇨 - Spring Valley \n🇩 - Whitney")
                    .setTimestamp();
                const m = await message.channel.send(embed);
                const reacted = await promptMessage(m, message.author, 30, chooseArr);        
    
                const result = await getResult(reacted);
                await m.reactions.removeAll();
                embed
            
                    //Edit the embed to show the users result.
                    .setDescription("")
                    .addField(result, "Your choice: " + reacted)
                m.edit(embed);
    
                //Get the result, if the user was right or wrong, using this.
                function getResult(me) 
                    {
                    if((me === "🇦")) {
                        return ("Good job! You got it!")
                    } 
                    if((me === "🇧")) {
                        return ("WRONG! Try again.")
                    } 
                    if((me === "🇨")) {
                        return ("WRONG! Try again.")
                    }
                    if((me === "🇩")) {
                        return ("WRONG! Try again.");
                    } else {
                        let reacted = "None"
                        return('Please react to the message')
                    }
                }
            })();
        };
    
        switch (random){
            case 7: 
            ( async () => {
                const chooseArr = ["🇦", "🇧", "🇨", "🇩"]
    
                //Send an embeded message with the quiz.
                let embed = new MessageEmbed()
                    .setColor("5500FF")
                    .setFooter(message.author.username, message.author.avatarURL, "You have 30 seconds to choose!")
                    .setDescription("Difficulty: Medium \n Quiz: \nHow many human players are there on each side of a polo match?  \n🇦 - Three \n🇧 - Four \n🇨 - Five \n🇩 - Six")
                    .setTimestamp();
                const m = await message.channel.send(embed);
                const reacted = await promptMessage(m, message.author, 30, chooseArr);        
    
                const result = await getResult(reacted);
                await m.reactions.removeAll();
                embed
            
                    //Edit the embed to show the users result.
                    .setDescription("")
                    .addField(result, "Your choice: " + reacted)
                m.edit(embed);
    
                //Get the result, if the user was right or wrong, using this.
                function getResult(me) 
                    {
                    if((me === "🇦")) {
                        return ("WRONG! Try again.")
                    } 
                    if((me === "🇧")) {
                        return ("Good job! You got it!")
                    } 
                    if((me === "🇨")) {
                        return ("WRONG! Try again.")
                    }
                    if((me === "🇩")) {
                        return ("WRONG! Try again.");
                    } else {
                        let reacted = "None"
                        return('Please react to the message')
                    }
                }
            })();
        };
    
        switch (random){
            case 8: 
            ( async () => {
                const chooseArr = ["🇦", "🇧", "🇨", "🇩"]
    
                //Send an embeded message with the quiz.
                let embed = new MessageEmbed()
                    .setColor("5500FF")
                    .setFooter(message.author.username, message.author.avatarURL, "You have 30 seconds to choose!")
                    .setDescription("Difficulty: Hard \n Quiz: \nStreet artist Banky is originally associated with which British city?  \n🇦 - Kingswood \n🇧 - Mangotsfield \n🇨 - Nailsea \n🇩 - Bristol")
                    .setTimestamp();
                const m = await message.channel.send(embed);
                const reacted = await promptMessage(m, message.author, 30, chooseArr);        
    
                const result = await getResult(reacted);
                await m.reactions.removeAll();
                embed
            
                    //Edit the embed to show the users result.
                    .setDescription("")
                    .addField(result, "Your choice: " + reacted)
                m.edit(embed);
    
                //Get the result, if the user was right or wrong, using this.
                function getResult(me) 
                    {
                    if((me === "🇦")) {
                        return ("WRONG! Try again.")
                    } 
                    if((me === "🇧")) {
                        return ("WRONG! Try again.")
                    } 
                    if((me === "🇨")) {
                        return ("WRONG! Try again.")
                    }
                    if((me === "🇩")) {
                        return ("Good job! You got it!");
                    } else {
                        let reacted = "None"
                        return('Please react to the message')
                    }
                }
            })();
        };
    
        switch (random){
            case 9: 
            ( async () => {
                const chooseArr = ["🇦", "🇧", "🇨", "🇩"]
    
                //Send an embeded message with the quiz.
                let embed = new MessageEmbed()
                    .setColor("5500FF")
                    .setFooter(message.author.username, message.author.avatarURL, "You have 30 seconds to choose!")
                    .setDescription("Difficulty: Medium \n Quiz: \nWhat was the most popular girls name in the UK in 2019?  \n🇦 - Sophia \n🇧 - Olivia \n🇨 - Lily \n🇩 - Ava")
                    .setTimestamp();
                const m = await message.channel.send(embed);
                const reacted = await promptMessage(m, message.author, 30, chooseArr);        
    
                const result = await getResult(reacted);
                await m.reactions.removeAll();
                embed
            
                    //Edit the embed to show the users result.
                    .setDescription("")
                    .addField(result, "Your choice: " + reacted)
                m.edit(embed);
    
                //Get the result, if the user was right or wrong, using this.
                function getResult(me) 
                    {
                    if((me === "🇦")) {
                        return ("WRONG! Try again.")
                    } 
                    if((me === "🇧")) {
                        return ("Good job! You got it!")
                    } 
                    if((me === "🇨")) {
                        return ("WRONG! Try again.")
                    }
                    if((me === "🇩")) {
                        return ("WRONG! Try again.");
                    } else {
                        let reacted = "None"
                        return('Please react to the message')
                    }
                }
            })();
        };
    
        switch (random){
            case 10: 
            ( async () => {
                const chooseArr = ["🇦", "🇧", "🇨", "🇩"]
    
                //Send an embeded message with the quiz.
                let embed = new MessageEmbed()
                    .setColor("5500FF")
                    .setFooter(message.author.username, message.author.avatarURL, "You have 30 seconds to choose!")
                    .setDescription("Difficulty: Medium \n Quiz: \nWhat number is found in reference to their varieties on Heinz products?  \n🇦 - 57 \n🇧 - 56 \n🇨 - 75 \n🇩 - 65")
                    .setTimestamp();
                const m = await message.channel.send(embed);
                const reacted = await promptMessage(m, message.author, 30, chooseArr);        
    
                const result = await getResult(reacted);
                await m.reactions.removeAll();
                embed
            
                    //Edit the embed to show the users result.
                    .setDescription("")
                    .addField(result, "Your choice: " + reacted)
                m.edit(embed);
    
                //Get the result, if the user was right or wrong, using this.
                function getResult(me) 
                    {
                    if((me === "🇦")) {
                        return ("Good job! You got it!")
                    } 
                    if((me === "🇧")) {
                        return ("WRONG! Try again.")
                    } 
                    if((me === "🇨")) {
                        return ("WRONG! Try again.")
                    }
                    if((me === "🇩")) {
                        return ("WRONG! Try again.");
                    } else {
                        let reacted = "None"
                        return('Please react to the message')
                    }
                }
            })();
        };
    };
    
    if(message.content.startsWith(prefix + "randomfact")){
        //If the user asked for help, send this.
        if(args[1] == "help") {
            let embed = new Discord.MessageEmbed()
                .setTitle("Random Fact")
                .addField("Usage:", `${prefix}randomfact`)
                .setDescription("Shows you a random fact.")
                .setColor("003AFF")
                .setTimestamp()
                .setFooter(message.author.username, message.author.displayAvatarURL())
            message.channel.send(embed)
            return
        }
    
        //Number of random facts the bot has available
        let number = 20;
    
        //Picks a random number, and picks the case with that number to be sent.
        var random = Math.floor (Math.random() * (number - 1 + 1)) + 1;
    
        switch (random){
            case 1: 
            
            //Send an embed with the random fact.
            let embed = new Discord.MessageEmbed()
                .setAuthor("Random Fact") 
                .addField("Fact:", "Penguins have knees")
                .setColor("5500FF")          
            message.channel.send(embed)
        };
    
        switch (random){
            case 2:
                
            //Send an embed with the random fact.
            let embed = new Discord.MessageEmbed()
                .setAuthor("Random Fact") 
                .addField("Fact:", "The average person will spend six months of their life waiting for red lights to turn green")
                .setColor("5500FF")     
            message.channel.send(embed)
        };
    
        switch (random){
            case 3: 
            
            //Send an embed with the random fact.
            let embed = new Discord.MessageEmbed()
                .setAuthor("Random Fact") 
                .addField("Fact:", "A bolt of lightning contains enough energy to toast 100,000 slices of bread")
                .setColor("5500FF")       
            message.channel.send(embed)
        };
    
        switch (random){
            case 4: 
            
            //Send an embed with the random fact.
            let embed = new Discord.MessageEmbed()
                .setAuthor("Random Fact") 
                .addField("Fact:", "You can hear a blue whale's heartbeat from two miles away")
                .setColor("5500FF")  
            message.channel.send(embed)
        };
    
        switch (random){
            case 5: 
            
            //Send an embed with the random fact.
            let embed = new Discord.MessageEmbed()
                .setAuthor("Random Fact") 
                .addField("Fact:", "There is a bridge exclusive for squirrels")
                .setColor("5500FF")
            message.channel.send(embed)
        };
    
        switch (random){
            case 6: 
            
            //Send an embed with the random fact.
            let embed = new Discord.MessageEmbed()
                .setAuthor("Random Fact") 
                .addField("Fact:", "Roosters have built in earplugs")
                .setColor("5500FF") 
            message.channel.send(embed)
        };
    
        switch (random){
            case 7: 
            let embed = new Discord.MessageEmbed()
                .setAuthor("Random Fact") 
                .addField("Fact:", "Coke saved a town from depression")
                .setColor("5500FF")  
            message.channel.send(embed)
        };
    
        switch (random){
            case 8: 
            
            //Send an embed with the random fact.
            let embed = new Discord.MessageEmbed()
                .setAuthor("Random Fact") 
                .addField("Fact:", "We may have had alien contact before")
                .setColor("5500FF") 
            message.channel.send(embed)
        };
    
        switch (random){
            case 9: 
            
            //Send an embed with the random fact.
            let embed = new Discord.MessageEmbed()
                .setAuthor("Random Fact") 
                .addField("Fact:", "You can smell rain")
                .setColor("5500FF") 
            message.channel.send(embed)
        };
        
        switch (random){
            case 10: 
            
            //Send an embed with the random fact.
            let embed = new Discord.MessageEmbed()
                .setAuthor("Random Fact") 
                .addField("Fact:", "Dolphins have actual names")
                .setColor("5500FF") 
            message.channel.send(embed)
        };
    
        switch (random){
            case 11:
                
            //Send an embed with the random fact.
            let embed = new Discord.MessageEmbed()
                .setAuthor("Random Fact") 
                .addField("Fact:", "A wild dog is the most successful predator")
                .setColor("5500FF")
            message.channel.send(embed)
        };
    
        switch (random){
            case 12: 
            
            //Send an embed with the random fact.
            let embed = new Discord.MessageEmbed()
                .setAuthor("Random Fact") 
                .addField("Fact:", "Superman helped take down the KKK")
                .setColor("5500FF")  
            message.channel.send(embed)
        };
    
        switch (random){
            case 13:
                
            //Send an embed with the random fact.
            let embed = new Discord.MessageEmbed()
                .setAuthor("Random Fact") 
                .addField("Fact:", "Sears used to sell houses")
                .setColor("5500FF")
            message.channel.send(embed)
        };
    
        switch (random){ 
            case 14: 
            
            //Send an embed with the random fact.
            let embed = new Discord.MessageEmbed() 
                .setAuthor("Random Fact") 
                .addField("Fact:", "Cold water is just as cleansing as hot water")
                .setColor("5500FF")
            message.channel.send(embed)
        };
    
        switch (random){
            case 15: 
            
            //Send an embed with the random fact.
            let embed = new Discord.MessageEmbed() 
                .setAuthor("Random Fact") 
                .addField("Fact:", "One person has gotten hit by lightning 7 times")
                .setColor("5500FF")
            message.channel.send(embed)
        };
    
        switch (random){
            case 16: 
            
            //Send an embed with the random fact.
            let embed = new Discord.MessageEmbed()
                .setAuthor("Random Fact") 
                .addField("Fact:", "A hiker found an ancient wallet")
                .setColor("5500FF")
            message.channel.send(embed)
        };
    
        switch (random){
            case 17: 
            
            //Send an embed with the random fact.
            let embed = new Discord.MessageEmbed()
                .setAuthor("Random Fact") 
                .addField("Fact:", "Animal shelters are slammed after the Fourth of July")
                .setColor("5500FF")
            message.channel.send(embed)
        };
    
        switch (random){
            case 18: 
            
            //Send an embed with the random fact.
            let embed = new Discord.MessageEmbed()
                .setAuthor("Random Fact") 
                .addField("Fact:", "The worlds most successful pirate was a woman")
                .setColor("5500FF")
            message.channel.send(embed)
        };
    
        switch (random){
            case 19: 
            
            //Send an embed with the random fact.
            let embed = new Discord.MessageEmbed()
                .setAuthor("Random Fact") 
                .addField("Fact:", "There may be treasure in Virginia")
                .setColor("5500FF") 
            message.channel.send(embed)
        };
    
        switch (random){
            case 20: 
            
            //Send an embed with the random fact.
            let embed = new Discord.MessageEmbed()
                .setAuthor("Random Fact") 
                .addField("Fact:", "A sea lion once saved a man")
                .setColor("5500FF")
            message.channel.send(embed)
        };
    };
    
    if(message.content.startsWith(prefix + "randompictures")){
        //If the user asked for help, send this.
        if(args[1] == "help") {
            let embed = new Discord.MessageEmbed()
                .setTitle("Random Picture")
                .addField("Usage:", `${prefix}randompictures`)
                .setDescription("Shows you a random picture from the internet")
                .setColor("003AFF")
                .setTimestamp()
                .setFooter(message.author.username, message.author.displayAvatarURL())
            message.channel.send(embed)
            return
        }
    
        //Number of pictures the bot has available
        let number = 10;
    
        //Picks a random number, and sets it as the image number
        let imageNumber = Math.floor(Math.random() * (number - 1 + 1)) + 1;
    
        //Sends an embeded message containing the random picture
        let embed = new Discord.MessageEmbed()
            .setAuthor(`Image #${imageNumber}`)
            .attachFiles({attachment: `./random images/${imageNumber}.PNG`})
            .setImage(`attachment://${imageNumber}.PNG`)
            .setFooter(message.author.username, message.author.displayAvatarURL({size: 256}))
            .setColor("5500FF")
        message.channel.send(embed)
    };
    
    if(message.content.startsWith(prefix + "redditsearch")){
        //If the user asked for help, send this.
        if(args[1] == "help") {
            let embed = new Discord.MessageEmbed()
                .setTitle("Reddit Search")
                .addField("Usage:", `${prefix}redditsearch (subreddit)`)
                .setDescription("Allows you to search for a subreddit.")
                .setColor("003AFF")
                .setTimestamp()
                .setFooter(message.author.username, message.author.displayAvatarURL())
            message.channel.send(embed)
            return
        }
    
        //Sets the base as the start of the link
        let base = "https://www.reddit.com/r/"
    
        //Defines encode as the text after the command, and joining it with +'s instead of spaces
        let encode = args.slice(1).join("+");
    
        //Sends an embeded message containing the search.
        let e = new Discord.MessageEmbed()
            .setAuthor(`r/${encode}`, "https://image.flaticon.com/icons/png/512/52/52053.png", `${base + encode}`)
            .setColor("17A589")
            .setFooter(message.author.username, message.author.displayAvatarURL({size: 256}))
            .setTimestamp()
        message.channel.send(e);
    };
    
    if(message.content.startsWith(prefix + "rps")){
        //If the user asked for help, send this.
        if(args[1] == "help") {
            let embed = new Discord.MessageEmbed()
                .setTitle("Rock Paper Scissors")
                .addField("Usage:", `${prefix}rps`)
                .setDescription("Allows you to play a rock paper scissors game against the bot.")
                .setColor("003AFF")
                .setTimestamp()
                .setFooter(message.author.username, message.author.displayAvatarURL())
            message.channel.send(embed)
            return
        }
        
        ( async () => {
            //If the user loses, the bot picks from one of these responses randomly
            let lostchoice = ["Darn, Try again", "Hehe! I win", "Good Luck next time"]
            let lostresponse = lostchoice[Math.floor(Math.random() * lostchoice.length)]
    
            //If the bot and the user ties, the bot picks from one of these responses randomly.
            let tiechoice = ["It's a tie!", "Great minds think alike"]
            let tieresponse = tiechoice[Math.floor(Math.random() * tiechoice.length)]
    
            //If the bot loses, the bot picks from one of these responses randomly
            let winchoice = ["Wow! Your good!", "I'm suprised you beat me", "How?!", "Are you cheating?"]
            let winresponse = winchoice[Math.floor(Math.random() * winchoice.length)]
    
            const chooseArr = ["🗻", "📰", "✂"]
    
            //Sends an embeded message that starts the RPS game.
            let embed = new MessageEmbed()
                .setColor("5500FF")
                .setFooter(message.author.username, message.author.displayAvatarURL({size: 256}))
                .setDescription("Add a reaction to one of these emojis to play the game!")
                .setTimestamp();
            const m = await message.channel.send(embed);
            const reacted = await promptMessage(m, message.author, 30, chooseArr);
    
            //The bot randomly chooses from the arrangement of emojis, the same arrangement the user picked from.
            const botChoice = chooseArr[Math.floor(Math.random() * chooseArr.length)];
    
            //The result is from what the author reacted and from what the bot reacted
            const result = await getResult(reacted, botChoice);
            await m.reactions.removeAll();
            embed
    
                //Edits the embed with the result.
                .setDescription("")
                .addField(result, `${reacted} vs ${botChoice}`);
            m.edit(embed);
    
            //Gets the results from
            function getResult(me, botChosen) 
            {
                if((me === "🗻" && botChosen === "✂") || (me === "📰" && botChosen === "🗻") || (me === "✂" && botChosen === "📰")) {
                    return (winresponse);
            } else if (me === botChosen) {
                return (tieresponse)
            } else {
                return (lostresponse);
            }
        }})();
    };
    
    if(message.content.startsWith(prefix + "restart")){
        //If the user asked for help, send this.
        if(args[1] == "help") {
            let embed = new Discord.MessageEmbed()
                .setTitle("Restart")
                .addField("Usage:", `${prefix}restart`)
                .setDescription("Allows you to restart the bot with this command. (OWNER OF THE bot ONLY)")
                .setColor("003AFF")
                .setTimestamp()
                .setFooter(message.author.username, message.author.displayAvatarURL())
            message.channel.send(embed)
            return
        }
    
        //If the user is not the bot owner, send an error.
        if(message.author.id != "703666314488578238"){
            //Send an embed notifying them of an error.
            let embed = new Discord.MessageEmbed()
                .setTitle("Uh oh!")
                .setDescription("It seems that only Jinsto Nim#6696 can use this command!")
                .setFooter(message.author.username, message.author.displayAvatarURL({size: 256}))
                .setTimestamp()
                .setColor("F00000")
            message.channel.send(embed)
        } else {
            ( async () => {
                await message.channel.send("Restarting...")
                bot.destroy().then(() => bot.login("Token"));
            })();
        };
    };
    
    if(message.content.startsWith(prefix + "userinfo")){
        //If the user asked for help, send this.
        if(args[1] == "help") {
            let embed = new Discord.MessageEmbed()
                .setTitle("User Info")
                .addField("Usage:", `${prefix}userinfo (user)`)
                .setDescription("Allows you to see the info of a user.")
                .setColor("003AFF")
                .setTimestamp()
                .setFooter(message.author.username, message.author.displayAvatarURL())
            message.channel.send(embed)
            return
        }
    
        //Get the user mentioned
        let member = (getMember(message), args.join(" "));
    
        //Get the user's join date, and the roles they have.
        const joined = formatDate(member.joinedAt);
        const role = member.roles.cache
        .filter(r => r.id !==message.guild.id)
        .map(r => r)
        .join(", ") || "none";  
    
        //Get when the user created their account.
        const created = formatDate(member.user.createdAt);
    
        //Get the users status, online, idle, dnd, offline.
        const presence = (member.user.presence.status)
    
        //Send an embed with the information
        const embed = new Discord.MessageEmbed()
            .setFooter(member.displayName, member.user.displayAvatarURL({ size: 256 }))
            .setThumbnail(member.user.displayAvatarURL({ size: 256 }))   
            .addField(`Member information`, stripIndents`**> Nickname:** ${member.displayName} 
            **> Joined at:** ${joined}  
            **> Roles:** ${role}`, true)
            .addField('User information', stripIndents`**> ID:** ${member.user.id} 
            **> Username:** ${member.user.username} 
            **> Created at:** ${created} 
            **> Status:** ` + presence, true)
            .setTimestamp()
            
        //If the user is playing a game, add this field with the game.
        if(member.user.presence.activity){
            embed.addField('Currently Playing:', `**> Name:** ${member.user.presence.activity.name}`); 
        };
        //If the user has a custom status, add this field with the status
        if(member.user.presence.activity){
            embed.addField('Current Status:', `**> Status:** ${member.user.presence.activity.state}`)
        };
    
        //Depending on the presence, set the embed color.
        if(presence === ("online")){
            embed.setColor("1EFC54")
        };
        if(presence === ("idle")){
            embed.setColor("FA8A03")
        };
        if(presence === ("dnd")){
            embed.setColor("FA2103")
        };
        if(presence === ("offline")){
            embed.setColor("6C6B6A")
        }
        message.channel.send(embed);
    };
    
    if(message.content.startsWith((prefix + "info") || (prefix + "information"))){
        //If the user asked for help, send this.
        if(args[1] == "help") {
            let embed = new Discord.MessageEmbed()
                .setTitle("Information")
                .addField("Usage:", `${prefix}info or ${prefix}information`)
                .setDescription("Allows you to see both information of the bot and of the server.")
                .setColor("003AFF")
                .setTimestamp()
                .setFooter(message.author.username, message.author.displayAvatarURL())
            message.channel.send(embed)
            return
        }
    
        //Get the bot's join date, and the roles it has.
        const joined = formatDate(bot.user.joinedAt);
        const role = message.guild.members.cache.get(bot.user.id).roles.cache.map((r) => r)
        .filter(r => r.id !==message.guild.id)
        .join(", ") || "none";  
    
        //Specify guild
        let {guild} = message
        
        //Get when the bot created their account.
        const created = formatDate(bot.user.createdAt);
        
        //Send an embed showing the bot's information
        let embed = new Discord.MessageEmbed()
            .setAuthor("Mioxi")
            .addField(`Bot Information`, stripIndents` **> Nickname:** ${bot.user.username}
            **> Discord.js version:** v12
            **> Joined:** ${joined}
            **> Created:** ${created}
            **> Roles:** ${role}`, true)
            .setTimestamp()
            .setColor("5500FF")
            .setThumbnail(bot.user.displayAvatarURL({ size: 256 }))
            .addField(`Server Information`, stripIndents `**> Name:** ${guild.name}
            **> Created:** ${guild.createdAt}
            **> Member Count:** ${guild.memberCount}
            **> Owner:** <@${guild.ownerID}>
            **> Region:** ${guild.region}`, true)
            .setFooter(message.author.username, message.author.avatarURL())
    message.channel.send(embed)
    };
    
    if(message.content.startsWith(prefix + "members")){
        //If the user asked for help, send this.
        if(args[1] == "help") {
            let embed = new Discord.MessageEmbed()
                .setTitle("Members")
                .addField("Usage:", `${prefix}members`)
                .setDescription("Allows you to see the amount of members in a server")
                .setColor("003AFF")
                .setTimestamp()
                .setFooter(message.author.username, message.author.displayAvatarURL())
            message.channel.send(embed)
            return
        }
    
        //Send an embed with the total number of members in the server.
        let embed = new Discord.MessageEmbed()
            .setAuthor(`${message.guild.name}`)
            .setDescription(`Total: ${message.guild.memberCount}`)
            .setTimestamp()
            .setColor("5500FF")
        message.channel.send(embed)
    };
    
    if(message.content.startsWith(prefix + "youtubesearch")){
        //If the user asked for help, send this.
        if(args[1] == "help") {
            let embed = new Discord.MessageEmbed()
                .setTitle("Youtube Search")
                .addField("Usage:", `${prefix}youtubesearch (youtube videos)`)
                .setDescription("Allows you to search for a youtube video, does not actually bring up a video.")
                .setColor("003AFF")
                .setTimestamp()
                .setFooter(message.author.username, message.author.displayAvatarURL())
            message.channel.send(embed)
            return
        }
    
        //Set the base as the start of the command
        let base = "https://www.youtube.com/results?search_query="
    
        //Define encode as the text after the command, joined with +
        let encode = args.slice(1).join("+");
    
        //Define link as the base + encode
        let link = base + encode
    
        //Send an embed with the youtube link
        let embed = new Discord.MessageEmbed()
            .setAuthor(`${encode}`, "https://www.net-aware.org.uk/siteassets/images-and-icons/application-icons/app-icons-youtube.png?width=270", link)
            .setColor("17A589")
            .setFooter(message.author.username, message.author.displayAvatarURL())
            .setTimestamp()
        message.channel.send(embed);
    };
    
    if(message.content.startsWith(prefix + "clear")){
        //If the user asked for help, send this.
        if(args[1] == "help") {
            let embed = new Discord.MessageEmbed()
                .setTitle("Clear")
                .addField("Usage:", `${prefix}clear (amount)`)
                .setDescription("Allows you to clear a specified amount of messages.")
                .setColor("003AFF")
                .setTimestamp()
                .setFooter(message.author.username, message.author.displayAvatarURL())
            message.channel.send(embed)
            return
        }
    
        //Check to see if the command message is deleteable, if so, delete it.
        if(message.deletable){
            message.delete();
        };
    
        //If the member doesn't have the "MANAGE_MESSAGES" permission, send this error.
        if(!message.member.hasPermission("MANAGE_MESSAGES"))
            return message.channel.send("You must have the manage messages permission to do this.");
    
        //If the user didn't specify a certain number, this error shows up
        if(!args[1])
            return message.channel.send("You must specify a number!");
    
        //If the bot doesn't have the "MANAGE_MESSAGES" permission, send this error.
        if(!message.guild.me.hasPermission("MANAGE_MESSAGES")) 
            return message.channel.send("I cannot delete messages, please add 'MANAGE_MESSAGES' to my role.");
    
        //If the user specified a number over 100, only delete 100, if not, delete the amount specified.
        if(args[1] > 100){
            deleteAmount = 100;
        } else {
            deleteAmount = parseInt(args[1]);
        };
    
        //After the bot deletes the specified amount, send a message saying that they have.
        message.channel.bulkDelete(deleteAmount, true)
            .then(deleted => message.channel.send(`I have deleted \'${deleted.size}\' messages.`));
    };
    
    if(message.content.startsWith(prefix + "addrole")){
        //If the user asked for help, send this.
        if(args[1] == "help") {
            let embed = new Discord.MessageEmbed()
                .setTitle("Add Role")
                .addField("Usage:", `${prefix}addrole (userid)/(@user) (roleid)/(@role)`)
                .setDescription("Allows you to add a role to a user by mentioning or getting the id of the user, and mentioning or getting the id of a role.")
                .setColor("003AFF")
                .setTimestamp()
                .setFooter(message.author.username, message.author.displayAvatarURL())
            message.channel.send(embed)
            return
        }
    
        //Check to see if the author has the permission "MANAGE_ROLES", if not, send this error.
        if(!message.member.hasPermission("MANAGE_ROLES")) return message.channel.send("You need to have the 'MANGE_ROLES' permission to use this command.");
    
        //Check to see if the bot has the permission "MANAGE_ROLES", if not, send this error.
        if(!message.guild.me.hasPermission("MANAGE_ROLES")) return message.channel.send("I need the 'MANGE_ROLES' permission to use this command.");
    
        //Define rMember as the person who they have mentioned, the name of the user, or the user's id. If they didn't specify any, send an error.
        let rMember = message.mentions.members.first() || message.guild.members.cache.find(m => m.user.tag === args[1]) || message.guild.members.cache.get(args[1]);
        if(!rMember) return message.channel.send("Please mention a valid user.");
    
        //Define role as the role they mentioned, the name of the role, or the role's id. If they didn't specify any, send an error.
        let role = message.guild.roles.cache.find(r => r.name == args[2]) || message.guild.roles.cache.find(r => r.id == args[2]) || message.mentions.roles.first();
        if(!role) return message.channel.send("Please provide a role to add to the user");
    
        //Define reason as the reason you added that role to them, if there is no reason, don't send an error.
        let reason = args.slice(3).join(" ");
        if(!reason) reason = "No reason provided";
    
        //If the user already has this role, send this error.
        if(rMember.roles.cache.has(role.id)){
            return message.channel.send(`${rMember.displayName} already has this role!`)
    
        //If they do not have this role, do the following.
        } else {
            ( async () => {
                //Add the role to the user.
                await rMember.roles.add(role.id).catch(e => console.log(e.message))
    
                //Send an embeded message specifying the role added, and the person who it was added to.
                let embed = new Discord.MessageEmbed()
                    .addField("Role added.", stripIndents `**Role:** 
                    > ${role.name}
                    **Added to:** 
                    > ${rMember.displayName}
                    **Added by:** 
                    > ${message.author.username}
                    **Reason:** 
                    > ${reason}`)
                    .setFooter(message.author.username, message.author.displayAvatarURL())
                    .setColor("0FFF00")
                    .setTimestamp()
                message.channel.send(embed)
            })();
        };
    };
    
    if(message.content.startsWith(prefix + "removerole")){
        //If the user asked for help, send this.
        if(args[1] == "help") {
            let embed = new Discord.MessageEmbed()
                .setTitle("Remove Role")
                .addField("Usage:", `${prefix}removerole (@user)/(userid) (@role)/(role)`)
                .setDescription("Allows you to remove a role from a user by mentioning or getting the id from a user, and mentioning or getting the id from a role.")
                .setColor("003AFF")
                .setTimestamp()
                .setFooter(message.author.username, message.author.displayAvatarURL())
            message.channel.send(embed)
            return
        }
    
        //If the author doesn't have the "MANAGE_ROLES" permission, send this error
        if(!message.member.hasPermission("MANAGE_ROLES")) return message.channel.send("You need to have the 'MANGE_ROLES' permission to use this command.");
    
        //If the bot doesn't have the "MANAGE_ROLES" permission, send this error
        if(!message.guild.me.hasPermission("MANAGE_ROLES")) return message.channel.send("I need the 'MANGE_ROLES' permission to use this command.");
    
        //Define rMember as the person who they have mentioned, the name of the user, or the user's id. If they didn't specify any, send an error. 
        let rMember = message.mentions.members.first() || message.guild.members.cache.find(m => m.user.tag === args[1]) || message.guild.members.cache.get(args[1]);
        if(!rMember) return message.channel.send("Please mention a valid user.");
    
        //Define rMember as the role they have mentioned, the name of the role, or the roles's id. If they didn't specify any, send an error.
        let role = message.guild.roles.cache.find(r => r.name == args[2]) || message.guild.roles.cache.find(r => r.id == args[2]) || message.mentions.roles.first();
        if(!role) return message.channel.send("Please provide a role to remove from the user");
    
        //Check to see if a reason is specified, if not, say no reasn provided
        let reason = args.slice(3).join(" ");
        if(!reason) reason = "No reason provided";
    
        //If the user mentioned doesn't have the role, send this error
        if(!rMember.roles.cache.has(role.id)){
            return message.channel.send(`${rMember.displayName} doesn't have this role!`)
    
        //If they do have this role, do the following
        } else {
            ( async () => {
                //Remove the role from the user
                await rMember.roles.remove(role.id)
    
                //Send an embed notifying the user of the role remova
                let embed = new Discord.MessageEmbed()
                    .addField("Role removed.", stripIndents `**Role:** 
                    > ${role.name}
                    **Removed from:** 
                    > ${rMember.displayName}
                    **Removed by:** 
                    > ${message.author.username}
                    **Reason:** 
                    > ${reason}`)
                    .setFooter(message.author.username, message.author.displayAvatarURL())
                    .setColor("F00000")
                    .setTimestamp()
                message.channel.send(embed)
            })();
        };
    };
    
    if(message.content.startsWith(prefix + "eval")){
        //If the user asked for help, send this.
        if(args[1] == "help") {
            let embed = new Discord.MessageEmbed()
                .setTitle("eval")
                .addField("Usage:", `${prefix}eval (command)`)
                .setDescription("Allows you to test a command using the bot. (bot OWNER ONLY)")
                .setColor("003AFF")
                .setTimestamp()
                .setFooter(message.author.username, message.author.displayAvatarURL())
            message.channel.send(embed)
            return
        }
    
        //Check to see if the user of this command is the owner, if not, cancel.
        if(message.author.id !== "703666314488578238") return message.channel.send("Only the owner can use this command.");
    
        let util = require("util")
    
        //Define toEval as the text after the command.
        let toEval = args.slice(1).join(" ");
    
        let evaluated = util.inspect(eval(toEval, { depth: 0}))
    
        //If there is no toEval, cancel.
        if(!toEval) {
            return message.channel.send("Error whilst evaluating: ``cannot evaluate air``")
        };
    
        //Send an embed with the evaluation
        let embed = new Discord.MessageEmbed()
            .setTitle("Evaluated Successfully")
            .addField("Said:", "```" + toEval +"```")
            .addField("Output:", `${evaluated}`)
            .setColor("0FFF00")
            .setTimestamp()
        message.channel.send(embed);
    };
    
    if(message.content.startsWith(prefix + "typing")){
        //If the user asked for help, send this.
        if(args[1] == "help") {
            let embed = new Discord.MessageEmbed()
                .setTitle("Typing")
                .addField("Usage:", `${prefix}typing`)
                .setDescription("Tests your typing speed by giving you a paragraph to type.")
                .setColor("003AFF")
                .setTimestamp()
                .setFooter(message.author.username, message.author.displayAvatarURL())
            message.channel.send(embed)
            return
        }
    
        ( async () => {
            //Number of paragraphs the bot has available
            let number = 10;
    
            //Picks a random number, and picks the case with that number to be sent.
            var random = Math.floor (Math.random() * (number - 1 + 1)) + 1;
    
            switch (random) {
                case 1: 
                //Send an embed with the sentence for the user to type.
                let embed = new Discord.MessageEmbed().setTitle("Type the sentence below")
                    .setDescription("The wolves stopped in their tracks, sizing up the mother and her cubs. It had been over a week since their last meal and they were getting desperate. The cubs would make a good meal, but there were high risks taking on the mother Grizzly. A decision had to be made and the wrong choice could signal the end of the pack.")
                    .setColor("003AFF")
                    .setTimestamp()
                    .setFooter("You have 3 minutes!")
                message.channel.send(embed)
    
                //Filter out if the user who typed it out is the author
                const filter = m => m.author.id === message.author.id;
    
                message.channel.awaitMessages(filter, {max: 1, time: 180000})
                .then(collected => {
                    //Define time2 as how long the author was typing
                    let time2 = message.author.typingDurationIn(message.channel)
    
                    //Find how many minutes it took to type.
                    const sec = Math.floor((time2 / 1000) % 60).toString();
                    const min = (((sec / 60) % 60).toFixed(2)).toString();
    
                    //Find out words per minute
                    const wpm = Math.floor((62 / min)).toString();
    
                    //Check to see if what the user typed is what the bot told you to type
                    if(collected.first().content === ("The wolves stopped in their tracks, sizing up the mother and her cubs. It had been over a week since their last meal and they were getting desperate. The cubs would make a good meal, but there were high risks taking on the mother Grizzly. A decision had to be made and the wrong choice could signal the end of the pack.") || collected.first().content === ("the wolves stopped in their tracks, sizing up the mother and her cubs. it had been over a week since their last meal and they were getting desperate. the cubs would make a good meal, but there were high risks taking on the mother grizzly. a decision had to be made and the wrong choice could signal the end of the pack."))
                    {
    
                        //Send an embeded message if the user has successfully typed it out, and send them their time.
                        let embed = new Discord.MessageEmbed().setTitle("Congrats!")
                            .setDescription(`You typed it out with a time of: ${sec} seconds (Or ${min} minutes)! Your typing speed is ${wpm} wpm!`)
                            .setColor("0FFF00")
                            .setTimestamp()
                        return message.channel.send(embed);
                    } else {
                        //Send an embeded message if the user failed to type the sentence correctly.
                        let embed = new Discord.MessageEmbed()
                            .setTitle("❌")
                            .setDescription("You failed to type the sentence correctly!")
                            .setColor("FF0000")
                            .setTimestamp()
                        return message.channel.send(embed)
                    };
                }).catch(err =>{
                    //Send an embeded message if the user failed to type the sentence in time
                    let embed = new Discord.MessageEmbed()
                        .setTitle("❌")
                        .setDescription("You failed to type the sentence in time!")
                        .setColor("FF0000")
                        .setTimestamp()
                    message.channel.send(embed)
                })
            }
            switch (random) {
                case 2: 
                //Send an embed with the sentence for the user to type.
                let embed = new Discord.MessageEmbed().setTitle("Type the sentence below")
                    .setDescription("The trees, therefore, must be such old and primitive techniques that they thought nothing of them, deeming them so inconsequential that even savages like us would know of them and not be suspicious. At that, they probably didn't have too much time after they detected us orbiting and intending to land. And if that were true, there could be only one place where their civilization was hidden.")
                    .setColor("003AFF")
                    .setTimestamp()
                    .setFooter("You have 3 minutes!")
                message.channel.send(embed)
    
                //Filter out if the user who typed it out is the author
                const filter = m => m.author.id === message.author.id;
    
                message.channel.awaitMessages(filter, {max: 1, time: 180000})
                .then(collected => {
                    //Define time2 as how long the author was typing
                    let time2 = message.author.typingDurationIn(message.channel)
    
                    //Find how many minutes it took to type.
                    const sec = Math.floor((time2 / 1000) % 60).toString();
                    const min = (((sec / 60) % 60).toFixed(2)).toString();
    
                    //Find out words per minute
                    const wpm = Math.floor((67 / min)).toString();
    
                    //Check to see if what the user typed is what the bot told you to type
                    if(collected.first().content === ("The trees, therefore, must be such old and primitive techniques that they thought nothing of them, deeming them so inconsequential that even savages like us would know of them and not be suspicious. At that, they probably didn't have too much time after they detected us orbiting and intending to land. And if that were true, there could be only one place where their civilization was hidden.") || collected.first().content === ("the trees, therefore, must be such old and primitive techniques that they thought nothing of them, deeming them so inconsequential that even savages like us would know of them and not be suspicious. at that, they probably didn't have too much time after they detected us orbiting and intending to land. and if that were true, there could be only one place where their civilization was hidden."))
                    {
    
                        //Send an embeded message if the user has successfully typed it out, and send them their time.
                        let embed = new Discord.MessageEmbed().setTitle("Congrats!")
                            .setDescription(`You typed it out with a time of: ${sec} seconds (Or ${min} minutes)! Your typing speed is ${wpm} wpm!`)
                            .setColor("0FFF00")
                            .setTimestamp()
                        return message.channel.send(embed);
                    } else {
                        //Send an embeded message if the user failed to type the sentence correctly.
                        let embed = new Discord.MessageEmbed()
                            .setTitle("❌")
                            .setDescription("You failed to type the sentence correctly!")
                            .setColor("FF0000")
                            .setTimestamp()
                        return message.channel.send(embed)
                    };
                }).catch(err =>{
                    //Send an embeded message if the user failed to type the sentence in time
                    let embed = new Discord.MessageEmbed()
                        .setTitle("❌")
                        .setDescription("You failed to type the sentence in time!")
                        .setColor("FF0000")
                        .setTimestamp()
                    message.channel.send(embed)
                })
            }
            switch (random) {
                case 3: 
                //Send an embed with the sentence for the user to type.
                let embed = new Discord.MessageEmbed().setTitle("Type the sentence below")
                    .setDescription("She nervously peered over the edge. She understood in her mind that the view was supposed to be beautiful, but all she felt was fear. There had always been something about heights that disturbed her, and now she could feel the full force of this unease. She reluctantly crept a little closer with the encouragement of her friends as the fear continued to build. She couldn't help but feel that something horrible was about to happen.")
                    .setColor("003AFF")
                    .setTimestamp()
                    .setFooter("You have 3 minutes!")
                message.channel.send(embed)
    
                //Filter out if the user who typed it out is the author
                const filter = m => m.author.id === message.author.id;
    
                message.channel.awaitMessages(filter, {max: 1, time: 180000})
                .then(collected => {
                    //Define time2 as how long the author was typing
                    let time2 = message.author.typingDurationIn(message.channel)
    
                    //Find how many minutes it took to type.
                    const sec = Math.floor((time2 / 1000) % 60).toString();
                    const min = (((sec / 60) % 60).toFixed(2)).toString();
    
                    //Find out words per minute
                    const wpm = Math.floor((76 / min)).toString();
    
                    //Check to see if what the user typed is what the bot told you to type
                    if(collected.first().content === ("She nervously peered over the edge. She understood in her mind that the view was supposed to be beautiful, but all she felt was fear. There had always been something about heights that disturbed her, and now she could feel the full force of this unease. She reluctantly crept a little closer with the encouragement of her friends as the fear continued to build. She couldn't help but feel that something horrible was about to happen.") || collected.first().content === ("she nervously peered over the edge. she understood in her mind that the view was supposed to be beautiful, but all she felt was fear. there had always been something about heights that disturbed her, and now she could feel the full force of this unease. she reluctantly crept a little closer with the encouragement of her friends as the fear continued to build. she couldn't help but feel that something horrible was about to happen."))
                    {
    
                        //Send an embeded message if the user has successfully typed it out, and send them their time.
                        let embed = new Discord.MessageEmbed().setTitle("Congrats!")
                            .setDescription(`You typed it out with a time of: ${sec} seconds (Or ${min} minutes)! Your typing speed is ${wpm} wpm!`)
                            .setColor("0FFF00")
                            .setTimestamp()
                        return message.channel.send(embed);
                    } else {
                        //Send an embeded message if the user failed to type the sentence correctly.
                        let embed = new Discord.MessageEmbed()
                            .setTitle("❌")
                            .setDescription("You failed to type the sentence correctly!")
                            .setColor("FF0000")
                            .setTimestamp()
                        return message.channel.send(embed)
                    };
                }).catch(err =>{
                    //Send an embeded message if the user failed to type the sentence in time
                    let embed = new Discord.MessageEmbed()
                        .setTitle("❌")
                        .setDescription("You failed to type the sentence in time!")
                        .setColor("FF0000")
                        .setTimestamp()
                    message.channel.send(embed)
                })
            }
            switch (random) {
                case 4: 
                //Send an embed with the sentence for the user to type.
                let embed = new Discord.MessageEmbed().setTitle("Type the sentence below")
                    .setDescription("The amber droplet hung from the branch, reaching fullness and ready to drop. It waited. While many of the other droplets were satisfied to form as big as they could and release, this droplet had other plans. It wanted to be part of history. It wanted to be remembered long after all the other droplets had dissolved into history. So it waited for the perfect specimen to fly by to trap and capture that it hoped would eventually be discovered hundreds of years in the future.")
                    .setColor("003AFF")
                    .setTimestamp()
                    .setFooter("You have 3 minutes!")
                message.channel.send(embed)
    
                //Filter out if the user who typed it out is the author
                const filter = m => m.author.id === message.author.id;
    
                message.channel.awaitMessages(filter, {max: 1, time: 180000})
                .then(collected => {
                    //Define time2 as how long the author was typing
                    let time2 = message.author.typingDurationIn(message.channel)
    
                    //Find how many minutes it took to type.
                    const sec = Math.floor((time2 / 1000) % 60).toString();
                    const min = (((sec / 60) % 60).toFixed(2)).toString();
    
                    //Find out words per minute
                    const wpm = Math.floor((86 / min)).toString();
    
                    //Check to see if what the user typed is what the bot told you to type
                    if(collected.first().content === ("The amber droplet hung from the branch, reaching fullness and ready to drop. It waited. While many of the other droplets were satisfied to form as big as they could and release, this droplet had other plans. It wanted to be part of history. It wanted to be remembered long after all the other droplets had dissolved into history. So it waited for the perfect specimen to fly by to trap and capture that it hoped would eventually be discovered hundreds of years in the future.") || collected.first().content === ("she nervously peered over the edge. she understood in her mind that the view was supposed to be beautiful, but all she felt was fear. there had always been something about heights that disturbed her, and now she could feel the full force of this unease. she reluctantly crept a little closer with the encouragement of her friends as the fear continued to build. she couldn't help but feel that something horrible was about to happen."))
                    {
    
                        //Send an embeded message if the user has successfully typed it out, and send them their time.
                        let embed = new Discord.MessageEmbed().setTitle("Congrats!")
                            .setDescription(`You typed it out with a time of: ${sec} seconds (Or ${min} minutes)! Your typing speed is ${wpm} wpm!`)
                            .setColor("0FFF00")
                            .setTimestamp()
                        return message.channel.send(embed);
                    } else {
                        //Send an embeded message if the user failed to type the sentence correctly.
                        let embed = new Discord.MessageEmbed()
                            .setTitle("❌")
                            .setDescription("You failed to type the sentence correctly!")
                            .setColor("FF0000")
                            .setTimestamp()
                        return message.channel.send(embed)
                    };
                }).catch(err =>{
                    //Send an embeded message if the user failed to type the sentence in time
                    let embed = new Discord.MessageEmbed()
                        .setTitle("❌")
                        .setDescription("You failed to type the sentence in time!")
                        .setColor("FF0000")
                        .setTimestamp()
                    message.channel.send(embed)
                })
            }
            switch (random) {
                case 5: 
                //Send an embed with the sentence for the user to type.
                let embed = new Discord.MessageEmbed().setTitle("Type the sentence below")
                    .setDescription("This is important to remember. Love isn't like pie. You don't need to divide it among all your friends and loved ones. No matter how much love you give, you can always give more. It doesn't run out, so don't try to hold back giving it as if it may one day run out. Give it freely and as much as you want.")
                    .setColor("003AFF")
                    .setTimestamp()
                    .setFooter("You have 3 minutes!")
                message.channel.send(embed)
    
                //Filter out if the user who typed it out is the author
                const filter = m => m.author.id === message.author.id;
    
                message.channel.awaitMessages(filter, {max: 1, time: 180000})
                .then(collected => {
                    //Define time2 as how long the author was typing
                    let time2 = message.author.typingDurationIn(message.channel)
    
                    //Find how many minutes it took to type.
                    const sec = Math.floor((time2 / 1000) % 60).toString();
                    const min = (((sec / 60) % 60).toFixed(2)).toString();
    
                    //Find out words per minute
                    const wpm = Math.floor((63 / min)).toString();
    
                    //Check to see if what the user typed is what the bot told you to type
                    if(collected.first().content === ("This is important to remember. Love isn't like pie. You don't need to divide it among all your friends and loved ones. No matter how much love you give, you can always give more. It doesn't run out, so don't try to hold back giving it as if it may one day run out. Give it freely and as much as you want.") || collected.first().content === ("this is important to remember. love isn't like pie. you don't need to divide it among all your friends and loved ones. no matter how much love you give, you can always give more. it doesn't run out, so don't try to hold back giving it as if it may one day run out. give it freely and as much as you want."))
                    {
    
                        //Send an embeded message if the user has successfully typed it out, and send them their time.
                        let embed = new Discord.MessageEmbed().setTitle("Congrats!")
                            .setDescription(`You typed it out with a time of: ${sec} seconds (Or ${min} minutes)! Your typing speed is ${wpm} wpm!`)
                            .setColor("0FFF00")
                            .setTimestamp()
                        return message.channel.send(embed);
                    } else {
                        //Send an embeded message if the user failed to type the sentence correctly.
                        let embed = new Discord.MessageEmbed()
                            .setTitle("❌")
                            .setDescription("You failed to type the sentence correctly!")
                            .setColor("FF0000")
                            .setTimestamp()
                        return message.channel.send(embed)
                    };
                }).catch(err =>{
                    //Send an embeded message if the user failed to type the sentence in time
                    let embed = new Discord.MessageEmbed()
                        .setTitle("❌")
                        .setDescription("You failed to type the sentence in time!")
                        .setColor("FF0000")
                        .setTimestamp()
                    message.channel.send(embed)
                })
            };
            switch (random) {
                case 6: 
                //Send an embed with the sentence for the user to type.
                let embed = new Discord.MessageEmbed().setTitle("Type the sentence below")
                    .setDescription("He walked down the steps from the train station in a bit of a hurry knowing the secrets in the briefcase must be secured as quickly as possible. Bounding down the steps, he heard something behind him and quickly turned in a panic. There was nobody there but a pair of old worn-out shoes were placed neatly on the steps he had just come down. Had he past them without seeing them? It didn't seem possible. He was about to turn and be on his way when a deep chill filled his body.")
                    .setColor("003AFF")
                    .setTimestamp()
                    .setFooter("You have 3 minutes!")
                message.channel.send(embed)
    
                //Filter out if the user who typed it out is the author
                const filter = m => m.author.id === message.author.id;
    
                message.channel.awaitMessages(filter, {max: 1, time: 180000})
                .then(collected => {
                    //Define time2 as how long the author was typing
                    let time2 = message.author.typingDurationIn(message.channel)
    
                    //Find how many minutes it took to type.
                    const sec = Math.floor((time2 / 1000) % 60).toString();
                    const min = (((sec / 60) % 60).toFixed(2)).toString();
    
                    //Find out words per minute
                    const wpm = Math.floor((93 / min)).toString();
    
                    //Check to see if what the user typed is what the bot told you to type
                    if(collected.first().content === ("He walked down the steps from the train station in a bit of a hurry knowing the secrets in the briefcase must be secured as quickly as possible. Bounding down the steps, he heard something behind him and quickly turned in a panic. There was nobody there but a pair of old worn-out shoes were placed neatly on the steps he had just come down. Had he past them without seeing them? It didn't seem possible. He was about to turn and be on his way when a deep chill filled his body.") || collected.first().content === ("he walked down the steps from the train station in a bit of a hurry knowing the secrets in the briefcase must be secured as quickly as possible. bounding down the steps, he heard something behind him and quickly turned in a panic. there was nobody there but a pair of old worn-out shoes were placed neatly on the steps he had just come down. had he past them without seeing them? it didn't seem possible. he was about to turn and be on his way when a deep chill filled his body."))
                    {
    
                        //Send an embeded message if the user has successfully typed it out, and send them their time.
                        let embed = new Discord.MessageEmbed().setTitle("Congrats!")
                            .setDescription(`You typed it out with a time of: ${sec} seconds (Or ${min} minutes)! Your typing speed is ${wpm} wpm!`)
                            .setColor("0FFF00")
                            .setTimestamp()
                        return message.channel.send(embed);
                    } else {
                        //Send an embeded message if the user failed to type the sentence correctly.
                        let embed = new Discord.MessageEmbed()
                            .setTitle("❌")
                            .setDescription("You failed to type the sentence correctly!")
                            .setColor("FF0000")
                            .setTimestamp()
                        return message.channel.send(embed)
                    };
                }).catch(err =>{
                    //Send an embeded message if the user failed to type the sentence in time
                    let embed = new Discord.MessageEmbed()
                        .setTitle("❌")
                        .setDescription("You failed to type the sentence in time!")
                        .setColor("FF0000")
                        .setTimestamp()
                    message.channel.send(embed)
                })
            };
            
            switch (random) {
                case 7: 
                //Send an embed with the sentence for the user to type.
                let embed = new Discord.MessageEmbed().setTitle("Type the sentence below")
                    .setDescription("Sometimes it's the first moment of the day that catches you off guard. That's what Wendy was thinking. She opened her window to see fire engines screeching down the street. While this wasn't something completely unheard of, it also wasn't normal. It was a sure sign of what was going to happen that day. She could feel it in her bones and it wasn't the way she wanted the day to begin.")
                    .setColor("003AFF")
                    .setTimestamp()
                    .setFooter("You have 3 minutes!")
                message.channel.send(embed)
    
                //Filter out if the user who typed it out is the author
                const filter = m => m.author.id === message.author.id;
    
                message.channel.awaitMessages(filter, {max: 1, time: 180000})
                .then(collected => {
                    //Define time2 as how long the author was typing
                    let time2 = message.author.typingDurationIn(message.channel)
    
                    //Find how many minutes it took to type.
                    const sec = Math.floor((time2 / 1000) % 60).toString();
                    const min = (((sec / 60) % 60).toFixed(2)).toString();
    
                    //Find out words per minute
                    const wpm = Math.floor((72 / min)).toString();
    
                    //Check to see if what the user typed is what the bot told you to type
                    if(collected.first().content === ("Sometimes it's the first moment of the day that catches you off guard. That's what Wendy was thinking. She opened her window to see fire engines screeching down the street. While this wasn't something completely unheard of, it also wasn't normal. It was a sure sign of what was going to happen that day. She could feel it in her bones and it wasn't the way she wanted the day to begin.") || collected.first().content === ("sometimes it's the first moment of the day that catches you off guard. that's what wendy was thinking. she opened her window to see fire engines screeching down the street. while this wasn't something completely unheard of, it also wasn't normal. it was a sure sign of what was going to happen that day. she could feel it in her bones and it wasn't the way she wanted the day to begin."))
                    {
    
                        //Send an embeded message if the user has successfully typed it out, and send them their time.
                        let embed = new Discord.MessageEmbed().setTitle("Congrats!")
                            .setDescription(`You typed it out with a time of: ${sec} seconds (Or ${min} minutes)! Your typing speed is ${wpm} wpm!`)
                            .setColor("0FFF00")
                            .setTimestamp()
                        return message.channel.send(embed);
                    } else {
                        //Send an embeded message if the user failed to type the sentence correctly.
                        let embed = new Discord.MessageEmbed()
                            .setTitle("❌")
                            .setDescription("You failed to type the sentence correctly!")
                            .setColor("FF0000")
                            .setTimestamp()
                        return message.channel.send(embed)
                    };
                }).catch(err =>{
                    //Send an embeded message if the user failed to type the sentence in time
                    let embed = new Discord.MessageEmbed()
                        .setTitle("❌")
                        .setDescription("You failed to type the sentence in time!")
                        .setColor("FF0000")
                        .setTimestamp()
                    message.channel.send(embed)
                })
            };
    
            switch (random) {
                case 8: 
                //Send an embed with the sentence for the user to type.
                let embed = new Discord.MessageEmbed().setTitle("Type the sentence below")
                    .setDescription("Her mom had warned her. She had been warned time and again, but she had refused to believe her. She had done everything right and she knew she would be rewarded for doing so with the promotion. So when the promotion was given to her main rival, it not only stung, it threw her belief system into disarray. It was her first big lesson in life, but not the last.")
                    .setColor("003AFF")
                    .setTimestamp()
                    .setFooter("You have 3 minutes!")
                message.channel.send(embed)
    
                //Filter out if the user who typed it out is the author
                const filter = m => m.author.id === message.author.id;
    
                message.channel.awaitMessages(filter, {max: 1, time: 180000})
                .then(collected => {
                    //Define time2 as how long the author was typing
                    let time2 = message.author.typingDurationIn(message.channel)
    
                    //Find how many minutes it took to type.
                    const sec = Math.floor((time2 / 1000) % 60).toString();
                    const min = (((sec / 60) % 60).toFixed(2)).toString();
    
                    //Find out words per minute
                    const wpm = Math.floor((70 / min)).toString();
    
                    //Check to see if what the user typed is what the bot told you to type
                    if(collected.first().content === ("Her mom had warned her. She had been warned time and again, but she had refused to believe her. She had done everything right and she knew she would be rewarded for doing so with the promotion. So when the promotion was given to her main rival, it not only stung, it threw her belief system into disarray. It was her first big lesson in life, but not the last.") || collected.first().content === ("her mom had warned her. she had been warned time and again, but she had refused to believe her. she had done everything right and she knew she would be rewarded for doing so with the promotion. so when the promotion was given to her main rival, it not only stung, it threw her belief system into disarray. it was her first big lesson in life, but not the last."))
                    {
    
                        //Send an embeded message if the user has successfully typed it out, and send them their time.
                        let embed = new Discord.MessageEmbed().setTitle("Congrats!")
                            .setDescription(`You typed it out with a time of: ${sec} seconds (Or ${min} minutes)! Your typing speed is ${wpm} wpm!`)
                            .setColor("0FFF00")
                            .setTimestamp()
                        return message.channel.send(embed);
                    } else {
                        //Send an embeded message if the user failed to type the sentence correctly.
                        let embed = new Discord.MessageEmbed()
                            .setTitle("❌")
                            .setDescription("You failed to type the sentence correctly!")
                            .setColor("FF0000")
                            .setTimestamp()
                        return message.channel.send(embed)
                    };
                }).catch(err =>{
                    //Send an embeded message if the user failed to type the sentence in time
                    let embed = new Discord.MessageEmbed()
                        .setTitle("❌")
                        .setDescription("You failed to type the sentence in time!")
                        .setColor("FF0000")
                        .setTimestamp()
                    message.channel.send(embed)
                })
            };
    
            switch (random) {
                case 9: 
                //Send an embed with the sentence for the user to type.
                let embed = new Discord.MessageEmbed().setTitle("Type the sentence below")
                    .setDescription("The young man wanted a role model. He looked long and hard in his youth, but that role model never materialized. His only choice was to embrace all the people in his life he didn't want to be like.")
                    .setColor("003AFF")
                    .setTimestamp()
                    .setFooter("You have 3 minutes!")
                message.channel.send(embed)
    
                //Filter out if the user who typed it out is the author
                const filter = m => m.author.id === message.author.id;
    
                message.channel.awaitMessages(filter, {max: 1, time: 180000})
                .then(collected => {
                    //Define time2 as how long the author was typing
                    let time2 = message.author.typingDurationIn(message.channel)
    
                    //Find how many minutes it took to type.
                    const sec = Math.floor((time2 / 1000) % 60).toString();
                    const min = (((sec / 60) % 60).toFixed(2)).toString();
    
                    //Find out words per minute
                    const wpm = Math.floor((39 / min)).toString();
    
                    //Check to see if what the user typed is what the bot told you to type
                    if(collected.first().content === ("The young man wanted a role model. He looked long and hard in his youth, but that role model never materialized. His only choice was to embrace all the people in his life he didn't want to be like.") || collected.first().content === ("the young man wanted a role model. he looked long and hard in his youth, but that role model never materialized. his only choice was to embrace all the people in his life he didn't want to be like."))
                    {
    
                        //Send an embeded message if the user has successfully typed it out, and send them their time.
                        let embed = new Discord.MessageEmbed().setTitle("Congrats!")
                            .setDescription(`You typed it out with a time of: ${sec} seconds (Or ${min} minutes)! Your typing speed is ${wpm} wpm!`)
                            .setColor("0FFF00")
                            .setTimestamp()
                        return message.channel.send(embed);
                    } else {
                        //Send an embeded message if the user failed to type the sentence correctly.
                        let embed = new Discord.MessageEmbed()
                            .setTitle("❌")
                            .setDescription("You failed to type the sentence correctly!")
                            .setColor("FF0000")
                            .setTimestamp()
                        return message.channel.send(embed)
                    };
                }).catch(err =>{
                    //Send an embeded message if the user failed to type the sentence in time
                    let embed = new Discord.MessageEmbed()
                        .setTitle("❌")
                        .setDescription("You failed to type the sentence in time!")
                        .setColor("FF0000")
                        .setTimestamp()
                    message.channel.send(embed)
                })
            };
    
            switch (random) {
                case 10: 
                //Send an embed with the sentence for the user to type.
                let embed = new Discord.MessageEmbed()
                    .setTitle("Type the sentence below")
                    .setDescription("It was their first date and she had been looking forward to it the entire week. She had her eyes on him for months, and it had taken a convoluted scheme with several friends to make it happen, but he'd finally taken the hint and asked her out. After all the time and effort she'd invested into it, she never thought that it would be anything but wonderful. It goes without saying that things didn't work out quite as she expected.")
                    .setColor("003AFF")
                    .setTimestamp()
                    .setFooter("You have 3 minutes!")
                message.channel.send(embed)
    
                //Filter out if the user who typed it out is the author
                const filter = m => m.author.id === message.author.id;
    
                message.channel.awaitMessages(filter, {max: 1, time: 180000})
                .then(collected => {
                    //Define time2 as how long the author was typing
                    let time2 = message.author.typingDurationIn(message.channel)
    
                    //Find how many minutes it took to type.
                    const sec = Math.floor((time2 / 1000) % 60).toString();
                    const min = (((sec / 60) % 60).toFixed(2)).toString();
    
                    //Find out words per minute
                    const wpm = Math.floor((81 / min)).toString();
    
                    //Check to see if what the user typed is what the bot told you to type
                    if(collected.first().content === ("It was their first date and she had been looking forward to it the entire week. She had her eyes on him for months, and it had taken a convoluted scheme with several friends to make it happen, but he'd finally taken the hint and asked her out. After all the time and effort she'd invested into it, she never thought that it would be anything but wonderful. It goes without saying that things didn't work out quite as she expected.") || collected.first().content === ("it was their first date and she had been looking forward to it the entire week. she had her eyes on him for months, and it had taken a convoluted scheme with several friends to make it happen, but he'd finally taken the hint and asked her out. after all the time and effort she'd invested into it, she never thought that it would be anything but wonderful. it goes without saying that things didn't work out quite as she expected."))
                    {
    
                        //Send an embeded message if the user has successfully typed it out, and send them their time.
                        let embed = new Discord.MessageEmbed().setTitle("Congrats!")
                            .setDescription(`You typed it out with a time of: ${sec} seconds (Or ${min} minutes)! Your typing speed is ${wpm} wpm!`)
                            .setColor("0FFF00")
                            .setTimestamp()
                        return message.channel.send(embed);
                    } else {
                        //Send an embeded message if the user failed to type the sentence correctly.
                        let embed = new Discord.MessageEmbed()
                            .setTitle("❌")
                            .setDescription("You failed to type the sentence correctly!")
                            .setColor("FF0000")
                            .setTimestamp()
                        return message.channel.send(embed)
                    };
                }).catch(err =>{
                    //Send an embeded message if the user failed to type the sentence in time
                    let embed = new Discord.MessageEmbed()
                        .setTitle("❌")
                        .setDescription("You failed to type the sentence in time!")
                        .setColor("FF0000")
                        .setTimestamp()
                    message.channel.send(embed)
                })
            };
        })();
    };
    if(message.content.startsWith(prefix + "serverinvite")){
        ( async () => {
        //If the user doesn't have the permission "Create Instant Invite", return and send them a message
        //If the user has the permission "Create Instant Invite", allow them to continue
        if(!message.member.hasPermission("CREATE_INSTANT_INVITE")) return message.channel.send("Sorry, but you are lacking the ``CREATE_INSTANT_INVITE`` permission");

        //Send an Embeded Message asking how long the invite should last
        let embed = new Discord.MessageEmbed()
            .setTitle("Discord Server Invite")
            .setDescription("How long do you want this invite to last? (In Hours; 0 for infinite)")
            .setColor("003AFF")
            .setTimestamp()
            .setFooter(message.author.username, message.author.displayAvatarURL())
        const m1 = await message.channel.send(embed);

        //Filter out if the user who typed it out is the author
        const filter = m => m.author.id === message.author.id;

        message.channel.awaitMessages(filter, {max: 1, time: 180000})
        .then(collected => {
            //Get how many hours they specified, and turn it into seconds
            let hrs = collected.first().content
            const sec = Math.floor((hrs * 60) * 60).toString();
            embed
                .setDescription("How many uses can it have? (0 for infinite)")
            m1.edit(embed)
            //Send an Embeded Message asking how many uses the invite can have
            message.channel.awaitMessages(filter, {max: 1, time: 180000})
            .then(collected => {
                const uses = collected.first().content
                
                //Get the server Icon
                var serverIcon = message.guild.iconURL()
                
                //Send an Embeded Message containing the invite
                message.channel.createInvite({ unique: true, temporary: false, maxAge: sec, maxUses: uses }).then(invite => {
                    embed
                        .setTitle("Invite Created Successfully")
                        .setThumbnail(serverIcon)
                        .setDescription(`https://discord.gg/${invite.code}`)
                    m1.edit(embed)
                    
                    //Bulk delete the messages sent by the user
                    message.channel.messages.fetch({
                        limit: 3
                    }).then((messages) => { 
                        const authormessages = [];
                        messages.filter(m => m.author.id === message.author.id).forEach(message => authormessages.push(message))
                        message.channel.bulkDelete(authormessages)
                    });
                }).catch(err =>{
                    //Send an embeded message if the user failed to type the sentence in time
                    let embed = new Discord.MessageEmbed()
                        .setTitle("Error")
                        .setDescription("Use Numbers when specifying duration/uses.")
                        .setColor("FF0000")
                        .setTimestamp()
                    message.channel.send(embed)
                })
            })
    })
})();
    }
    if(message.content.startsWith(prefix + "calculate")){
        try {
            //Send an embeded message if the calculation is successful
            let embed = new Discord.MessageEmbed()
                .setTitle("Calculation Complete")
                .addField('Question', args.slice(1).join(" "))
                .addField('Solution', math.evaluate(args.slice(1).join(" ")))
                .setColor("0FFF00")
                .setTimestamp()
                .setFooter(message.author.username, message.author.displayAvatarURL())
            message.channel.send(embed)
        } catch (err) {
            //Send an embeded message if the calculation failed
            let embed = new Discord.MessageEmbed()
                .setTitle("Calculation Failed")
                .addField('Reason:', `${args.slice(1).join(" ")} is not a valid equation`)
                .setColor("F00000")
                .setTimestamp()
                .setFooter(message.author.username, message.author.displayAvatarURL())
            message.channel.send(embed)
        }
    };
    if(message.content.startsWith(prefix + "timestamp")){
        //Check to see if the user has put anything after the command, if not, send a message containing all of the prefixes
        if(!args[1]) return(
            message.channel.send(
                new MessageEmbed()
                    .setTitle("List of Prefixes")
                    .addField("Prefixes", "``f`` - Short Date Time \n ``F`` - Long Date Time \n ``d`` - Short Date \n ``D`` - Long Date  \n ``t`` - Short Time \n ``T`` - Long Time \n ``R`` - Relative Time")
                    .setColor("003aff")
                    .setTimestamp()
                    .setFooter(message.author.username, message.author.displayAvatarURL())
            )
        )
        //Check to see if the user has put in the correct prefix
        if((args[1] === "f") || (args[1] === "F") || (args[1] === "d") || (args[1] === "D") || (args[1] === "t") || (args[1] === "T") || (args[1] === "R")) {
            var d = new Date();
            let embed = new Discord.MessageEmbed()
                .setTitle("Timestamp Successfully Created")
                .setDescription(`Type: ${args[1]}`)
                .addField("Date:", `${d.toLocaleDateString()} ${d.toLocaleTimeString()}`)
                .addField("Timestamp:", `<t:${Math.round(message.createdTimestamp / 1000)}:${args[1]}>`)
                .addField("Raw:", `\`\`<t:${Math.round(message.createdTimestamp / 1000)}:${args[1]}>\`\``)
                .setColor("0fff00")
                .setTimestamp()
                .setFooter(message.author.username, message.author.displayAvatarURL())
            message.channel.send(embed)
        } else {
            //Check to see if the user requested for help
            if(args[1] === "help"){
                let embed = new Discord.MessageEmbed()
                    .setTitle("Timestamps")
                    .setDescription("Sends a timestamp that applies to the timezone of any user looking at it")
                    .addField("Prefixes", "``f`` - Short Date Time \n ``F`` - Long Date Time \n ``d`` - Short Date \n ``D`` - Long Date  \n ``t`` - Short Time \n ``T`` - Long Time \n ``R`` - Relative Time")
                    .setColor("003aff")
                    .setTimestamp()
                    .setFooter(message.author.username, message.author.displayAvatarURL())
                message.channel.send(embed)
            } else {
                //Check to see if the user didn't supply a valid prefix
                message.channel.send(
                    new MessageEmbed()
                    .setTitle("Timestamp Failed")
                    .addField('Reason:', `${args[1]} is not a valid prefix`)
                    .setColor("F00000")
                    .setTimestamp()
                    .setFooter(message.author.username, message.author.displayAvatarURL())
                )
            }
        }
    }
    
}
try {

}
catch (err) {catchErr(err, message);}
bot.login(token);