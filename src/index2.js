const express = require ('express')
const mongoose = require ('mongoose')
const bodyParser = require('body-parser');
const keys = require ('./keys');

const port = keys.yourPort;

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

app.get("/",function(req,res){
    res.send("Express is working")
    console.log("Express connected")    
})


app.post("/register",async (req,res)=>{
    const {name} = req.body;
    let newUser = new player({
        name: name,
        balance: 0,
    })

    try {
        await newUser.save();
        res.send(newUser);
        console.log(`Created User With name ${name}`);
    } catch (error) {
        res.status(500).send('Error creating user');
        console.error('Error creating user:', error);
    }
});

app.post("/update", async(req,res)=>{
    let user  = req.body;

    let userx = await player.findOne({name: user.name});

    await player.updateOne({ name: user.name },{balance: Number(userx.balance) + Number(user.toAdd)});

    userx = await player.findOne({name: user.name});

    console.log(userx.name + " his name");

    try {
        res.send(`${userx.name}'s balance updated to ${userx.balance}`);
        console.log(`Updated to ${userx.balance}`);
    } catch (error) {
        res.status(500).send('Error Updating user');
        console.error('Error Updating user:', error);
    }


});



app.get("/find", async (req, res) => {
    try {
        const user = req.body;

        let userx = await player.findOne({name: user.name});

        console.log("Balance:", userx.balance);

        res.send(`found username: ${userx.name} with balance: ${userx.balance}`);
    } catch (error) {
        console.error("Error in:", error);
        res.status(500).send("Error in balance");
    }
});


////////////////////////////////////////////////////////////////////////////////////////////////////////////////
