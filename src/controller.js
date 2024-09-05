const {
  Client,
  IntentsBitField,
  ApplicationCommandType,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
const { SlashCommandBuilder } = require("discord.js");
const axios = require("axios"); //AXIOS FOR API REQUESTS
const dotenv = require("dotenv");
const fs = require("fs"); //MSH FAKER
dotenv.config();
const { spawn } = require("child_process"); //SPAWN FOR PYTHON SCRIPT
const server = require("./server");
const { AttachmentBuilder, EmbedBuilder } = require("discord.js");

const port = process.env.Port;

//!{Run Python Sript}//////////////////

async function getGraph() {
  const hexToString = (hex) => Buffer.from(hex, "hex").toString("utf8");

  const childPython = spawn("python", ["stock-files/graph.py"]);

  childPython.stdout.on("data", (data) => {
    console.log(hexToString(data));
  });

  childPython.stderr.on("data", (data) => {
    console.log(hexToString(data));
  });

  childPython.on("close", (data) => {
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

async function newPlayer(name) {
  ///if(newPlayer.findPlayer(name))
  await axios({
    method: "post",
    url: `http://localhost:${port}/`,
    data: {
      name: name,
    },
  })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error("There was an error registering the player!", error);
    });
}

async function updatePlayer(name, add) {
  await axios({
    method: "put",
    url: `http://localhost:${port}/`,
    data: {
      name: name,
      toAdd: add,
    },
  })
    .then((response) => {
      console.log(response.data);
    })
    .catch((error) => {
      console.error("There was an error updating the player!");
    });
}

async function findPlayer(name) {
  try {
    const response = await axios({
      method: "get",
      url: `http://localhost:${port}/`,
      data: {
        name: name,
      },
    });

    console.log(response.data); // This prints the JSON fine
    return response.data; // This returns the data
  } catch (error) {
    console.error("There was an error finding the player!", error);
  }
}
//TODO{API FOR STOCKS}////////////////////////////////////
const stockSymbol = " AAPL";
const firstDate = "2024-01-30";
const secondDate = "2024-09-30";
async function getYear() {
  const response = await axios.get(
    `https://api.nasdaq.com/api/quote/${stockSymbol}/chart`,
    {
      params: {
        assetclass: "stocks",
        fromdate: firstDate,
        todate: secondDate,
      },
      headers: {
        accept: "application/json, text/plain, */*",
        "accept-language": "en-US,en;q=0.9",
        origin: "https://www.nasdaq.com",
        priority: "u=1, i",
        referer: "https://www.nasdaq.com/",
        "sec-ch-ua":
          '"Not/A)Brand";v="8", "Chromium";v="126", "Google Chrome";v="126"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"Windows"',
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-site",
        "user-agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
      },
    }
  );
  return response.data;
}

//!embeds/////////////////////////////////////////////////////////////////////
const file = new AttachmentBuilder("stock-files/stock-graph.png");
const stockEmbed = new EmbedBuilder()
  .setColor(0x008000)
  .setTitle(`Stock Data`)
  //.setURL('https://discord.js.org/')
  .setDescription("description")

  .addFields({
    name: `${stockSymbol}`,
    value: `${firstDate} - ${secondDate}`,
    inline: true,
  })
  .setImage("attachment://stock-graph.png");
//.setTimestamp()
//.setFooter({ text: 'omar sucks', iconURL: 'https://i.imgur.com/AfFp7pu.png' });

//////////////////////////////////////////////////////////////////////
module.exports = {
  getGraph,
  newPlayer,
  findPlayer,
  updatePlayer,
  getYear,
  stockEmbed,
};
