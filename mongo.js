const mongoose = require('mongoose')


console.log(process.argv.length)

if (process.argv.length < 3 ||
  (process.argv.length === 4 || process.argv.length > 5)) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
}

const password = process.argv[2]
const url =
  `mongodb+srv://fullstack:${password}@cluster0.tucqqyh.mongodb.net/persons?retryWrites=true&w=majority`

mongoose.connect(url)
  .catch( err => { console.log(err)})

mongoose.connection.on('error', (err) => {
  console.log(err)
})

const personSchema = new mongoose.Schema({
  name: String,
  number: String
})

const Person = mongoose.model('Person', personSchema, 'persons')

if (process.argv.length !== 3) {

  const person = new Person({
    name: process.argv[3],
    number: process.argv[4]
  })

  person.save().then(result => {
    console.log(`added ${process.argv[3]} number ${process.argv[4]} to phonebook`)
    mongoose.connection.close()
  })

}
else {
  Person
    .find({})
    .then( result => {
      console.log('phonebook:\n')
      result.forEach( person => {
        console.log(`${person.name} ${person.number}`)
      })
      mongoose.connection.close()
      process.exit(0)
    })
}




