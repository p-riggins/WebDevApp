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
            res.status(400).json({ error: err.message });
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

// Phone endpoints
// Get all phone records
app.get('/phones', (req, res) => {
    let comSelect = 'SELECT * FROM tblPhone';
    db.all(comSelect, function (err, result) {
        if (err) {
            res.status(400).json({ error: err.message });
        } else {
            res.status(200).json({ data: result });
        }
    });
});

// Get specific phone record
app.get('/phones/:nationCode/:areaCode/:phoneNumber', (req, res) => {
    let comSelect = 'SELECT * FROM tblPhone WHERE NationCode = ? AND AreaCode = ? AND PhoneNumber = ?';
    let nationCode = req.params.nationCode;
    let areaCode = req.params.areaCode;
    let phoneNumber = req.params.phoneNumber;
    db.get(comSelect, [nationCode, areaCode, phoneNumber], function (err, result) {
        if (err) {
            res.status(400).json({ error: err.message });
        } else {
            res.status(200).json({ phone: result });
        }
    });
});

// Create new phone record
app.post('/phones', (req, res) => {
    let comInsert = 'INSERT INTO tblPhone (NationCode, AreaCode, PhoneNumber, Status) VALUES (?,?,?,?)';
    let nationCode = req.body.NationCode;
    let areaCode = req.body.AreaCode;
    let phoneNumber = req.body.PhoneNumber;
    let status = req.body.Status;

    db.run(comInsert, [nationCode, areaCode, phoneNumber, status], function (err) {
        if (err) {
            res.status(400).json({ error: err.message });
        } else {
            res.status(201).json({ message: 'Phone record created successfully', id: this.lastID });
        }
    });
});

// Update phone record
app.put('/phones/:nationCode/:areaCode/:phoneNumber', (req, res) => {
    let comUpdate = 'UPDATE tblPhone SET NationCode = ?, AreaCode = ?, PhoneNumber = ?, Status = ? WHERE NationCode = ? AND AreaCode = ? AND PhoneNumber = ?';
    let nationCode = req.body.NationCode;
    let areaCode = req.body.AreaCode;
    let phoneNumber = req.body.PhoneNumber;
    let status = req.body.Status;
    let oldNationCode = req.params.nationCode;
    let oldAreaCode = req.params.areaCode;
    let oldPhoneNumber = req.params.phoneNumber;

    db.run(comUpdate, [nationCode, areaCode, phoneNumber, status, oldNationCode, oldAreaCode, oldPhoneNumber], function (err) {
        if (err) {
            res.status(400).json({ error: err.message });
        } else {
            res.status(201).json({ message: 'Phone record updated successfully' });
        }
    });
});

// Delete phone record
app.delete('/phones/:nationCode/:areaCode/:phoneNumber', (req, res) => {
    let comDelete = 'DELETE FROM tblPhone WHERE NationCode = ? AND AreaCode = ? AND PhoneNumber = ?';
    let nationCode = req.params.nationCode;
    let areaCode = req.params.areaCode;
    let phoneNumber = req.params.phoneNumber;
    db.run(comDelete, [nationCode, areaCode, phoneNumber], function (err) {
        if (err) {
            res.status(400).json({ error: err.message });
        } else {
            res.status(201).json({ message: 'Phone record deleted successfully' });
        }
    });
});

// Logs endpoints
// Get all logs
app.get('/logs', (req, res) => {
    let comSelect = 'SELECT * FROM tblLogs';
    db.all(comSelect, function (err, result) {
        if (err) {
            res.status(400).json({ error: err.message });
        } else {
            res.status(200).json({ data: result });
        }
    });
});

// Get specific log by DateTime
app.get('/logs/:dateTime', (req, res) => {
    let comSelect = 'SELECT * FROM tblLogs WHERE DateTime = ?';
    let dateTime = req.params.dateTime;
    db.get(comSelect, [dateTime], function (err, result) {
        if (err) {
            res.status(400).json({ error: err.message });
        } else {
            res.status(200).json({ log: result });
        }
    });
});

