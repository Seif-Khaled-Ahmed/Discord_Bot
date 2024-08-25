const express = require ('express')
const mongoose = require ('mongoose')
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
dotenv.config();

const port = process.env.Port;

const app = (express)();

app.use(bodyParser.json());

/*
app.use((req, res, next) => {
    res.setHeader(`Access-Control-Allow-Origin', 'http://localhost:${port}`);
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
  });
  */


  app.use(express.json());
mongoose.connect('mongodb://localhost:27017/Stockgame')
.then(() => {
    console.log('Connected to MongoDB');
    // Call your function to insert data here if you want to do it immediately upon connection
})
.catch((error) => {
    console.error('Error connecting to MongoDB:', error);
});


const playersc = new mongoose.Schema({
    name: String,
    balance: Number,

})
const player = mongoose.model ("player",playersc)


app.listen(port,() =>{
    console.log (`server is running on port ${port}`)
})


app.post("/",async (req,res)=>{
    const user = req.body;

    const userx = await player.findOne({name: user.name});
    if(userx == null){
    let newUser = new player({
        name: user.name,
        balance: 0,
    })

    try {
        await newUser.save();
        res.status(201).send(`Created User With Name ${user.name}`);
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).send('Error Creating User');
    }
}else{
    res.status(400).send(`Bad Request ${userx.name} Already Exists With Balance ${userx.balance}`)
}
});

app.put("/", async(req,res)=>{
    const user  = req.body;

    try{
        let userx = await player.findOne({name: user.name});
        if(userx != null){
            await player.updateOne({ name: user.name },{balance: userx.balance + user.toAdd});
            userx = await player.findOne({name: user.name});
            res.status(200).send(`${userx.name}'s balance updated to ${userx.balance}`);
            console.log(`${userx.name} Updated to ${userx.balance}`);
        }else{
            res.status(404).send('Error Finding User');

        }
    }catch(error){
        res.status(500).send('Server Error Updating User');
    }
});



app.get("/", async (req, res) => {
    try {
        const user = req.body;

        const userx = await player.findOne({name: user.name});

        if(userx == null){
            res.status(404).send(`Not Found`)
        }else{
            res.status(200).send(`Found ${userx.name} With Balance ${userx.balance}`);

        }
    } catch (error) {
        res.status(500).send("Server Error Finding User");
        console.log(error);
    }
});


///////////////////////////////////////////////////////////////////////////////////////////////////////////////
