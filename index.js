require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const trackerRoutes = require("./routes/tracker.routes");


app.use(express.json());
app.use(cors())
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

app.use("/api", bodyParser.urlencoded({ extended: false }));
app.use("/api", trackerRoutes);

mongoose.set("strictQuery", true);
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((e) => console.log(e))

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
