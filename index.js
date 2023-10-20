const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
require('dotenv').config();
const cors = require('cors');
const app = express()
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.m8ywqwd.mongodb.net/?retryWrites=true&w=majority`;

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
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        const productcollection = client.db('productsdb').collection('product')
        const cardcollection = client.db('productsdb').collection('card')

        app.get('/product', async (req, res) => {
            const cursor = productcollection.find()
            const resut = await cursor.toArray()
            res.send(resut)
        })

        app.get('/card', async (req, res) => {
            const cursor = cardcollection.find()
            const resut = await cursor.toArray()
            res.send(resut)
        })

        app.get('/product/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await productcollection.findOne(query)
            res.send(result)
        })


        app.put('/product/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) }
            const options = { upsert: true };
            const productsUpdate = req.body;
            const updateproducts = {
                $set: {
                    name: productsUpdate.name,
                    photo: productsUpdate.photo,
                    brand: productsUpdate.brand,
                    category: productsUpdate.category,
                    price: productsUpdate.price,
                    description: productsUpdate.description,
                    rating: productsUpdate.rating
                }
            }
            const result = await productcollection.updateOne(filter, updateproducts, options)
            res.send(result)
        })

        app.post('/product', async (req, res) => {
            const productdata = req.body;
            const result = await productcollection.insertOne(productdata)
            res.send(result)
        })

        app.post('/card', async (req, res) => {
            const carddata = req.body;
            const result = await cardcollection.insertOne(carddata)
            res.send(result)
        })

        app.delete('/card/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await cardcollection.deleteOne(query)
            res.send(result)
        })

        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Assingment server site')
})

app.listen(port, () => {
    console.log(`Assingment port server: ${port}`)
})