import express from "express"
import bodyParser from "body-parser"
import mongoose from "mongoose"
import cors from "cors"

const app = express();

app.use(cors());

app.use(express.urlencoded({ extended: true}))

app.use(express.json())

// app.use(express.static("public"))

const uri = "mongodb://127.0.0.1:27017/events";

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const eventSchema = {
  title: String,
  content: String,
}

const Event = mongoose.model("Event", eventSchema)

app.route("/events")
.get((req,res) => {
  Event.find((err, foundEvent) => {
    if(!err) {
      res.send(foundEvent)
    } else {
      res.send(err)
    }
  })
})

.post( (req,res) => {
  const newEvent = new Event({
    title: req.body.title,
    content: req.body.content
  })

newEvent.save((err) => {
  if(!err) {
    res.send("Successfully added a new event")
  } else {
    res.send(err)
  }
  });
})

.delete((req,res) => {
  Event.deleteMany((err) => {
    if(!err) {
      res.send("Successfully deleted all events")
    } else {
      res.send(err)
    }
  })
});


app.route("/events/:title")
.get((req,res) => {
    Event.findOne({
      title: req.params.title
    }, (err, foundEvent) => {
      if(foundEvent) {
        res.send(foundEvent)

      } else {
        res.send("No article found on this route")
      }
    })
})

.put((req, res) => {
  Event.updateOne(
    {title: req.params.title},
    {title: req.body.title, content: req.body.content},
    {overwrite: true},
    (err) => {
      if(!err) {
        res.send("Successfully updated event")
      }
    }
    )
})

.delete((req,res) => {
  Event.deleteOne({
    title: req.params.title
  }, (err) => {
    if(!err) {
      res.send("Successfully deleted article")
    } else {
      res.send(err)
    }
  })
})

app.get("*", (req, res) => {
  res.status(404).send("Incorrect request")
})

const port = process.env.PORT;


app.listen(3001 || port, () => {
  console.log("server started on 3001")
})