// Create new log
app.post('/logs', (req, res) => {
    let comInsert = 'INSERT INTO tblLogs (Description, Type, DateTime) VALUES (?,?,?)';
    let description = req.body.Description;
    let type = req.body.Type;
    let dateTime = req.body.DateTime;

    db.run(comInsert, [description, type, dateTime], function (err) {
        if (err) {
            res.status(400).json({ error: err.message });
        } else {
            res.status(201).json({ message: 'Log created successfully', id: this.lastID });
        }
    });
});

// Update log
app.put('/logs/:dateTime', (req, res) => {
    let comUpdate = 'UPDATE tblLogs SET Description = ?, Type = ?, DateTime = ? WHERE DateTime = ?';
    let description = req.body.Description;
    let type = req.body.Type;
    let dateTime = req.body.DateTime;
    let oldDateTime = req.params.dateTime;

    db.run(comUpdate, [description, type, dateTime, oldDateTime], function (err) {
        if (err) {
            res.status(400).json({ error: err.message });
        } else {
            res.status(201).json({ message: 'Log updated successfully' });
        }
    });
});

// Delete log
app.delete('/logs/:dateTime', (req, res) => {
    let comDelete = 'DELETE FROM tblLogs WHERE DateTime = ?';
    let dateTime = req.params.dateTime;
    db.run(comDelete, [dateTime], function (err) {
        if (err) {
            res.status(400).json({ error: err.message });
        } else {
            res.status(201).json({ message: 'Log deleted successfully' });
        }
    });
});

// Group Members endpoints
// Get all group members
app.get('/groupmembers', (req, res) => {
    let comSelect = 'SELECT * FROM tblGroupMembers';
    db.all(comSelect, function (err, result) {
        if (err) {
            res.status(400).json({ error: err.message });
        } else {
            res.status(200).json({ data: result });
        }
    });
});

// Get specific group member
app.get('/groupmembers/:groupId/:userId', (req, res) => {
    let comSelect = 'SELECT * FROM tblGroupMembers WHERE GroupID = ? AND UserID = ?';
    let groupId = req.params.groupId;
    let userId = req.params.userId;
    db.get(comSelect, [groupId, userId], function (err, result) {
        if (err) {
            res.status(400).json({ error: err.message });
        } else {
            res.status(200).json({ groupMember: result });
        }
    });
});

// Create new group member
app.post('/groupmembers', (req, res) => {
    let comInsert = 'INSERT INTO tblGroupMembers (GroupID, UserID) VALUES (?,?)';
    let groupId = req.body.GroupID;
    let userId = req.body.UserID;

    db.run(comInsert, [groupId, userId], function (err) {
        if (err) {
            res.status(400).json({ error: err.message });
        } else {
            res.status(201).json({ message: 'Group member added successfully' });
        }
    });
});

// Update group member
app.put('/groupmembers/:groupId/:userId', (req, res) => {
    let comUpdate = 'UPDATE tblGroupMembers SET GroupID = ?, UserID = ? WHERE GroupID = ? AND UserID = ?';
    let newGroupId = req.body.GroupID;
    let newUserId = req.body.UserID;
    let oldGroupId = req.params.groupId;
    let oldUserId = req.params.userId;

    db.run(comUpdate, [newGroupId, newUserId, oldGroupId, oldUserId], function (err) {
        if (err) {
            res.status(400).json({ error: err.message });
        } else {
            res.status(201).json({ message: 'Group member updated successfully' });
        }
    });
});

// Delete group member
app.delete('/groupmembers/:groupId/:userId', (req, res) => {
    let comDelete = 'DELETE FROM tblGroupMembers WHERE GroupID = ? AND UserID = ?';
    let groupId = req.params.groupId;
    let userId = req.params.userId;
    db.run(comDelete, [groupId, userId], function (err) {
        if (err) {
            res.status(400).json({ error: err.message });
        } else {
            res.status(201).json({ message: 'Group member removed successfully' });
        }
    });
});

