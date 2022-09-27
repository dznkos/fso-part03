const express = require("express");

const morgan = require('morgan');

const cors = require('cors');

const app = express();

app.use(express.json())
app.use(express.static('build'))
app.use(cors())

morgan.token( 'body', req => {
  return JSON.stringify(req.body)
}
)

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

let persons = [
  { 
    "id": 1,
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "id": 2,
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": 3,
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": 4,
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  }
]

app.get('/', (request, response) => {
  response.send('<h1>Phonebook api</h1>')
})
//list
app.get('/api/persons',(request, response)=> {
  response.json(persons)
})
//find
app.get('/api/persons/:id', (request, response)=> {
  const id = Number(request.params.id);
  const person = persons.find( p => p.id === id);
  response.json(person)
})
//remove
app.delete('/api/persons/:id', (request, response)=> {
  let id = Number(request.params.id);

  let exist = persons.find( p => p.id === id)

  if (!exist) {
    return response.status(404).end()
  }

  persons = persons.filter( p => p.id !== id);
  response.json(persons)
})
//add
app.post('/api/persons/', (request, response)=> {

  const body = request.body

  if (!body.name) {
    return response.status(500).end()
  }

  const existName = persons.find( p => p.name === body.name)
  
  if(existName){
    return response.json({
      error: 'name must be unique'
    })
  }

  const maxId = Math.floor(Math.random() * parseInt("9".repeat(10)))
  console.log(maxId);
  const newPerson = {
    "id": maxId + 1,
    "name": body.name,
    "number": body.number
  }

  persons = persons.concat(newPerson)
  response.json(newPerson);  

})
//info
app.get('/info', (request, response) => {
  const date = new Date();
  const html = `<div>
      Phonebook has info for ${persons.length} people
      <br>
      ${date}
  </div>`
  response.send(html);
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint'});
}

app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, ()=> {
  console.log(`Server deployed in ${PORT}`);
})

