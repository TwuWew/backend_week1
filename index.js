// playlist/src/index.ts

// #1
const { PrismaClient } = require('@prisma/client')
const express = require('express')
const cors = require('cors')
const bcrypt = require('bcrypt')
const saltRounds = 10

// #2
const prisma = new PrismaClient()

const register = async function(req,res){    
    const password = req.body.password    
    const encryptedPassword = await bcrypt.hash(password, saltRounds)
    let users={       
        "user_name":req.body.userName,       
        "email_address":req.body.email,       
        "password":encryptedPassword
    }        
    pool.query('INSERT INTO players SET ?',users, function (error, results, fields) {      
        if (error) {        
            res.send({          
                "code":400,          
                "failed":"error occurred",          
                "error" : error})      
        } 
        else {        
            res.send({          
                "code":200,          
                "success":"user registered sucessfully"            
            })        
        }    
    })  
}

// #3
const app = express()

// #4
app.use(cors())
app.use(express.urlencoded({extended:true}))
app.use(express.json())



app.get('/list', async (req, res) => {
    const todo = await prisma.ToDo.findMany({
        where: { status: true },
        include: { users: true }
    })
    res.json({
        success: true,
        payload: todo,
    })
})

//* 2. Fetches a specific song by its ID.
app.get(`/todo/:id`, async (req, res) => {
    const { id } = req.params
    const todo = await prisma.todo.findFirst({
        where: { id: Number(id) },
    })
    res.json({
        success: true,
        payload: todo,
    })
})

//* 3. Creates a new artist.
app.post(`/user`, async (req, res) => {
    const result = await prisma.user.create({
        data: { ...req.body },
    })
    res.json({
        success: true,
        payload: result,
    })
})

//* 4. Creates (or compose) a new song (unreleased)
app.post(`/todo`, async (req, res) => {
    const { title, content, singerEmail } = req.body
    const result = await prisma.todo.create({
        data: {
            title,
            content,
            released: false,
            singer: { connect: { email: singerEmail } },
        },
    })
    res.json({
        success: true,
        payload: result,
    })
})

//* 5. Sets the released field of a song to true.
app.put('/todo/status/:id', async (req, res) => {
    const { id } = req.params
    const todo = await prisma.todo.update({
        where: { id: Number(id) },
        data: { status: true },
    })
    res.json({
        success: true,
        payload: todo,
    })
})

//* 6. Deletes a song by its ID.
app.delete(`/todo/:id`, async (req, res) => {
    const { id } = req.params
    const todo = await prisma.todo.delete({
        where: { id: Number(id) },
    })
    res.json({
        success: true,
        payload: todo,
    })
})

//* 7. Fetches all Artist.
app.get('/user', async (req, res) => {
    const user = await prisma.artist.findMany()
    res.json({
        success: true,
        payload: user,
    })
})

app.use((req, res, next) => {
    res.status(404)
    return res.json({
        success: false,
        payload: null,
        message: `API SAYS: Endpoint not found for path: ${req.path}`,
    })
})

// #6
app.listen(3000, () =>
    console.log('REST API server ready at: http://localhost:3000'),
)