// Course Groups endpoints
// Get all course groups
app.get('/coursegroups', (req, res) => {
    let comSelect = 'SELECT * FROM tblCourseGroups';
    db.all(comSelect, function (err, result) {
        if (err) {
            res.status(400).json({ error: err.message });
        } else {
            res.status(200).json({ data: result });
        }
    });
});

// Get specific course group
app.get('/coursegroups/:groupName/:courseId', (req, res) => {
    let comSelect = 'SELECT * FROM tblCourseGroups WHERE GroupName = ? AND CourseID = ?';
    let groupName = req.params.groupName;
    let courseId = req.params.courseId;
    db.get(comSelect, [groupName, courseId], function (err, result) {
        if (err) {
            res.status(400).json({ error: err.message });
        } else {
            res.status(200).json({ courseGroup: result });
        }
    });
});

// Create new course group
app.post('/coursegroups', (req, res) => {
    let comInsert = 'INSERT INTO tblCourseGroups (GroupName, CourseID) VALUES (?,?)';
    let groupName = req.body.GroupName;
    let courseId = req.body.CourseID;

    db.run(comInsert, [groupName, courseId], function (err) {
        if (err) {
            res.status(400).json({ error: err.message });
        } else {
            res.status(201).json({ message: 'Course group created successfully' });
        }
    });
});

// Update course group
app.put('/coursegroups/:groupName/:courseId', (req, res) => {
    let comUpdate = 'UPDATE tblCourseGroups SET GroupName = ?, CourseID = ? WHERE GroupName = ? AND CourseID = ?';
    let newGroupName = req.body.GroupName;
    let newCourseId = req.body.CourseID;
    let oldGroupName = req.params.groupName;
    let oldCourseId = req.params.courseId;

    db.run(comUpdate, [newGroupName, newCourseId, oldGroupName, oldCourseId], function (err) {
        if (err) {
            res.status(400).json({ error: err.message });
        } else {
            res.status(201).json({ message: 'Course group updated successfully' });
        }
    });
});

// Delete course group
app.delete('/coursegroups/:groupName/:courseId', (req, res) => {
    let comDelete = 'DELETE FROM tblCourseGroups WHERE GroupName = ? AND CourseID = ?';
    let groupName = req.params.groupName;
    let courseId = req.params.courseId;
    db.run(comDelete, [groupName, courseId], function (err) {
        if (err) {
            res.status(400).json({ error: err.message });
        } else {
            res.status(201).json({ message: 'Course group deleted successfully' });
        }
    });
});

// Socials endpoints
// Get all socials
app.get('/socials', (req, res) => {
    let comSelect = 'SELECT * FROM tblSocials';
    db.all(comSelect, function (err, result) {
        if (err) {
            res.status(400).json({ error: err.message });
        } else {
            res.status(200).json({ data: result });
        }
    });
});

// Get specific social
app.get('/socials/:socialType/:username', (req, res) => {
    let comSelect = 'SELECT * FROM tblSocials WHERE SocialType = ? AND Username = ?';
    let socialType = req.params.socialType;
    let username = req.params.username;
    db.get(comSelect, [socialType, username], function (err, result) {
        if (err) {
            res.status(400).json({ error: err.message });
        } else {
            res.status(200).json({ social: result });
        }
    });
});

// Create new social
app.post('/socials', (req, res) => {
    let comInsert = 'INSERT INTO tblSocials (SocialType, Username, UserEmail) VALUES (?,?,?)';
    let socialType = req.body.SocialType;
    let username = req.body.Username;
    let userEmail = req.body.UserEmail;

    db.run(comInsert, [socialType, username, userEmail], function (err) {
        if (err) {
            res.status(400).json({ error: err.message });
        } else {
            res.status(201).json({ message: 'Social account added successfully' });
        }
    });
});

// Update social
app.put('/socials/:socialType/:username', (req, res) => {
    let comUpdate = 'UPDATE tblSocials SET SocialType = ?, Username = ?, UserEmail = ? WHERE SocialType = ? AND Username = ?';
    let newSocialType = req.body.SocialType;
    let newUsername = req.body.Username;
    let userEmail = req.body.UserEmail;
    let oldSocialType = req.params.socialType;
    let oldUsername = req.params.username;

    db.run(comUpdate, [newSocialType, newUsername, userEmail, oldSocialType, oldUsername], function (err) {
        if (err) {
            res.status(400).json({ error: err.message });
        } else {
            res.status(201).json({ message: 'Social account updated successfully' });
        }
    });
});

