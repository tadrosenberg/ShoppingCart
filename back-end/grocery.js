const express = require('express');
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "POST, GET, DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(express.static('public'));

let products = [];
let cart = [];
let id = 0;

app.get('/api/products', (req, res) => {
    console.log("In get");
    res.send(products);
});

app.get('/api/cart', (req, res) => {
    console.log("In cart get");
    res.send(cart);
});

app.get('/api/products/:id', (req, res) => {
    console.log("In get specific");
    let id = parseInt(req.params.id);
    let findIndex = products.findIndex(product => product.id === id);
    if (findIndex === -1) {
        res.status(404)
            .send("Sorry, that product doesn't exist");
        return;
    }

    res.send(products[findIndex]);
});

app.post('/api/products', (req, res) => {
    console.log("In post");
    id = id + 1;
    let product = {
        id: id,
        name: req.body.name,
        price: req.body.price
    };
    products.push(product);
    res.send(product);
});

app.post('/api/cart/:id', (req, res) => {
    console.log("In cart post");
    let id = req.params.id;
    let name = req.body.name;
    const foundItem = cart.find(item => item.id === id);
    if (foundItem) {
        foundItem.quantity += 1;
        res.send(foundItem);
    }
    else {
        let item = {
            id: id,
            quantity: 1,
            name: name
        };
        cart.push(item);
        res.send(item);
    }
});

app.post('/api/cart/:id/:quantity', (req, res) => {
    console.log("In cart quantity post");
    let id = req.params.id;
    let quantity = req.params.quantity;
    const foundItem = cart.find(item => item.id === id);
    if (foundItem) {
        foundItem.quantity = quantity;
        res.send(foundItem);
        if(quantity == 0) {
            cart.splice(cart.indexOf(foundItem),1);
        }
    }
    else {
        res.status(404)
            .send("Sorry, that item doesn't exist");
        return;
    }
});

app.delete('/api/products/:id', (req, res) => {
    console.log("In delete");
    let id = parseInt(req.params.id);
    let removeIndex = products.map(product => {
            return product.id;
        })
        .indexOf(id);
    if (removeIndex === -1) {
        res.status(404)
            .send("Sorry, that product doesn't exist");
        return;
    }
    products.splice(removeIndex, 1);
    res.sendStatus(200);
});

app.delete('/api/cart/:id', (req, res) => {
    console.log("In cart delete");
    let id = req.params.id;
    let removeIndex = cart.map(item => {
            return item.id;
        })
        .indexOf(id);
    if (removeIndex === -1) {
        res.status(404)
            .send("Sorry, that item doesn't exist");
        return;
    }
    cart.splice(removeIndex, 1);
    res.sendStatus(200);
});

app.listen(3000, () => console.log('Server listening on port 3000!'));
