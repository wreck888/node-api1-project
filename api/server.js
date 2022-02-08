const express = require('express')
const User = require('./users/model')

const server = express()

server.use(express.json())

server.get('/hello', (req, res) => {
    res.json({ message: 'hello' })
})

//GET all posts
server.get('/api/users', (req, res) => {
    User.find()
    .then(user => {
        res.json(user)
    })
    .catch(err => {
        res.status(500).json({ 
            message: "The users information could not be retrieved" 
        })
    })
})

//GET posts by id
server.get('/api/users/:id', (req, res) => {
    User.findById(req.params.id)
        .then(user => {
            if (!user) {
                res.status(404).json({ 
                    message: "The user with the specified ID does not exist" 
                })
            } else {
                res.json(user)
            }
        })
        .catch(err => {
            res.status(500).json({ 
                message: "The user information could not be retrieved" 
            })
        })
})

//POST creates a users using info inside request body and returns a new obj
server.post('/api/users', (req, res) => {
    let body = req.body;
    if(!body.name || !body.bio) {
        res.status(400).json({ 
            message: "Please provide name and bio for the user" 
    });
    } else {
        User.insert(req.body)
            .then(user => {
                res.status(201).json(user);
            })
            .catch(() => {
                res.status(500).json({ 
                    message: "There was an error while saving the user to the database" 
                });
            });
    }
});

//PUT updates user with specific id
server.put('/api/users/:id', async (req, res) => {
    const { id } = req.params;
    const { body } = req;
    try {
        const updated = await User.update(id, body)
        if (!updated) {
            res.status(404).json({ 
                message: "The user with the specified ID does not exist"
            })
        } else if(!body.name || !body.bio) {
            res.status(400).json({ 
                message: "Please provide name and bio for the user" 
            });
        } else {
            let newUser = await User.update(id, body);
                  res.status(200).json(newUser);
        }
    } catch (err) {
        res.status(500).json({ 
            message: "The user information could not be modified" 
        })
    }
 })

 //DELETE
 server.delete('/api/users/:id', async (req, res) => {
    const { id } = req.params
    User.remove(id)
       .then(deleteUser => {
           if (!deleteUser) {
               res.status(404).json({ 
                   message: "The user with the specified ID does not exist" 
                })
           } else {
               res.json(deleteUser)
           }
       } )
       .catch(err => {
           res.status(500).json({ 
               message: "The user could not be removed" 
            })
       })
})


module.exports = server