// Delete social
app.delete('/socials/:socialType/:username', (req, res) => {
    let comDelete = 'DELETE FROM tblSocials WHERE SocialType = ? AND Username = ?';
    let socialType = req.params.socialType;
    let username = req.params.username;
    db.run(comDelete, [socialType, username], function (err) {
        if (err) {
            res.status(400).json({ error: err.message });
        } else {
            res.status(201).json({ message: 'Social account deleted successfully' });
        }
    });
});

// Sessions endpoints
// Get all sessions
app.get('/sessions', (req, res) => {
    let comSelect = 'SELECT * FROM tblSessions';
    db.all(comSelect, function (err, result) {
        if (err) {
            res.status(400).json({ error: err.message });
        } else {
            res.status(200).json({ data: result });
        }
    });
});

// Get specific session
app.get('/sessions/:userId/:startDateTime', (req, res) => {
    let comSelect = 'SELECT * FROM tblSessions WHERE UserID = ? AND StartDateTime = ?';
    let userId = req.params.userId;
    let startDateTime = req.params.startDateTime;
    db.get(comSelect, [userId, startDateTime], function (err, result) {
        if (err) {
            res.status(400).json({ error: err.message });
        } else {
            res.status(200).json({ session: result });
        }
    });
});

// Create new session
app.post('/sessions', (req, res) => {
    let comInsert = 'INSERT INTO tblSessions (UserID, StartDateTime, LastUsedDateTime, Status) VALUES (?,?,?,?)';
    let userId = req.body.UserID;
    let startDateTime = req.body.StartDateTime;
    let lastUsedDateTime = req.body.LastUsedDateTime;
    let status = req.body.Status;

    db.run(comInsert, [userId, startDateTime, lastUsedDateTime, status], function (err) {
        if (err) {
            res.status(400).json({ error: err.message });
        } else {
            res.status(201).json({ message: 'Session created successfully' });
        }
    });
});

// Update session
app.put('/sessions/:userId/:startDateTime', (req, res) => {
    let comUpdate = 'UPDATE tblSessions SET UserID = ?, StartDateTime = ?, LastUsedDateTime = ?, Status = ? WHERE UserID = ? AND StartDateTime = ?';
    let newUserId = req.body.UserID;
    let newStartDateTime = req.body.StartDateTime;
    let lastUsedDateTime = req.body.LastUsedDateTime;
    let status = req.body.Status;
    let oldUserId = req.params.userId;
    let oldStartDateTime = req.params.startDateTime;

    db.run(comUpdate, [newUserId, newStartDateTime, lastUsedDateTime, status, oldUserId, oldStartDateTime], function (err) {
        if (err) {
            res.status(400).json({ error: err.message });
        } else {
            res.status(201).json({ message: 'Session updated successfully' });
        }
    });
});

// Delete session
app.delete('/sessions/:userId/:startDateTime', (req, res) => {
    let comDelete = 'DELETE FROM tblSessions WHERE UserID = ? AND StartDateTime = ?';
    let userId = req.params.userId;
    let startDateTime = req.params.startDateTime;
    db.run(comDelete, [userId, startDateTime], function (err) {
        if (err) {
            res.status(400).json({ error: err.message });
        } else {
            res.status(201).json({ message: 'Session deleted successfully' });
        }
    });
});

// Assessment Responses endpoints
// Get all assessment responses
app.get('/assessmentresponses', (req, res) => {
    let comSelect = 'SELECT * FROM tblAssessmentResponses';
    db.all(comSelect, function (err, result) {
        if (err) {
            res.status(400).json({ error: err.message });
        } else {
            res.status(200).json({ data: result });
        }
    });
});

