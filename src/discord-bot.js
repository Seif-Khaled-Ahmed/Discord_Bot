const {Client,IntentsBitField,ApplicationCommandType} = require('discord.js');
const { SlashCommandBuilder } = require('discord.js');
const axios = require('axios'); //AXIOS FOR API REQUESTS
const dotenv = require('dotenv');
const fs = require('fs'); //MSH FAKER
dotenv.config();
const {spawn}  = require('child_process'); //SPAWN FOR PYTHON SCRIPT
const server = require('./server');


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

async function connect(){
  await axios({
    method:'get',
    url:`http://localhost:${port}/`,
    
  }).then(response => {
    console.log(`${response.data}`);
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
    return(response.data);
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
      return (response.data)
    })
    .catch(error => {
      console.error('There was an error finding the player!', error);
      return (error.data)
    });
  }

//TODO{API FOR STOCKS}////////////////////////////////////
const symbol = 'APPL'
async function getYear(){
  const response = await axios.get('https://api.nasdaq.com/api/quote/AAPL/chart', {
    params: {
      'assetclass': 'stocks',
      'fromdate': '2024-01-30',
      'todate': '2024-07-30'
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
    connect();
    

})

client.on('messageCreate',async (message)=>{

    console.log(`${message.author.displayName}: ${message.content}`);

    if(message.content.toLowerCase().includes(`stock`))
      {

      //await newPlayer('seif');
      await updatePlayer('seif', 5 )
      await findPlayer('seif')
      console.log(findPlayer("blabla"));
      //fs.writeFile('./Stock-files/stock-data.json',JSON.stringify(await getYear(),null,2), err => {if(err) console.log(err);})
      getGraph()

      //getYear();
    }

    if(message.content.toLowerCase().includes(`!add`))
    {
      const words = message.content.toLowerCase().slice(4).trim().split(' ');
      // Extract the next two words
      const firstWord = words[0];
      const secondWord = words[1];
      if (words.length >= 2) {
          
          if (findPlayer(firstWord) == true){
            message.channel.send("DONEE")
            await newPlayer(firstWord)
            await updatePlayer(firstWord,secondWord)
          }else
          {
            message.channel.send("done")
            await updatePlayer(firstWord,secondWord)
          }
    }else
    {
      message.channel.send(firstWord + secondWord +"wrong format")
    }
  }
})



