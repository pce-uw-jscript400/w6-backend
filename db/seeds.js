    const bcrypt = require('bcrypt')
    const mongoose = require('mongoose')
    const config = require('../nodemon.json')
    const User = require('../api/models/user')

    const reset = async() => {
        mongoose.connect(config.env.MONGO_DB_CONNECTION, { useNewUrlParser: true })
            // Careful with .remove() -- it sends a command directly to the database
            // and skips any mongoose validations
        await User.deleteMany() // Deletes all records
        return User.create([{
            name: 'Student User',
            username: 'student.user',
            password: bcrypt.hashSync('password', 10),
            posts: [{
                content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam gravida tincidunt tellus, vel vehicula turpis euismod a. Nulla lobortis mi nec sagittis hendrerit. Sed ultrices metus ut eros interdum, vel blandit mi lacinia.',
                emotion: 'joy'
            }]
        }])
    }

    reset().catch(console.error).then((response) => {
        console.log(`Seeds successful! ${response.length} records created.`)
        return mongoose.disconnect()
    })