// Get specific assessment response
app.get('/assessmentresponses/:assessmentId/:userId/:questionId', (req, res) => {
    let comSelect = 'SELECT * FROM tblAssessmentResponses WHERE AssessmentID = ? AND UserID = ? AND QuestionID = ?';
    let assessmentId = req.params.assessmentId;
    let userId = req.params.userId;
    let questionId = req.params.questionId;
    db.get(comSelect, [assessmentId, userId, questionId], function (err, result) {
        if (err) {
            res.status(400).json({ error: err.message });
        } else {
            res.status(200).json({ response: result });
        }
    });
});

// Create new assessment response
app.post('/assessmentresponses', (req, res) => {
    let comInsert = 'INSERT INTO tblAssessmentResponses (AssessmentID, UserID, QuestionID, Response, TargetUserID, Public) VALUES (?,?,?,?,?,?)';
    let assessmentId = req.body.AssessmentID;
    let userId = req.body.UserID;
    let questionId = req.body.QuestionID;
    let response = req.body.Response;
    let targetUserId = req.body.TargetUserID;
    let isPublic = req.body.Public;

    db.run(comInsert, [assessmentId, userId, questionId, response, targetUserId, isPublic], function (err) {
        if (err) {
            res.status(400).json({ error: err.message });
        } else {
            res.status(201).json({ message: 'Assessment response created successfully' });
        }
    });
});

// Update assessment response
app.put('/assessmentresponses/:assessmentId/:userId/:questionId', (req, res) => {
    let comUpdate = 'UPDATE tblAssessmentResponses SET AssessmentID = ?, UserID = ?, QuestionID = ?, Response = ?, TargetUserID = ?, Public = ? WHERE AssessmentID = ? AND UserID = ? AND QuestionID = ?';
    let newAssessmentId = req.body.AssessmentID;
    let newUserId = req.body.UserID;
    let newQuestionId = req.body.QuestionID;
    let response = req.body.Response;
    let targetUserId = req.body.TargetUserID;
    let isPublic = req.body.Public;
    let oldAssessmentId = req.params.assessmentId;
    let oldUserId = req.params.userId;
    let oldQuestionId = req.params.questionId;

    db.run(comUpdate, [newAssessmentId, newUserId, newQuestionId, response, targetUserId, isPublic, oldAssessmentId, oldUserId, oldQuestionId], function (err) {
        if (err) {
            res.status(400).json({ error: err.message });
        } else {
            res.status(201).json({ message: 'Assessment response updated successfully' });
        }
    });
});

// Delete assessment response
app.delete('/assessmentresponses/:assessmentId/:userId/:questionId', (req, res) => {
    let comDelete = 'DELETE FROM tblAssessmentResponses WHERE AssessmentID = ? AND UserID = ? AND QuestionID = ?';
    let assessmentId = req.params.assessmentId;
    let userId = req.params.userId;
    let questionId = req.params.questionId;
    db.run(comDelete, [assessmentId, userId, questionId], function (err) {
        if (err) {
            res.status(400).json({ error: err.message });
        } else {
            res.status(201).json({ message: 'Assessment response deleted successfully' });
        }
    });
});

// Assessment Questions endpoints
// Get all assessment questions
app.get('/assessmentquestions', (req, res) => {
    let comSelect = 'SELECT * FROM tblAssessmentQuestions';
    db.all(comSelect, function (err, result) {
        if (err) {
            res.status(400).json({ error: err.message });
        } else {
            res.status(200).json({ data: result });
        }
    });
});

// Create new assessment question
app.post('/assessmentquestions', (req, res) => {
    let comInsert = 'INSERT INTO tblAssessmentQuestions (QuestionType, Options, QuestionNarrative, HelperText) VALUES (?,?,?,?)';
    let questionType = req.body.QuestionType;
    let options = req.body.Options;
    let questionNarrative = req.body.QuestionNarrative;
    let helperText = req.body.HelperText;

    db.run(comInsert, [questionType, options, questionNarrative, helperText], function (err) {
        if (err) {
            res.status(400).json({ error: err.message });
        } else {
            res.status(201).json({ message: 'Assessment question created successfully', id: this.lastID });
        }
    });
});

