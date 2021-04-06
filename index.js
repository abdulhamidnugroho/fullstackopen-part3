require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const app = express()
const cors = require('cors')
const Person = require('./models/person')
const { request } = require('express')

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

app.use(cors())

app.use(morgan((tokens, req, res) => {
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms',
    req.method === 'POST' ? JSON.stringify(req.body) : ''
  ].join(' ')
}))

app.use(express.json())

app.use(express.static('build'))

app.get('/', (request, response) => {
  response.end('Ok Work')
})

app.get('/api/persons', (request, response) => {
  Person.find({}).then(person => response.json(person))
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

app.delete('/api/persons/:id', (request, response, next) => {
  console.log(request.params)
  response.json(request.params)
  // Person.findByIdAndRemove(request.params.id)
  //   .then(result => response.status(204).end())
  //   .catch(error => next(error))
})

app.post('/api/persons', (request, response) => {
  const body = request.body

  if (body === undefined) {
    return response.status(400).json({ error: 'content missing' })
  }

  const person = new Person({
    name: body.name,
    number: body.number
  })

  person.save().then(result => {
    response.json(result)
  })

  // const random = Math.floor(Math.random() * Math.floor(100));

  // const person = request.body
  
  // if (!person.name || !person.number) {
  //   return response.status(400).json({
  //     error: 'name or number is missing'
  //   })
  // }

  // const check = persons.some(el => el.name === person.name)

  // if (check) {
  //   return response.status(400).json({
  //     error: 'name must be unique'
  //   })
  // }

  // person.id    = random

  // persons.concat(person)
  // response.json(person)
})

const errorHandler = (error, request, response, next) => {
  console.log(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }

  next(error)
}

app.use(errorHandler)

app.get('/info', (request, response) => {
  let info = `<p>Phonebook has info for ${persons.length} people</p>`
  info += new Date()

  response.send(info)
  
  // Question ??
  // info return "Phonebook has info for 4 people
  //              Fri Mar 26 2021 14:19:52 GMT+0700 (Western Indonesia Time)"
  // new Date() return "2021-03-26T07:20:33.723Z"
})

const PORT = process.env.PORT || 3001
app.listen(PORT)
console.log(`Listen on port ${PORT}`)