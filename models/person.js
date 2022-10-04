const { mongoose, model, Schema } = require('mongoose')
var uniqueValidator = require('mongoose-unique-validator')

const url = process.env.MONGODB_URI

console.log('connecting to ', url)

mongoose.connect(url)
  .then( (result) => {
    console.log(result)
    console.log('connecting to MongoDB')
  })
  .catch( err => {
    console.log('error to connecting to MongoDB', err.message)
  })

const personSchema = new Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    trim: true,
    unique: true
  },
  number: {
    type: String,
    required: true,
    minlength: 8,
    trim: true,
    unique: true
  }
})

personSchema.plugin(uniqueValidator)


personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})


module.exports = model('Person', personSchema)

