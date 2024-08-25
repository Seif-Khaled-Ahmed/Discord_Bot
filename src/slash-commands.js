require ('dotenv').config();
const { REST, Routes} = require('discord.js');

const commands = 
[
    { 
        name:'stock',
        description:"Doesn't do SHIT",

    },
]
const rest = new rest({version:  '10'}).setToken(process.env.DiscordBotKey)
(async() =>{
    try {
        await rest.put(
            Routes.applicationGuildCommands(process.env.BOT_ID,process.env.GUILD_ID),
            {body : commands}
        )
    } catch (error) {
        console.log(`error in slash-commands ${error}`)
    }

})();