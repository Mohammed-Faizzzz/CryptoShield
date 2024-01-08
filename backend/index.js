const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
//require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());
// app.options('*', cors());

// for debugging purposes, can be deleted later
// shows the json of the request in the console
const morgan = require('morgan');
app.use(morgan('tiny'));


// MongoDB connection
mongoose.connect("mongodb://localhost:27017", { useNewUrlParser: true, useUnifiedTopology: true, dbName: 'SwiftPass' })
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

// User routes
app.use('/api/users', require('./routes/users'));

app.use('/api/concerts', require('./routes/concerts'));


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
