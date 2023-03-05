const express = require('express');

const app = express();
const toDoList =  [
    {id: 1, taskName: 'Buy groceries', isDone: false , isTranslated: false},
    {id: 2, taskName: 'Eat food', isDone: false , isTranslated: false},
    {id: 3, taskName: 'Code', isDone: false , isTranslated: false},
];

app.use(( req, res, next ) => {
    //CORS Headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    next();
});

app.use('/todolist',( req, res, next) => {
    res.json({'toDoList': toDoList});
    res.send('Hello from Express');
});

module.exports = app;