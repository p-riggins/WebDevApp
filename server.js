const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dbSource = 'webdev.db';
const HTTP_PORT = 8000;
const db = new sqlite3.Database(dbSource);

var app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// default endpoint
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public','html', 'index.html'));
});
// users enpoints
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
    let comInsert = 'INSERT INTO tblUsers (FirstName, LastName, Email, CreationDateTime, LastLoginDateTime, Password) VALUES (?,?,?,?,?,?)';
    let strFirstName = req.body.FirstName;
    let strLastName = req.body.LastName;
    let strEmail = req.body.Email;
    let strPassword = req.body.Password; // Not hashed yet for simplicity

    // CreationDateTime and LastLoginDateTime are set to the current date and time for user creation
    let strCreationDateTime = new Date(Date.now()).toISOString();
    let strLastLoginDateTime = new Date(Date.now()).toISOString();


    // Execute an SQL command to insert the new user into the database
    db.run(comInsert, [strFirstName, strLastName, strEmail, strCreationDateTime, strLastLoginDateTime, strPassword], function (err) {
        if (err) {
            res.status(400).json({ error: err.message});
        } else {
            res.status(201).json({ message: 'User created successfully', id: this.lastID});
        }
    });
});

// This endpoint is used to update an existing user in the database using their email as ID
app.put('/users/:email', (req, res) => {
    let comUpdate = 'UPDATE tblUsers SET FirstName = ?, LastName = ?, Email = ?, Password = ? WHERE Email = ?';
    let strFirstName = req.body.FirstName;
    let strLastName = req.body.LastName;
    let strEmail = req.body.Email;
    let strPassword = req.body.Password;
    let strID = req.params.email;

    db.run(comUpdate, [strFirstName, strLastName, strEmail, strID, strPassword], function (err) {
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


// courses endpoints
// this endpoint is used to retrieve all courses from the databse
app.get('/courses', (req, res) => {
    let comSelect = 'SELECT * FROM tblCourses';
    db.all(comSelect, function (err, result) {
        if (err) {
            res.status(400).json({ error: err.message });
        } else {
            res.status(200).json({ data: result });
        }
    });
});

// this endpoint is used to retrieve a specific course from the database using its course number, course section, and course term as a primary key
app.get('/courses/:courseNumber/:courseSection/:courseTerm', (req, res) => {
    let comSelect = 'SELECT * FROM tblCourses WHERE CourseNumber = ? AND CourseSection = ? AND CourseTerm = ?';
    let strCourseID = req.params.courseNumber;
    let strCourseSection = req.params.courseSection;
    let strCourseTerm = req.params.courseTerm;
    db.get(comSelect, [strCourseID, strCourseSection, strCourseTerm], function (err, result) {
        if (err) {
            res.status(400).json({ error: err.message });
        } else {
            res.status(200).json({ course: result });
        }
    });
});

// this endpoint is used to create a new course in the database using a course name, course number, course section,, course term, and start and end dates
app.post('/courses', (req, res) => {
    let comInsert = 'INSERT INTO tblCourses (CourseName, CourseNumber, CourseSection, CourseTerm, StartDate, EndDate) VALUES (?,?,?,?,?,?)';
    let strCourseName = req.body.CourseName;
    let strCourseNumber = req.body.CourseNumber;
    let strCourseSection = req.body.CourseSection;
    let strCourseTerm = req.body.CourseTerm;
    let strStartDate = req.body.StartDate;
    let strEndDate = req.body.EndDate;

    db.run(comInsert, [strCourseName, strCourseNumber, strCourseSection, strCourseTerm, strStartDate, strEndDate], function (err) {
        if (err) {
            res.status(400).json({ error: err.message });
        } else {
            res.status(201).json({ message: 'Course created successfully', id: this.lastID });
        }
    });
});

// this endpoint is used to update an existing course in the database using its course number, course section, and course term as a primary key
app.put('/courses/:courseNumber/:courseSection/:courseTerm', (req, res) => {
    let comUpdate = 'UPDATE tblCourses SET CourseName = ?, CourseNumber = ?, CourseSection = ?, CourseTerm = ?, StartDate = ?, EndDate = ? WHERE CourseNumber = ? AND CourseSection = ? AND CourseTerm = ?';
    let strCourseName = req.body.CourseName;
    let strCourseNumber = req.body.CourseNumber;
    let strCourseSection = req.body.CourseSection;
    let strCourseTerm = req.body.CourseTerm;
    let strStartDate = req.body.StartDate;
    let strEndDate = req.body.EndDate;
    let strID = req.params.courseNumber;
    let strSection = req.params.courseSection;
    let strTerm = req.params.courseTerm;

    db.run(comUpdate, [strCourseName, strCourseNumber, strCourseSection, strCourseTerm, strStartDate, strEndDate, strID, strSection, strTerm], function (err) {
        if (err) {
            res.status(400).json({ error: err.message });
        } else {
            res.status(201).json({ message: 'Course updated successfully' });
        }
    });
});

// this endpoint is used to delete a course from the database using its course number, course section, and course term as a primary key
app.delete('/courses/:courseNumber/:courseSection/:courseTerm', (req, res) => {
    let comDelete = 'DELETE FROM tblCourses WHERE CourseNumber = ? AND CourseSection = ? AND CourseTerm = ?';
    let strID = req.params.courseNumber;
    let strSection = req.params.courseSection;
    let strTerm = req.params.courseTerm;
    db.run(comDelete, [strID, strSection, strTerm], function (err) {
        if (err) {
            res.status(400).json({ error: err.message});
        } else {
            res.status(201).json({ message: 'Course deleted successfully' });
        }
    });
});


// coursegroups endpoints
// this endpoint is used to retrieve all course groups from the database
app.get('/coursegroups', (req, res) => {
    let comSelect = 'SELECT * FROM tblCourseGroups';
    db.all(comSelect, function (err, result) {
        if (err) {
            res.status(400).json({ error: errmessage });
        } else {
            res.status(200).json({ data: result });
        }
    });
});

// this endpoint is used to retrieve a specific course group from the database using its course number and group name as a primary key
app.get('/coursegroups/:courseNumber/:groupName', (req, res) => {
    let comSelect = 'SELECT * FROM tblCourseGroups WHERE CourseID = ? AND GroupName = ?';
    let strCourseID = req.params.courseNumber;
    let strGroupName = req.params.groupName;
    db.get(comSelect, [strCourseID, strGroupName], function (err, result) {
        if (err) {
            res.status(400).json({ error: err.message });
        } else {
            res.status(200).json({ courseGroup: result });
        }
    });
});

// this endpoint is used to retrieve all course groups for a specific course from the database using its course number as a foreign key
app.get('/coursegroups/:courseNumber', (req, res) => {
    let comSelect = 'SELECT * FROM tblCourseGroups WHERE CourseID = ?';
    let strCourseID = req.params.courseNumber;
    db.all(comSelect, [strCourseID], function (err, result) {
        if (err) {
            res.status(400).json({ error: err.message });
        } else {
            res.status(200).json({ courseGroups: result });
        }
    });
});

// this endpoint is used to create a new course group in the database using a course number and group name
app.post('/coursegroups', (req, res) => {
    let comInsert = 'INSERT INTO tblCourseGroups (CourseID, GroupName) VALUES (?,?)';
    let strCourseID = req.body.CourseID;
    let strGroupName = req.body.GroupName;
    db.run(comInsert, [strCourseID, strGroupName], function (err) {
        if (err) {
            res.status(400).json({ error: err.message });
        } else {
            res.status(201).json({ message: 'Course group created successfully', id: this.lastID });
        }
    });
});

// this endpoint is used to update an existing course group in the database using its course number and group name as a primary key
// this should be used to update the group name only, as the course number should only be changed using the courses endpoint
// however, we don't have enough time to implement any safeguards lololol
app.put('/coursegroups/:courseNumber/:groupName', (req, res) => {
    let comUpdate = 'UPDATE tblCourseGroups SET CourseID =?, GroupName = ? WHERE CourseID = ? AND GroupName = ?';
    let strCourseID = req.body.CourseID;
    let strGroupName = req.body.GroupName;
    let strID = req.params.courseNumber;
    let strGroupNameParam = req.params.groupName;
    db.run(comUpdate, [strCourseID, strGroupName, strID, strGroupNameParam], function (err) {
        if (err) {
            res.status(400).json({ error: err.message });
        } else {
            res.status(201).json({ message: 'Course group updated successfully' });
        }
    });
});

// this endpoint is used to delete a course group from the database using its course number and group name as a primary key
app.delete('/coursegroups/:courseNumber/:groupName', (req, res) => {
    let comDelete = 'DELETE FROM tblCourseGroups WHERE CourseID = ? AND GroupName = ?';
    let strID = req.params.courseNumber;
    let strGroupName = req.params.groupName;
    db.run(comDelete, [strID, strGroupName], function (err) {
        if (err) {
            res.status(400).json({ error: err.message });
        } else {
            res.status(201).json({ message: 'Course group deleted successfully' });
        }
    });
});


// endpoints for enrollments
// this endpoint is used to retrieve all enrollments from the database
app.get('/enrollments', (req, res) => {
    let comSelect = 'SELECT * FROM tblEnrollments';
    db.all(comSelect, function (err, result) {
        if (err) {
            res.status(400).json({ error: err.message });
        } else {
            res.status(200).json({ data: result });
        }
    });
});

// this endpoint is used to retrieve a specific enrollment from the database using its course number and user email as a primary key
app.get('/enrollments/:courseNumber/:email', (req, res) => {
    let comSelect = 'SELECT * FROM tblEnrollments WHERE CourseID = ? AND UserID = ?';
    let strCourseID = req.params.courseNumber;
    let strUserID = req.params.email;
    db.get(comSelect, [strCourseID, strUserID], function (err, result) {
        if (err) {
            res.status(400).json({ error: err.message });
        } else {
            res.status(200).json({ enrollment: result });
        }
    });
});

// this endpoint is used to create a new enrollment in the database using a course number and user email
app.post('/enrollments', (req, res) => {
    let comInsert = 'INSERT INTO tblEnrollments (CourseID, UserID) VALUES (?,?)';
    let strCourseID = req.body.CourseID;
    let strUserID = req.body.UserID;
    db.run(comInsert, [strCourseID, strUserID], function (err) {
        if (err) {
            res.status(400).json({ error: err.message });
        } else {
            res.status(201).json({ message: 'Enrollment created successfully', id: this.lastID });
        }
    });
});

// this endpoint is used to update and existing enrollment in the database using its course number and user email as a primary key
app.put('/enrollments/:courseNumber/:email', (req, res) => {
    let comUpdate = 'UPDATE tblEnrollments SET CourseID = ?, UserID = ? WHERE CourseID = ? AND UserID = ?';
    let strCourseID = req.body.CourseID;
    let strUserID = req.body.UserID;
    let strID = req.params.courseNumber;
    let strEmail = req.params.email;
    db.run(comUpdate, [strCourseID, strUserID, strID, strEmail], function (err) {
        if (err) {
            res.status(400).json({ error: err.message });
        } else {
            res.status(201).json({ message: 'Enrollment updated successfully' });
        }
    });
});

// this endpoint is used to delete an enrollment from the database using its course number and user email as a primary key
app.delete('/enrollments/:courseNumber/:email', (req, res) => {
    let comDelete = 'DELETE FROM tblEnrollments WHERE CourseID = ? AND UserID = ?';
    let strID = req.params.courseNumber;
    let strEmail = req.params.email;
    db.run(comDelete, [strID, strEmail], function (err) {
        if (err) {
            res.status(400).json({ error: err.message });
        } else {
            res.status(201).json({ message: 'Enrollment deleted successfully' });
        }
    });
});


app.listen(HTTP_PORT,() => {
    console.log('App listening on',HTTP_PORT)
});
