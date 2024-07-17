const express = require('express')
const cors = require('cors')
require('dotenv').config()
const app = express()
const port = process.env.PORT || 5000

//middleware
app.use(cors())
app.use(express.json())

console.log(process.env.DB_USER)

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.yxk5a5e.mongodb.net/?appName=Cluster0`;

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

    const servicesCollection = client.db('carvillaDB').collection('services')
    const productsCollection = client.db('carvillaDB').collection('products')
    const bookingCollection = client.db('carvillaDB').collection('booking')


    //booking 
    app.post('/booking', async(req, res) => {
        const booking = req.body
        const result = await bookingCollection.insertOne(booking)
        res.send(result)
    })

    app.get('/booking', async(req, res) => {
        // console.log(req.query.email)
        let query = {}
        if(req.query?.email){
            query = {email: req.query.email}
        }
        const result = await bookingCollection.find(query).toArray()
        res.send(result)
    })

    app.delete('/booking/:id', async(req, res) => {
       const id = req.params.id
       const query = {_id: new ObjectId(id)}
       const result = await bookingCollection.deleteOne(query)
      res.send(result)
    })

    app.patch('/booking/:id', async(req, res) => {
      const cursor = req.body
      const id = req.params.id
      const query = {_id: new ObjectId(id)}
      const updateDoc = {
        $set: {
          status: cursor.status
        },
      };
      const result = await bookingCollection.updateOne(query, updateDoc)
      res.send(result)
    })

    //services
    app.get('/services', async(req, res) => {
        const cursor = servicesCollection.find()
        const result = await cursor.toArray()
        res.send(result)
    })

    app.get('/services/:id', async(req, res) => {
        const  id = req.params.id
        const query = {_id: new ObjectId(id)}
        const result = await servicesCollection.findOne(query)
        res.send(result)
    })

    //products
    app.get('/products', async(req, res) => {
        const cursor = productsCollection.find()
        const result = await cursor.toArray()
        res.send(result)
    })



    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    //await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Hello World!')
  })
  
  app.listen(port, () => {
    console.log(`Carvilla server listening on port ${port}`)
  })