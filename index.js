const express = require('express');
const cors = require('cors');
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@safoundb.d2yflbg.mongodb.net/?retryWrites=true&w=majority`;


const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        client.connect();

        const userCollection = client.db("Euphoria").collection("userCollection");
        const classesCollection = client.db("Euphoria").collection("classes");
        // const galleryCollectionTwo = client.db("Toytopia").collection("galleryTwo");
        // const allToyCollection = client.db("Toytopia").collection("AllToys");


        app.get("/all-users", async (req, res) => {
            const cursor = userCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        });

        app.get("/instructors", async (req, res) => {
            const query = { role: "instructor" };
            const cursor = userCollection.find(query);
            const result = await cursor.toArray();
            res.send(result);
        });

        app.get("/users", async (req, res) => {
            const query = { role: "user" };
            const cursor = userCollection.find(query);
            const result = await cursor.toArray();
            res.send(result);
        });

        app.get("/admins", async (req, res) => {
            const query = { role: "admin" };
            const cursor = userCollection.find(query);
            const result = await cursor.toArray();
            res.send(result);
        });

        app.get("/classes", async (req, res) => {
            const query = { status: "approved" };
            const cursor = classesCollection.find(query);
            const result = await cursor.toArray();
            res.send(result);
        });

        // app.get("/gallery-two", async (req, res) => {
        //     const cursor = galleryCollectionTwo.find();
        //     const result = await cursor.toArray();
        //     res.send(result);
        // })

        // app.get("/all-toys", async (req, res) => {
        //     const cursor = allToyCollection.find();
        //     const result = await cursor.toArray();
        //     res.send(result);
        // })

        // app.get("/all-toys/:ID", async (req, res) => {
        //     const id = req.params.ID;
        //     const query = { _id: new ObjectId(id) }
        //     const result = await allToyCollection.findOne(query);
        //     res.send(result);
        // })

        app.post("/users", async (req, res) => {
            const newUser = req.body;
            const query = { email: newUser.email };
            const existingUser = await userCollection.findOne(query);
            if (existingUser) {
                return;
            }
            const result = await userCollection.insertOne(newUser);
            res.send(result);
        })

        // app.patch("/all-toys/:ID", async (req, res) => {
        //     const id = req.params.ID;
        //     const query = { _id: new ObjectId(id) }
        //     const options = { upsert: true };
        //     const updatedToy = req.body;
        //     const latestToy = {
        //         $set: {
        //             toy_name: updatedToy.toy_name,
        //             photo: updatedToy.photo,
        //             category: updatedToy.category,
        //             seller_name: updatedToy.seller_name,
        //             seller_email: updatedToy.seller_email,
        //             price: updatedToy.price,
        //             rating: updatedToy.rating,
        //             quantity: updatedToy.quantity,
        //             description: updatedToy.description,
        //         }
        //     }
        //     const result = await allToyCollection.updateOne(query, latestToy, options);
        //     res.send(result);
        // })

        // app.delete("/all-toys/:ID", async (req, res) => {
        //     const id = req.params.ID;
        //     const query = { _id: new ObjectId(id) };
        //     const result = await allToyCollection.deleteOne(query);
        //     res.send(result);
        // })

        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You have successfully established connection with MongoDB!");
    } finally {
        // await client.close();
    }
}
run().catch(console.dir);


app.get("/", (req, res) => {
    res.send("Euphoria is running");
})

app.listen(port, () => {
    console.log(`Euphoria is running on port : ${port}`);
})