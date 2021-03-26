const express = require('express')
const app = express()

let persons = [
  {
    name: "Dan Abramov",
    number: "12-43-234345",
    id: 3
  },
  {
    name: "John Deacon",
    number: "23-42-93823",
    id: 7
  },
  {
    name: "Freddie Mercury",
    number: "23-23-67987",
    id: 9
  },
  {
    name: "Brian May",
    number: "21-32-33214",
    id: 10
  }
]

app.use(express.json())

app.get('/', (request, response) => {
  response.end('Ok Work')
})

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(el => el.id === id)
  
  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  person = persons.filter(el => el.id !== id)

  response.status(204).end()
})

app.post('/api/persons', (request, response) => {
  const random = Math.floor(Math.random() * Math.floor(100));

  const person = request.body
  
  if (!person.name || !person.number) {
    return response.status(400).json({
      error: 'name or number is missing'
    })
  }

  const check = persons.some(el => el.name === person.name)

  if (check) {
    return response.status(400).json({
      error: 'name must be unique'
    })
  }

  person.id    = random

  persons.concat(person)
  response.json(person)
})

app.get('/info', (request, response) => {
  let info = `<p>Phonebook has info for ${persons.length} people</p>`
  info += new Date()

  response.send(info)
  
  // Question ??
  // info return "Phonebook has info for 4 people
  //              Fri Mar 26 2021 14:19:52 GMT+0700 (Western Indonesia Time)"
  // new Date() return "2021-03-26T07:20:33.723Z"
})

const PORT = 3001
app.listen(PORT)
console.log(`Listen on port ${PORT}`)