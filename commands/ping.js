// const { MessageEmbed } = require("discord.js")

// module.exports = {
//     slash: 'both',
//     testOnly: true,
//     description: 'a simple ping pong command!',
//     category: 'helpful',
//     callback: ({ message }) => {
//         const embed = new MessageEmbed()
//             .setTitle('test')
//             .setDescription('pong')

//             if(message) {
//                 message.reply('', { embed })
//             }

//         return embed
//     },
// }
module.exports = {
    name: 'ping',
    description: "Gets the bots ping",
    execture(message, args){
        //If the user asked for help, send this.
        if(args[1] == "help") {
            let embed = new Discord.MessageEmbed()
                .setTitle("Ping")
                .addField("Usage:", `${prefix}ping`)
                .setDescription("Allows you to see the bots latency (ping), api latency, and uptime.")
                .setColor("003AFF")
                .setTimestamp()
                .setFooter(message.author.username, message.author.displayAvatarURL())
            message.channel.send(embed)
            return
        }
    
        //Takes how long the bot has been up, and turns it into days, hours, minutes, and seconds.
        function duration(ms) {
        const sec = Math.floor((ms / 1000) % 60).toString();
        const min = Math.floor((ms / (1000 * 60)) % 60).toString();
        const hrs = Math.floor((ms / (1000 * 60 * 60)) % 60).toString();
        const day = Math.floor((ms / (1000 * 60 * 60 * 24)) % 60).toString();
        return `${day.padStart(1, '0')} days, ${hrs.padStart(2, '0')} hrs, ${min.padStart(2, '0')} minutes, ${sec.padStart(2, '0')} seconds,`}
    
        //Send an embeded message that acts like the bot is loading the command
        let embed = new Discord.MessageEmbed()
            .setTitle("<a:loading:711726052560601138> Loading...")
            .setDescription("Please be patient")
            .setFooter("This takes time!")
            .setColor("FF6C00")
            .setTimestamp()
        message.channel.send(embed).then(m => {
            
            //Edit the message with the actual information, Api latency and actual latency. 
            ( async () => {
                let ping = m.createdTimestamp - message.createdTimestamp
                await new Promise(r => setTimeout(r, 1 * 2000))
                embed
                    .setTitle("bot info")
                    .setDescription("Here is your requested info:")
                    .addField("Uptime:", `${duration(bot.uptime)}`)
                    .addField("Latency:", `${ping}`)
                    .addField("API Latency:", `${Math.round(bot.ws.ping)}`)
                    .setColor("FF4200")
                    .setTimestamp()
                    .setFooter("Have a good day!")
                m.edit(embed)
            })();
        })
    }
}