const {Client,IntentsBitField,ApplicationCommandType} = require('discord.js');
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
    url:`http://localhost:${port}/register`,
    data:{
      name:name
    }
  }).then(response => {
    return(response.data);
  })
  .catch(error => {
    console.error('There was an error registering the player!', error);
  });
}

async function updatePlayer(name,add){
  await axios({
    method:'put',
    url:`http://localhost:${port}/update`,
    data:{
      name: name,
      toAdd: add
    }
  }).then(response => {
    console.log(response.data);
  })
  .catch(error => {
    console.error('There was an error updating the player!', error);
  });
}
async function findPlayer(name){
  await axios({
    method:'get',
    url:`http://localhost:${port}/find`,
    data:{
      name:name
    } 
  }).then(response => {
      return (response.data)
    })
    .catch(error => {
      console.error('There was an error finding the player!', error);
      return (error.data)
    });
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

/////////////////////////{Listen Stock Command}////////////////////////////////////



client.on('ready', (c)=>{
    console.log(`${c.user.username} is ready`)
    //connect();
    

})
///////////////////////////////////////////////////////////////////////
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

    console.log(`${message.author.displayName}: ${message.content}`);

    if(message.content.toLowerCase().includes(`stock`))
      {
        fs.writeFile('./stock-files/stock-data.json',JSON.stringify(await getYear(),null,2), err => {if(err) console.log(err);})
        await getGraph()
        message.channel.send({embeds: [stockEmbed], files: [file] })

      //await newPlayer('seif');
      //await updatePlayer('seif', 5 )
      //await findPlayer('seif')
      //console.log(findPlayer("blabla"));

      //getYear();
    }

    
})



