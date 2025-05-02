const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();

const dbSource = 'webdev.db';
const HTTP_PORT = 8000;
const db = new sqlite3.Database(dbSource);

var app = express();
app.use(cors());
app.use(express.json());


// This endpoint is used to retrieve all users from the database
app.get('/users', (req, res) => {
    let comSelect = 'SELECT * FROM tblUsers';
    db.all(comSelect, function (err, result) {
        if (err) {
            res.status(400).json({ error: err.message})
        } else {
            res.status(200).json({ data: result})
        }
    });
});

// This enpoint is used to retrieve a specific user from the database using their email as ID
app.get('/users/:email', (req, res) => {
    let comSelect = 'SELECT * FROM tblUsers WHERE Email = ?';
    let strUserID = req.params.email;
    db.get(comSelect, [strUserID], function (err, result) {
        if (err) {
            res.status(400).json({ error: err.message });
        } else {
            res.status(200).json({ user: result});
        }
    });
});

// This endpoint is used to create a new user in the database using a first name, last name, and email address
app.post('/users', (req, res) => {
    let comInsert = 'INSERT INTO tblUsers (FirstName, LastName, Email, CreationDateTime, LastLoginDateTime) VALUES (?,?,?,?,?)';
    let strFirstName = req.body.FirstName;
    let strLastName = req.body.LastName;
    let strEmail = req.body.Email;

    // CreationDateTime and LastLoginDateTime are set to the current date and time for user creation
    let strCreationDateTime = new Date(Date.now()).toISOString();
    let strLastLoginDateTime = new Date(Date.now()).toISOString();


    // Execute an SQL command to insert the new user into the database
    db.run(comInsert, [strFirstName, strLastName, strEmail, strCreationDateTime, strLastLoginDateTime], function (err) {
        if (err) {
            res.status(400).json({ error: err.message});
        } else {
            res.status(201).json({ message: 'User created successfully', id: this.lastID});
        }
    });
});

// This endpoint is used to update an existing user in the database using their email as ID
app.put('/users/:email', (req, res) => {
    let comUpdate = 'UPDATE tblUsers SET FirstName = ?, LastName = ?, Email = ? WHERE Email = ?';
    let strFirstName = req.body.FirstName;
    let strLastName = req.body.LastName;
    let strEmail = req.body.Email;
    let strID = req.params.email;

    db.run(comUpdate, [strFirstName, strLastName, strEmail, strID], function (err) {
        if (err) {
            res.status(400).json({ error: err.message });
        } else {
            res.status(201).json({ message: 'User updated successfuly' });
        }
    });
});

// This endpoint is used to delete a user from the database using their email as ID
app.delete('/users/:email', (req, res) => {
    let comDelete = 'DELETE FROM tblUsers WHERE Email = ?';
    let strID = req.params.email;
    db.run(comDelete, [strID], function (err) {
        if (err) {
            res.status(400).json({ error: err.message });
        } else {
            res.status(201).json({ message: 'User deleted successfully' });
        }
    });
});

app.listen(HTTP_PORT,() => {
    console.log('App listening on',HTTP_PORT)
});
