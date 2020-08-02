// Node server which will handle socket io connection
const path = require('path');
const express = require('express');
const app = express();
const server = app.listen(800, ()=>{
    console.log('listening');
});
public = path.join(__dirname, '/../public');
app.use(express.static(public));

const io = require('socket.io')(server);
//file system

const fs = require('fs');

// will contain list of all users
const usersname = {};
const userroom = {};
io.on('connection', socket =>{

    // if we got a new-user-joined event than will do this
    socket.on('new-user-joined', data =>{
        usersname[socket.id]=data.name;
        userroom[socket.id]=data.room;  // push a new user in users
        fs.appendFile(`../../chattingappdata/${data.room}.txt`,`${usersname[socket.id]} has joined the chat.\n`,(err)=>{
            if(err) throw err;
            console.log("no error!");
        });
        //console.log("saved!");
        socket.join(data.room);// very important point
        console.log("new-user",data.name,data.room,"has joined the chat.");
        socket.emit("welcome", data);
        socket.broadcast.to(userroom[socket.id]).emit('user-joined', data.name);// will show a message to all old user that new user has been joined 
        //fs.appendFileSync('newuser.txt',`username: ${data.name}, userroom: ${data.room}`);

        //send name of all user in this room
        all_members_id = Object.keys(userroom).filter( key =>userroom[key] == data.room);
        var All_names = `All Online Users in ${userroom[socket.id]} room:`;
        all_members_id.forEach(element => {
            All_names += ` <span style = color:${'#'+(Math.random() * 0xFFFFFF << 0).toString(16).padStart(6, '0')};>${usersname[element]}</span>,`;
        });
        socket.broadcast.to(userroom[socket.id]).emit('all_name',{All_names:All_names,name:data.name});
        socket.emit('all_name',{All_names:All_names,name:data.name});
    });

    //
    socket.on('send', message =>{
        fs.appendFile(`../../chattingappdata/${userroom[socket.id]}.txt`,`${usersname[socket.id]}: ${message}.\n`,(err)=>{
            if(err) throw err;
            console.log("no error!");
        });
       socket.broadcast.to(userroom[socket.id]).emit('receive', {message : message, name: usersname[socket.id]});
       
    });
    // when any client leave the chat
    socket.on('disconnect', message =>{
        socket.broadcast.to(userroom[socket.id]).emit('left', usersname[socket.id]);
        const value = userroom[socket.id];
        const room = userroom[socket.id];
        delete usersname[socket.id];
        delete userroom[socket.id];
        // getting key by value
        if(Object.keys(userroom).find( key => userroom[key] === value)==undefined){
               fs.unlink(`../../chattingappdata/${value}.txt`,(err)=>{
                   if(err) console.log('file not found error on line no 55');
                   else console.log(`All data of ${value} has been deleted as this room is empty now`);
               })
        }
        //send name of all user in this room
        all_members_id = Object.keys(userroom).filter( key =>userroom[key] == value);
        var All_names = `All Online Users in ${room} room:`;
        all_members_id.forEach(element => {
            All_names += ` <span style = color:${'#'+(Math.random() * 0xFFFFFF << 0).toString(16).padStart(6, '0')};">${usersname[element]}</span>,`; 
        });
        socket.broadcast.to(room).emit('all_name',{All_names:All_names,name:value});  // value is name of current user
     }); 
});