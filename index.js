const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express')
const cors = require('cors')
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

// middleware 
app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
    res.send('This is the connected port')
})

const user = process.env.DB_User
const password = process.env.DB_Password


const uri = `mongodb+srv://${user}:${password}@cluster0.5rnuhbi.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
    try {
        const TaskCollection = client.db('DailyTask').collection('userTask');
        const CompleteCollection = client.db('DailyTask').collection('CompleteTask')

        app.post('/task', async (req, res) => {
            const query = req.body;
            console.log(query)
            const allTask = await TaskCollection.insertOne(query);
            res.send(allTask);
        })
        app.get('/userTask', async (req, res) => {
            const email = req.body.email;
            const query = { email }
            const AllTask = await TaskCollection.find(query).toArray();
            res.send(AllTask);
        })
        app.get('/userTask/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const singleTask = await TaskCollection.findOne(query);
            res.send(singleTask)
        })
        app.delete('/userTask/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) }
            const DeleteTask = await TaskCollection.deleteOne(filter)
            res.send(DeleteTask);
        })
        app.put('/UpdateTask/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) }
            const updateTask = req.body;
            const option = { upsert: true }
            const updateDoc = {
                $set: {
                    user: updateTask.user,
                    image: updateTask.image,
                    details: updateTask.details,
                    date: updateTask.date
                }
            }
            const result = await TaskCollection.updateOne(filter, updateDoc, option);
            res.send(result);
        })

        app.post('/complete', async (req, res) => {
            const query = req.body;
            const completeTask = await CompleteCollection.insertOne(query)
            res.send(completeTask);
        })
        app.put('/completeTask/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const option = { upsert: true }
            const updateDoc = {
                $set: {
                    complete: 'Done'
                }
            }
            const result = await TaskCollection.updateOne(query, updateDoc, option)
            res.send(result);
        })
        app.get('/completeTasks', async (req, res) => {
            const email = req.query.email
            const query = { email };
            const result = await CompleteCollection.find(query).toArray()
            res.send(result);
        })
        app.delete('/completeDataDelete/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) }
            const result = await CompleteCollection.deleteOne(filter)
            res.send(result)
        })
    }
    finally {

    }
}

run().catch(error => console.log(error))


app.listen(port, () => {
    console.log(`this is port is connected port ${port}`)
})
