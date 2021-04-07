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

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => response.json(person))
    .catch(error => next(error))

})

app.delete('/api/persons/:id', (request, response, next) => {
  console.log(request.params)

  Person.findByIdAndRemove(request.params.id)
    .then(result => response.status(204).end())
    .catch(error => next(error))
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
})

app.put('/api/persons/:id', (request, response, next) => {
  console.log(request.params)
  const body = request.body

  const person = {
    name: body.name,
    number: body.number
  }

  Person.findByIdAndUpdate(request.params.id, person)
    .then(updated => response.json(updated))
    .catch(error => next(error))

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
  Person.find({}).then(person => {
    console.log(person.length)

    let info = `<p>Phonebook has info for ${person.length} people</p>`
    info += new Date()

    response.send(info)
  })
  
  // Question ??
  // info return "Phonebook has info for 4 people
  //              Fri Mar 26 2021 14:19:52 GMT+0700 (Western Indonesia Time)"
  // new Date() return "2021-03-26T07:20:33.723Z"
})

const PORT = process.env.PORT || 3001
app.listen(PORT)
console.log(`Listen on port ${PORT}`)