const {Client,IntentsBitField,ApplicationCommandType, ActionRowBuilder, ButtonBuilder, ButtonStyle} = require('discord.js');
const { SlashCommandBuilder } = require('discord.js');
const axios = require('axios'); //AXIOS FOR API REQUESTS
const dotenv = require('dotenv');
const fs = require('fs'); //MSH FAKER
dotenv.config();
const {spawn}  = require('child_process'); //SPAWN FOR PYTHON SCRIPT
const server = require('./server');
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



//!{Run Python Sript}//////////////////

async function getGraph(){

  const hexToString = (hex) => Buffer.from(hex, 'hex').toString('utf8');

  const childPython = spawn('python', ['stock-files/graph.py']);

await childPython.stdout.on('data',(data) => {
  console.log(hexToString(data));
});

await childPython.stderr.on('data',(data) => {
  console.log(hexToString(data));
});

await childPython.on('close',(data) => {
  console.log(data);
});
}
 
//*{DatabaseAPI}///////////////////////////////////////

// async function connect(){
//   await axios({
//     method:'get',
//     url:`http://localhost:${port}/`,
    
//   }).then(response => {
//     console.log(`${response.data}`);
//   })
//   .catch(error => {
//     console.error('There was an error in express', error);
//   });
// }



async function newPlayer(name){
  ///if(newPlayer.findPlayer(name))
  await axios({
    method:'post',
    url:`http://localhost:${port}/`,
    data:{
      name:name
    }
  }).then(response => {
    return(response.data);
  })
  .catch(error => {
    console.error('There was an error registering the player!',error);
  });
}

async function updatePlayer(name,add){
  await axios({
    method:'put',
    url:`http://localhost:${port}/`,
    data:{
      name: name,
      toAdd: add
    }
  }).then(response => {
    console.log(response.data);
  })
  .catch(error => {
    console.error('There was an error updating the player!');
  });
}

async function findPlayer(name) {
  try {
    const response = await axios({
      method: 'get',
      url: `http://localhost:${port}/`,
      data: {
        name: name
      }
    });

    console.log(response.data);  // This prints the JSON fine
    return response.data;        // This returns the data

  } catch (error) {
    console.error('There was an error finding the player!',error);
  }
}
//TODO{API FOR STOCKS}////////////////////////////////////
const stockSymbol = 'AAPL';
const firstDate = '2024-01-30';
const secondDate = '2024-09-30';
async function getYear(){
  const response = await axios.get(`https://api.nasdaq.com/api/quote/${stockSymbol}/chart`, {
    params: {
      'assetclass': 'stocks',
      'fromdate': firstDate,
      'todate': secondDate
    },
    headers: {
      'accept': 'application/json, text/plain, */*',
      'accept-language': 'en-US,en;q=0.9',
      'origin': 'https://www.nasdaq.com',
      'priority': 'u=1, i',
      'referer': 'https://www.nasdaq.com/',
      'sec-ch-ua': '"Not/A)Brand";v="8", "Chromium";v="126", "Google Chrome";v="126"',
      'sec-ch-ua-mobile': '?0',
      'sec-ch-ua-platform': '"Windows"',
      'sec-fetch-dest': 'empty',
      'sec-fetch-mode': 'cors',
      'sec-fetch-site': 'same-site',
      'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36'
    }
  });
  return response.data;
}

//!{Listen Stock Command}////////////////////////////////////



client.on('ready', (c)=>{
    console.log(`${c.user.username} is ready`)
    //connect();
    

})
//!embeds/////////////////////////////////////////////////////////////////////
const file = new AttachmentBuilder('stock-files/stock-graph.png');
const stockEmbed = new EmbedBuilder()
	.setColor(0x008000)
	.setTitle(`Stock Data`)
	//.setURL('https://discord.js.org/')
	.setDescription('description')

	.addFields({ name: `${stockSymbol}`, value: `${firstDate} - ${secondDate}`, inline: true })
	.setImage('attachment://stock-graph.png')
	//.setTimestamp()
	//.setFooter({ text: 'omar sucks', iconURL: 'https://i.imgur.com/AfFp7pu.png' });



//////////////////////////////////////////////////////////////////////

client.on('messageCreate',async (message)=>{
  const author  = message.author;
  var userId = author.id;
  var user = author.username;
  console.log(`${user}: ${message.content}`);

  if(message.content.toLowerCase().includes(`stock`))
    {
      fs.writeFile('./stock-files/stock-data.json',JSON.stringify(await getYear(),null,2), err => {if(err) console.log(err);}) //make stock-data for graph
      await getGraph()
      const add = new ActionRowBuilder();
      add.components.push
      (new ButtonBuilder()
      .setCustomId("Add")
      .setLabel("Add")
      .setStyle(ButtonStyle.Success)
    )

      await message.channel.send({
        embeds: [stockEmbed],
        files: [file],
        components: [add]
        })   //send embed
    }
  if(message.content.toLowerCase().includes(`add`)){
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
  }

  if(message.content.toLowerCase() == (`bal`)){
    console.log(user)
    const userFound = await findPlayer(user)

    if(userFound.found){
      message.channel.send(`found ${userFound.name} with balance ${userFound.balance}`)

    }else{
      await newPlayer(user);
      message.channel.send(`aded new user balance : 0`)
    }
   }

   
  if(message.content.toLowerCase() == (`leaderboard`)){
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

  }


    
})



