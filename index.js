require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

// db start
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PW}@clusterpherob9.3leb5bl.mongodb.net/?retryWrites=true&w=majority&appName=ClusterPheroB9`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // operations
    const subCategoriesCollection = await client
      .db("CeramingsDB")
      .collection("subCategories");
    const allItemsCollection = await client
      .db("CeramingsDB")
      .collection("allItems");

    // crud subCategories - start
    app.get("/subCategories", async (req, res) => {
      const result = await subCategoriesCollection.find().toArray();
      res.send(result);
    });
    // crud subCategories - end

    // all items - start
    // get
    app.get("/allitems", async (req, res) => {
      const result = await allItemsCollection.find().toArray();
      res.send(result);
    });
    //get single item
    app.get("/allitems/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await allItemsCollection.findOne(query);
      res.send(result);
    });

    // update single item
    app.put("/allitems/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateData = req.body;
      const update = {
        $set: {
          item_Name: updateData.item_Name,
        image: updateData.image,
        subcategory_Name: updateData.subcategory_Name,
        price: updateData.price,
        short_Description: updateData.short_Description,
        rating: updateData.rating,
        customization: updateData.customization,
        processing_Time: updateData.processing_Time,
        stockStatus: updateData.stockStatus,
        User_Email: updateData.User_Email,
        User_Name: updateData.User_Name,
        },
      };
      const result = await allItemsCollection.updateOne(query,update,options)
      res.send(result)
    });

    // delete
    app.delete("/allitems/:id", async(req,res)=>{
      const id = req.params.id;
      const query = { _id : new ObjectId(id)}
      const result = await allItemsCollection.deleteOne(query)
      res.send(result)
    })

    //post
    app.post("/allitems", async (req, res) => {
      const query = req.body;
      const result = await allItemsCollection.insertOne(query);
      res.send(result);
    });

    //get items based on user
    // app.get('/allitems/:email' , async(req,res)=>{
    //   const email = req.params.email;
    //   console.log(email)
    // const query = {User_Email : email}
    // const result = await allItemsCollection.find(query).toArray()
    // res.send(result)
    // })
    // all items - end

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
  }
}
run().catch(console.dir);

// db end

app.get("/", (req, res) => {
  res.send("Ceramings Server is running");
});

app.listen(port, () => {
  console.log("Running Ceramings");
});
