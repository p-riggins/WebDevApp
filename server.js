const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();

const dbSource = 'webdev.db';