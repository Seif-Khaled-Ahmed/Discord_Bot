const {Client,IntentsBitField,ApplicationCommandType} = require('discord.js');
const { SlashCommandBuilder } = require('discord.js');
const axios = require('axios'); //AXIOS FOR API REQUESTS
const keys = require('./keys');
const fs = require('fs'); //MSH FAKER
const port = keys.yourPort;

const {spawn}  = require('child_process'); //SPAWN FOR PYTHON SCRIPT

const client = new Client({
  intents: [
      IntentsBitField.Flags.Guilds,
      IntentsBitField.Flags.GuildMembers,
      IntentsBitField.Flags.GuildMessages,
      IntentsBitField.Flags.MessageContent,
  ], 
});

client.login(keys.yourBotKey); //Key for Bot

//!{Run Python Sript}//////////////////

async function getGraph(){

  const hexToString = (hex) => Buffer.from(hex, 'hex').toString('utf8');

  const childPython = spawn('python', ['src/Graph.py']);

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

async function connect(){
  await axios({
    method:'get',
    url:`http://localhost:${port}/`,
    
  }).then(response => {
    console.log(`${response.data} port: ${port}`);
  })
  .catch(error => {
    console.error('There was an error in express', error);
  });
}



async function newPlayer(name){
  ///if(newPlayer.findPlayer(name))
  await axios({
    method:'post',
    url:`http://localhost:${port}/register`,
    data:{
      name:name
    }
  }).then(response => {
    console.log(response.data);
  })
  .catch(error => {
    console.error('There was an error registering the player!', error);
  });
}

async function updatePlayer(name,add){
  await axios({
    method:'post',
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
      console.log(response.data);
    })
    .catch(error => {
      console.error('There was an error finding the player!', error);
    });
  }

//TODO{API FOR STOCKS}////////////////////////////////////
const symbol = 'MSFT'
async function getYear(){
  const output = await axios.get('https://api.nasdaq.com/api/quote/AAPL/chart', {
    params: {
      'assetclass': 'stocks',
      'fromdate': '2024-06-28',
      'todate': '2024-07-28'
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
  return output.data;
}

/////////////////////////{Listen Stock Command}////////////////////////////////////



client.on('ready', (c)=>{
    console.log(`${c.user.username} is ready`)
    connect();

})

client.on('messageCreate',async (message)=>{

    console.log(`${message.author.displayName}: ${message.content}`);

    if(message.content.toLowerCase().includes(`stock`)){


      //await updatePlayer('seif', 5 )
      //await findPlayer('seif')
      console.log(await getYear());
      console.log(JSON.stringify(await getYear(), null, 2));

      //getYear();
    }
})



