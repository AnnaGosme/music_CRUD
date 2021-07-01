require("dotenv").config();
const express = require("express");
const connection = require("./config");

const app = express();

//parse the json sent to be read
app.use(express.json());
app.use(auth);

function auth(req, res, next) {
  if (req.query.admin === "true") {
    req.admin = true;
    next();
    return;
  } else {
    res.send("No auth");
  }
}

//get all tracks
app.get("/api/tracks", (req, res) => {
  connection.query("SELECT * FROM track", (err, results) => {
    if (err) {
      res.json({ error: `error retrieving all tracks: ${err}` });
    } else {
      res.json(results);
    }
  });
});

app.get("/api/tracks/:id", (req, res) => {
  //destructure id and grab from params
  const { id } = req.params;
  connection.query("SELECT * FROM track WHERE id=?", [id], (err, results) => {
    if (err) {
      res.json({ error: `error retrieving track: ${err}` });
    } else {
      res.json(results);
    }
  });
});

app.post("/api/tracks", (req, res) => {
  connection.query("INSERT INTO track SET ?", [req.body], (err, results) => {
    if (err) {
      res.json({ error: `error adding track: ${err}` });
    } else {
      //201 = success and req.body to send the created element
      res.status(201).json(req.body);
      console.log(req.body);
    }
  });
});

app.put("/api/tracks/:id", (req, response) => {
  const { id } = req.params;
  connection.query("UPDATE track SET ?", [req.body], (err, res) => {
    if (err) {
      response.json({ error: `error updating track ${err}` });
    } else {
      response.status(201).json(req.body);
    }
  });
});

module.exports = app;
