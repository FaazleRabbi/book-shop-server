const express = require("express");
var cors = require("cors");
var bodyParser = require("body-parser");
require("dotenv").config();
const port = 5000;
const ObjectId = require("mongodb").ObjectId;

const app = express();
app.use(cors());
app.use(express.json());

const MongoClient = require("mongodb").MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qv0a4.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
client.connect((err) => {
  const bookCollection = client
    .db(`${process.env.DB_NAME}`)
    .collection(`${process.env.DB_COLLECTIONS}`);
  const ordersCollection = client
    .db(`${process.env.DB_NAME}`)
    .collection("orders");
  console.log("connection successfully done");

  app.post("/addBook", (req, res) => {
    bookCollection.insertOne(req.body).then((result) => {
      res.send(result.insertedCount > 0);
    });
  });
  app.get("/books", (req, res) => {
    bookCollection.find({}).toArray((err, documents) => {
      res.send(documents);
    });

    app.get("/bookDetails/:id", (req, res) => {
      console.log(req.params.id);
      bookCollection
        .find({ _id: ObjectId(req.params.id) })
        .toArray((err, documents) => {
          console.log(err);
          console.log(documents);
          res.send(documents);
        });
    });

    app.post('/addOrder',(req,res)=>{
      ordersCollection.insertOne(req.body)
      .then(result=>{
        res.send(result.insertedCount> 0)
        console.log(result)
      })
    })

    app.get('/orders',(req, res)=>{
      console.log(req.query.email)
      ordersCollection.find({email:req.query.email})
      .toArray((err,documents)=>{
        console.log(err)
        res.send(documents)
        console.log(documents)
      })
    })

    app.get('/delete/:id',(req, res)=>{
      console.log(req.params.id)
      bookCollection.deleteOne({_id: ObjectId(req.params.id)})
      .then(result=>{
        res.send(result.deletedCount> 0)
        console.log(result)
      })
    })
    console.log("all ok");
  });

  // perform actions on the collection object
  //   client.close();
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port);