// Update assessment question
app.put('/assessmentquestions/:rowid', (req, res) => {
    let comUpdate = 'UPDATE tblAssessmentQuestions SET QuestionType = ?, Options = ?, QuestionNarrative = ?, HelperText = ? WHERE rowid = ?';
    let questionType = req.body.QuestionType;
    let options = req.body.Options;
    let questionNarrative = req.body.QuestionNarrative;
    let helperText = req.body.HelperText;
    let rowid = req.params.rowid;

    db.run(comUpdate, [questionType, options, questionNarrative, helperText, rowid], function (err) {
        if (err) {
            res.status(400).json({ error: err.message });
        } else {
            res.status(201).json({ message: 'Assessment question updated successfully' });
        }
    });
});

// Delete assessment question
app.delete('/assessmentquestions/:rowid', (req, res) => {
    let comDelete = 'DELETE FROM tblAssessmentQuestions WHERE rowid = ?';
    let rowid = req.params.rowid;
    db.run(comDelete, [rowid], function (err) {
        if (err) {
            res.status(400).json({ error: err.message });
        } else {
            res.status(201).json({ message: 'Assessment question deleted successfully' });
        }
    });
});

// Assessments endpoints
// Get all assessments
app.get('/assessments', (req, res) => {
    let comSelect = 'SELECT * FROM tblAssessments';
    db.all(comSelect, function (err, result) {
        if (err) {
            res.status(400).json({ error: err.message });
        } else {
            res.status(200).json({ data: result });
        }
    });
});

// Get specific assessment
app.get('/assessments/:name/:courseId', (req, res) => {
    let comSelect = 'SELECT * FROM tblAssessments WHERE Name = ? AND CourseID = ?';
    let name = req.params.name;
    let courseId = req.params.courseId;
    db.get(comSelect, [name, courseId], function (err, result) {
        if (err) {
            res.status(400).json({ error: err.message });
        } else {
            res.status(200).json({ assessment: result });
        }
    });
});

// Create new assessment
app.post('/assessments', (req, res) => {
    let comInsert = 'INSERT INTO tblAssessments (CourseID, StartDate, EndDate, Name, Status, Type) VALUES (?,?,?,?,?,?)';
    let courseId = req.body.CourseID;
    let startDate = req.body.StartDate;
    let endDate = req.body.EndDate;
    let name = req.body.Name;
    let status = req.body.Status;
    let type = req.body.Type;

    db.run(comInsert, [courseId, startDate, endDate, name, status, type], function (err) {
        if (err) {
            res.status(400).json({ error: err.message });
        } else {
            res.status(201).json({ message: 'Assessment created successfully' });
        }
    });
});

// Update assessment
app.put('/assessments/:name/:courseId', (req, res) => {
    let comUpdate = 'UPDATE tblAssessments SET CourseID = ?, StartDate = ?, EndDate = ?, Name = ?, Status = ?, Type = ? WHERE Name = ? AND CourseID = ?';
    let newCourseId = req.body.CourseID;
    let startDate = req.body.StartDate;
    let endDate = req.body.EndDate;
    let newName = req.body.Name;
    let status = req.body.Status;
    let type = req.body.Type;
    let oldName = req.params.name;
    let oldCourseId = req.params.courseId;

    db.run(comUpdate, [newCourseId, startDate, endDate, newName, status, type, oldName, oldCourseId], function (err) {
        if (err) {
            res.status(400).json({ error: err.message });
        } else {
            res.status(201).json({ message: 'Assessment updated successfully' });
        }
    });
});

// Delete assessment
app.delete('/assessments/:name/:courseId', (req, res) => {
    let comDelete = 'DELETE FROM tblAssessments WHERE Name = ? AND CourseID = ?';
    let name = req.params.name;
    let courseId = req.params.courseId;
    db.run(comDelete, [name, courseId], function (err) {
        if (err) {
            res.status(400).json({ error: err.message });
        } else {
            res.status(201).json({ message: 'Assessment deleted successfully' });
        }
    });
});

app.listen(HTTP_PORT,() => {
    console.log('App listening on',HTTP_PORT)
});
