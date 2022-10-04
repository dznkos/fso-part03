const express = require('express')
require('dotenv').config()

const morgan = require('morgan')
const cors = require('cors')

const app = express()

app.use(express.json()) //json-parser (body)
app.use(cors())
app.use(express.static('build'))

const Person = require('./models/person')
const { default: mongoose } = require('mongoose')

morgan.token( 'body', req => {
  return JSON.stringify(req.body)
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))


app.get('/', (request, response) => {
  response.send('<h1>Phonebook api</h1>')
})
//list
app.get('/api/persons',(request, response, next) => {

  Person.find({})
    .then( persons => {
      response.json(persons)
    })
    .catch( error => {
      next(error)
    })

})
//find
app.get('/api/persons/:id', (request, response,next) => {

  Person.findById(request.params.id)
    .then( resultPerson => {
      if (resultPerson) {
        return response.json(resultPerson)
      }else{
        return response.status(404).end()
      }
    })
    .catch( error => {
      next(error)
    })
})
//remove
app.delete('/api/persons/:id', (request, response, next) => {

  const exist = mongoose.Types.ObjectId(request.params.id)

  if (!exist) {
    return response.status(404).end()
  }

  Person.findByIdAndRemove(request.params.id)
    .then( result => {
      response.json(result)
    })
    .catch( error => {
      next(error)
    })
})
//add
app.post('/api/persons/', (request, response, next) => {

  const body = request.body

  if (!body.name || !body.number) {
    return response.status(500).json({
      error: 'content missing'
    })
  }

  const person = new Person({
    name: body.name,
    number: body.number
  })

  person.save()
    .then( savedPerson => savedPerson.toJSON() )
    .then( savedAndFormattedPerson => {
      response.json(savedAndFormattedPerson)
    })
    .catch( error => {
      next(error)
    })

})
//update
app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body

  Person.updateOne(
    { _id: request.params.id },
    { $set: { number: body.number, name: body.name } },
    { runValidators: true, context: 'query' }
  )
    .then( resultUpdate => {
      response.json(resultUpdate)
    })
    .catch( error => {
      next(error)
    })
})
//info
app.get('/info', (request, response) => {
  const date = new Date()

  Person.find({}).count( function(err, count){
    const html = `<div>
      Phonebook has info for ${count} people
      <br> ${date}
      </div>`
    response.send(html)
  })

})

// EndPoint Unknown
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)

// Handler error
const errorHandler = (error, request, response, next) => {
  console.log(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if ( error.name === 'ValidationError') {
    return response.status(400).send({ error: error.message })
  }
  next(error)
}
app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server deployed in ${PORT}`)
})

