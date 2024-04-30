const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.nfgpaoq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // await client.connect();

        const usersCollection = client.db('kraftiDB').collection('users');

        app.get('/crafts', async (req, res) => {
            const cursor = usersCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })
        app.get('/crafts/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await usersCollection.findOne(query);
            res.send(result);
        })
        app.get('/my-crafts/:email', async (req, res) => {
            const email = req.params.email;
            const query = { userEmail: email };
            const result = await usersCollection.find(query).toArray();
            res.send(result);
        })
        app.post('/crafts', async (req, res) => {
            const newCraft = req.body;
            // console.log(newCraft); 
            const result = await usersCollection.insertOne(newCraft);
            res.send(result);
        })
        app.put('/crafts/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) }
            const options = { upsert: true };
            const updatedCraft = req.body;
            const craft = {
                $set: {
                    image: updatedCraft.image,
                    item_name: updatedCraft.item_name,
                    subcategory_name: updatedCraft.subcategory_name,
                    description: updatedCraft.description,
                    price: updatedCraft.price,
                    rating: updatedCraft.rating,
                    customization: updatedCraft.customization,
                    processing_time: updatedCraft.processing_time,
                    stockStatus: updatedCraft.stockStatus,
                }
            }

            const result = await usersCollection.updateOne(filter, craft, options);
            res.send(result);
        })
        app.delete('/crafts/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await usersCollection.deleteOne(query);
            res.send(result);
        })
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('Krafti server is running');
})
app.listen(port, () => {
    console.log(`Krafti server is running on: ${port}`);
})