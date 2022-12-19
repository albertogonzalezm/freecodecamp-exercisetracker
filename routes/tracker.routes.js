const { Router } = require("express")
const userSchema = require("../models/users");
const exerciseSchema = require("../models/exercises");

const router = Router();

// Create User
router.post("/users", async (req, res) => {
  const { username: userName } = req.body;
  const findUser = await userSchema.findOne({ username: userName });

  if (userName) {
    if (findUser) {
      res.json({ Error: `User '${userName}' has already exist.` });
    } else {
      const newUser = await userSchema({ username: userName });
      await newUser.save((err, data) => {
        if (err) return res.json({ error: err });
        res.status(201).json(data);
      });
    }
  } else {
    return res.json({ Error: "The 'username' field is required." });
  }
});

// get list users
router.get("/users", async (req, res) => {
  const list = await userSchema.find()
  res.json(list);
});

router.post("/users//exercises", (req, res) => {
  res.json({ Error: "The username, description and duration fields are required." });
});

router.post("/users/:_id/exercises", async (req, res) => {
  let newExercise;
  const { _id } = req.params;
  const { description, duration, date } = req.body;

  if (description && duration) {
    userSchema.findById(_id, async (err, userData) => {
      if (err || !userData) {
        res.json({ Error: `User with ${_id} does not exist.` });
      } else {
        if (!date) {
          newExercise = await exerciseSchema({
            userId: _id,
            description,
            duration,
            date: new Date().toDateString()
          });
        } else {
          newExercise = await exerciseSchema({
            userId: _id,
            description,
            duration,
            date: new Date(date).toDateString()
          });
        }
        await newExercise.save((err, data) => {
          if (err) {
            res.send("Error:", err);
          } else {
            const { description, duration, date } = data;
            res.json({
              username: userData.username,
              description,
              duration,
              date,
              _id: userData._id
            });
          }
        })
      }
    })
  } else {
    res.json({ error: "The username, description and duration fields are required." });
  }
});

router.get("/users//logs", (req, res) => {
  res.json({ Error: "You must enter an id" });
});

router.get("/users/:_id/logs", async (req, res) => {
  const { _id } = req.params;
  userSchema.findById(_id, (err, userData) => {
    if (err || !userData) {
      res.json({ Error: `User with id '${_id}' does not exist.` });
    } else {
      const { from, to, limit } = req.query
      let dateObj = {}
      let dateFilter = {}
      let noNullLimite = limit;

      if (from) {
        dateObj["$gte"] = new Date(from)
      }
      if (to) {
        dateObj["$lte"] = new Date(to)
      }
      if (from || to) {
        dateFilter.date = dateObj;
      }

      if (isNaN(limit) && !limit == "") {
        return res.json({ Error: "Limit is not a Number" })
      }

      exerciseSchema.find({ userId: _id }).limit(noNullLimite).exec((e, data) => {
        if (e || !data.length) {
          res.json({ Error: `No exercises were found for ${userData.username}.` });
        } else {
          const count = data.length;
          const rawLog = data;
          const { username, _id } = userData;
          const log = rawLog.map((data) => ({
            description: data.description,
            duration: data.duration,
            date: data.date
          }));
          res.json({ username, count, _id, log });
        }
      });
    }
  });
});

module.exports = router;