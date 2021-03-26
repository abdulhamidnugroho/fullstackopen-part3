const { request, response } = require('express')
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
  const maxId = persons.length > 0 
                ? Math.max(...persons.map(el => el.id))
                : 0

  const person = request.body
  person.id    = maxId + 1

  persons.concat(person)
  
  console.log(person)
  response.json(person)
})

const PORT = 3001
app.listen(PORT)
console.log(`Listen on port ${PORT}`)