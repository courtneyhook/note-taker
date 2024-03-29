//this imports express
const express = require("express");
const fs = require("fs");
const path = require("path");
const uuid = require("./uuid");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/index.html"));
});

app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/notes.html"));
});

//works with getNotes function
app.get("/api/notes", (req, res) => {
  fs.readFile(path.join(__dirname, "./db/db.json"), (err, data) =>
    res.json(JSON.parse(data))
  );
});

//works with saveNote function
app.post("/api/notes", (req, res) => {
  //read and parse the JSON file
  fs.readFile(path.join(__dirname, "./db/db.json"), (err, data) => {
    const notes = JSON.parse(data);
    const newNote = { ...req.body };
    newNote.id = uuid();
    //adds the new note to the json file
    notes.push(newNote);
    const stringNotes = JSON.stringify(notes);
    //writes all the notes to the json file
    fs.writeFile(path.join(__dirname, "./db/db.json"), stringNotes, (err) => {
      if (err) throw err;
      //sends a response back to the client
      res.json(stringNotes);
    });
  });
});
//});

//works with deleteNote function
app.delete("/api/notes/:id", (req, res) => {
  //gets the id from the note that was clicked
  const newID = req.params.id;
  fs.readFile(path.join(__dirname, "./db/db.json"), (err, data) => {
    const notes = JSON.parse(data);
    for (let n = 0; n < notes.length; n++) {
      if (notes[n].id === newID) {
        //removes the entry with the matching index
        notes.splice(n, 1);
      }
    }

    let stringNotes = JSON.stringify(notes);
    fs.writeFile(path.join(__dirname, "./db/db.json"), stringNotes, (err) => {
      //sends a response back to the client
      res.json(notes);
    });
  });
});

app.listen(PORT, () => console.log(`Listening...at http://localhost:${PORT}`));
