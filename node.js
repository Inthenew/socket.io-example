let express = require('express');
let ejs = require('ejs');
let fs = require('fs');
let Cookies = require('cookies');
let app = express();
app.set("views", "views");
app.engine(".html", ejs.__express);
app.set("view-engine", "html");
let http = require('http');
let server = http.createServer(app).listen(8080)
const io = require('socket.io')(server);
let positions = [];
io.sockets.on('connection', function (socket) {
    let number;
    let done = false;
    let p = 0;
    let dissconnected = false;
    socket.on('position', function (info) {
        if (!done) {
            positions.push(info);
            for (var i = 0; i < positions.length; i++) {
                if (positions[i] === info) {
                    number = i;
                }
            }
            done = true;
        } else {
            positions[number] = info;
        }
        io.sockets.emit('positions', positions);
    })
    socket.on('d', function(info) {
        function removeItemOnce(arr, value) {
            var index = arr.indexOf(value);
            if (index > -1) {
              arr.splice(index, 1);
            }
            return arr;
          }
          removeItemOnce(positions, info.i);
    })
    socket.once('disconnect', function () {
        positions[number] = 10000;
        dissconnected = true;
        io.sockets.emit('positions', positions);
        io.sockets.emit('Tdiss', {d: true, number: number});
    })
});
app.get('/', function (req, res) {
    ejs.renderFile('/Users/jackm/Desktop/jackmslocum/views/ejs.ejs', {}, {}, function (err, str) {
        if (err) throw err;
        res.send(str);
    })
})
