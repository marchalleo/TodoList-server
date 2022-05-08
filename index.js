const express = require("express");
const mysql = require("mysql");
const app = express();
const port = 8000;
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
var cors = require('cors')
var formatISO = require('date-fns/formatISO')

app.use(cors())

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.get("/", (req, res) => {
  res.json({ message: "ok" });
});

//get
app.get('/api/todos', async (req, res) => {
    const tasks = await prisma.task.findMany()
    res.json(tasks)
  })

//post
app.post(`/api/todos`, async (req, res) => {
  const ISO = formatISO(new Date(req.body.date))
    const result = await prisma.task.create({
      data: {
        title: req.body.title,
        description: req.body.description,
        date:ISO,
      },
    })
    res.json(result)
  })

//get by id
app.get('/api/todos/:id', async (req, res) => {
    const todo = await prisma.task.findUnique({
      where: { id: parseInt(req.params.id) },
    })
    res.json(todo)
  })

//put
app.put(`/api/todos/:id`, async (req, res) => {
  const ISO = formatISO(new Date(req.body.date))
    const todoput = await prisma.task.update({
        where: { id: parseInt(req.params.id) },
        data: {
            title: req.body.title,
            description: req.body.description,
            date:ISO,
          },
    })
    res.json(todoput)
  })

//patch
app.patch(`/api/todos/:id`, async (req, res) => {
  // const ISO = formatISO(new Date(req.body.date))
    const todoput = await prisma.task.update({
        where: { id: parseInt(req.params.id) },
        data: {
            completed: req.body.completed,
          },
    })
    res.json(todoput)
  })

//delete
app.delete(`/api/todos/:id`, async (req, res) => {
    const tododelete = await prisma.task.delete({
        where: { id: parseInt(req.params.id) },
    })
    res.json(tododelete)
  })

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});


const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'todolist'
});
// open the MySQL connection
connection.connect(error => {
  if (error) throw error;
  console.log("Successfully connected to the database.");
});
module.exports = connection;