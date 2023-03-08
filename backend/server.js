const express = require('express');
const app = express();
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes.js');
const taskRoutes = require('./routes/taskRoutes.js');
const cors = require('cors');
const helmet = require('helmet');

//ENV config ~~~~~~~~~~~~~~~~~~~~~~~

dotenv.config();

//Other configurations ~~~~~~~~~~~~~~~~~~~~~~~

app.use(bodyParser.json());

app.use(helmet());

app.use(cors());

// app.use(( req, res, next ) => {
//     //CORS Headers
//     res.setHeader('Access-Control-Allow-Origin', '*');
//     res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
//     next();
// });

//DB connection ~~~~~~~~~~~~~~~~~~~~~~~



//moved to db.js

//Routes ~~~~~~~~~~~~~~~~~~~~~~~

app.use('/auth', authRoutes);
app.use('/tasks', taskRoutes);


//SERVER ~~~~~~~~~~~~~~~~~~~~~~~
// Listen to the specified port, otherwise 3080

const PORT = process.env.PORT || 3080;
app.listen(PORT, () => {
  console.log(`Server Running: http://localhost:${PORT}`);
  //getPostgresVersion();
 
});
