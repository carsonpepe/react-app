const express = require('express');
const cors = require('cors');
const app = express();
const port = 5000;

const users = { 
    users_list :
    [
        { 
            id : 'xyz789',
            name : 'Charlie',
            job: 'Janitor',
        },
        {
            id : 'abc123', 
            name: 'Mac',
            job: 'Bouncer',
        },
        {
            id : 'ppp222', 
            name: 'Mac',
            job: 'Professor',
        }, 
        {
            id: 'yat999', 
            name: 'Dee',
            job: 'Aspring actress',
        },
        {
            id: 'zap555', 
            name: 'Dennis',
            job: 'Bartender',
        }
    ]
 }

app.use(cors());
app.use(express.json());

app.get('/users', (req, res) => {
    const name = req.query.name;
    const job = req.query.job;
    if (name != undefined){
        let result = findUserByName(name);
        if (job != undefined){
            result = findUserByJob(result, job);
        }
        result = {users_list: result};
        res.send(result);
    }
    else if (job != undefined){
        let result = findUserByJob(users['users_list'], job);
        result = {users_list: result};
        res.send(result)
    }
    else{
        res.send(users);
    }
});

const findUserByName = (name) => { 
    return users['users_list'].filter( (user) => user['name'] === name); 
}


const findUserByJob = (list, job) => { 
    return list.filter( (user) => user['job'] === job); 
}

app.get('/users/:id', (req, res) => {
    const id = req.params['id']; //or req.params.id
    let result = findUserById(id);
    if (result === undefined || result.length == 0)
        res.status(404).send('Resource not found.');
    else {
        result = {users_list: result};
        res.send(result);
    }
});

function findUserById(id) {
    return users['users_list'].find( (user) => user['id'] === id); // or line below
    //return users['users_list'].filter( (user) => user['id'] === id);
}

app.post('/users', (req, res) => {
    const userToAdd = req.body;
    userToAdd['id'] = generateRandomID();
    addUser(userToAdd);
    res.status(201).send(userToAdd);
});

function addUser(user){
    users['users_list'].push(user);
}

function generateRandomID(){
    return (Math.floor(Math.random() * 1000000)).toString();
}

app.delete('/users/:id', (req, res) => {
    const id = req.params['id']; //or req.params.id
    let found = findUserById(id);
    if (found === undefined || found.length == 0)
        res.status(404).send('Resource not found.');
    else {
        let result = removeUserById(id);
        result = { users_list: result };
        //res.send(result)
        res.status(204).send(result);
    }
    
})

function removeUserById(id) {
    const userIndex = users['users_list'].findIndex( (user) => user['id'] == id);
    users['users_list'].splice(userIndex, 1);
    return users['users_list']
}

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});   

