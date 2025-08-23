// approach 1
const student = require('./app')

// approach 2 - using module system
// import student from './app.js'

console.log(student.name)
console.log(student.age)
console.log(student.address.city)
student.intro()