// Node server which will handle socket io connection
const io = require('socket.io')(800)

// will contain list of all users
const usersname = {};
const userroom = {};
io.on('connection', socket =>{

    // if we got a new-user-joined event than will do this
    socket.on('new-user-joined', data =>{
        usersname[socket.id]=data.name;
        userroom[socket.id]=data.room;  // push a new user in users
        socket.join(data.room);// very important point
        console.log("new-user",data.name,data.room,"has joined.");
        socket.emit("welcome", data);
        socket.broadcast.to(userroom[socket.id]).emit('user-joined', data.name);// will show a message to all old user that new user has been joined 
    });

    //
    socket.on('send', message =>{
       socket.broadcast.to(userroom[socket.id]).emit('receive', {message : message, name: usersname[socket.id]})
    });
    // when any client leave the chat
    socket.on('disconnect', message =>{
        socket.broadcast.to(userroom[socket.id]).emit('left', usersname[socket.id]);
        delete usersname[socket.id];
        delete userroom[socket.id];
     }); 
});