var express = require('express');
var bodyParser = require('body-parser')
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var mongoose = require('mongoose');

app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))

var Message = mongoose.model('Message', {
    name: String,
    message: String
})


app.get('/messages', (req, res) => {
    Message.find({}, (err, messages) => {
        res.send(messages);
    })
})


app.post('/messages', (req, res) => {
    var message = new Message(req.body);
    message.save((err) => {
        if (err)
            sendStatus(500);
        io.emit('message', req.body);
        res.sendStatus(200);
    })

})

io.sockets.on('connection', () => {
    console.log('a user is connected')
})

mongoose.connect("mongodb://localhost:27017/simpleChat", { useNewUrlParser: true }).then(console.log("Connecting...")).catch(err => {
    console.error(err.stack)
    process.exit(1)
});

var server = http.listen(8000, () => {
    console.log('server is running on port', server.address().port);
});