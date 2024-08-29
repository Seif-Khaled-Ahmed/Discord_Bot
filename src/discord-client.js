const {Client,IntentsBitField,ApplicationCommandType, ActionRowBuilder, ButtonBuilder, ButtonStyle} = require('discord.js');
const { SlashCommandBuilder } = require('discord.js');
const axios = require('axios'); //AXIOS FOR API REQUESTS
const dotenv = require('dotenv');
const fs = require('fs'); //MSH FAKER
dotenv.config();
const {spawn}  = require('child_process'); //SPAWN FOR PYTHON SCRIPT
const server = require('./server');
const {getGraph ,  newPlayer, findPlayer, updatePlayer, getYear, stockEmbed} = require('./controller')

const {AttachmentBuilder, EmbedBuilder } = require('discord.js');


const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
    ], 
});

const port = process.env.Port;
client.login(process.env.DiscordBotKey); //Key for Bot
const file = new AttachmentBuilder('stock-files/stock-graph.png');

  
  

client.on('ready', (c)=>{
    console.log(`${c.user.username} is ready`)
//connect();
    

})
client.on('messageCreate',async (message)=>{
    const author  = message.author;
    var userId = author.id;
    var user = author.username;
    console.log(`${user}: ${message.content}`);

    var tmessage = message.content.toLowerCase()

 switch(true){
    case tmessage.includes("stock") :
        fs.writeFile('./stock-files/stock-data.json',JSON.stringify(await getYear(),null,2), err => {if(err) console.log(err);}) //make stock-data for graph
        await getGraph()
        const add = new ActionRowBuilder();
        add.components.push(
        new ButtonBuilder()
        .setCustomId("Ad")
        .setLabel("Ad")
        .setStyle(ButtonStyle.Success))
    
        await message.channel.send({
          embeds: [stockEmbed],
          files: [file],
          components: [add]
          })   //send embed
    break;

    case "add" : 
     let messageArr = message.content.split(` `)
     if(messageArr.length > 1){
        let id = messageArr[1].slice(2, -1)
        let userObj = await client.users.fetch(id)
        user = userObj.username;
        var userFound = await findPlayer(user)
      }else{
        var userFound = await findPlayer(user)
      }
  
      if(userFound.found){  
        await updatePlayer(user, 5 )
        userFound = await findPlayer(user)
        message.channel.send(`aded,  balance: ${userFound.balance}`)
      }else{
        await newPlayer(user);
        message.channel.send(`aded new user`)
      }
    break;

    case "bal":
        console.log(user)
      var userFound = await findPlayer(user)
  
      if(userFound.found){
        message.channel.send(`found ${userFound.name} with balance ${userFound.balance}`)
  
      }else{
        await newPlayer(user);
        message.channel.send(`aded new user balance : 0`)
      }
    break;

    case "leaderboard":
        let users = await findPlayer()
        users = users.sort((a, b) => b.balance - a.balance);
        const leaderboardEmbed = new EmbedBuilder()
        .setColor(0xffcf40)
        .setTitle(`Leaderboard`)
        .setDescription('The Top 5 Players')
        for (let i = 0; i < Math.min(5, users.length); i++) {
        leaderboardEmbed.addFields( {name: `${i + 1} : ${users[i].name}`, value: `${users[i].balance}`,inline:false})
      }
      message.channel.send({embeds: [leaderboardEmbed]})
    break;

}
})