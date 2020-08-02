//This is different from nodeserver
const socket = io('http://localhost:800');

//get DOM element in respective javascript variable
const form = document.getElementById('send-form');
const messageInput = document.getElementById('messageInp');
const messageContainer = document.querySelector(".message-container");
const navbar = document.querySelector(".navbar");
const navbar_time = document.querySelector('.navbar h3 .time');
const navbar_room = document.querySelector('.navbar h1 .room');
const navbar_name = document.querySelector('.navbar h1 .name');
const names = document.querySelector('.navbar .all_members h5');
const audio = new Audio('mp3/notification.mp3')

// append function which is being used in user-joined section it will append all the message into message section
const append = (message, position)=>{
    //time
    var time = new Date();
    time = time.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })
    if(position!="noclass"){
        message = `<span style = "color:#275b00;">${time}</span> `+ message;
        const messageElement = document.createElement('div');
        messageElement.innerHTML = message;
        messageElement.classList.add('message');
        messageElement.classList.add(position);
        messageContainer.append(messageElement);
    }  else{
        navbar_time.innerHTML=time;
        navbar_room.innerHTML=message.room;
        navbar_name.innerHTML=message.name;
    }
    if(position=="left")
        audio.play();
    // scroll down
    messageContainer.scrollTop = messageContainer.scrollHeight;
}

// whenever form get submited send the message to server so that all other user can get the message
form.addEventListener('submit',(e)=>{
    e.preventDefault();//  event.preventDefault(); can also be used
                       //  is used to prevent autorefresh
    const message = messageInput.value;
    append(`You: ${message} `,'right');
    socket.emit('send', message);
    
    messageInput.value= '';
})

// whenever new user try to open aChat app, will ask to type name
// const name = prompt("Enter your name to join this aChat app");
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const name = urlParams.get('username');
const room = urlParams.get('room');
socket.emit('new-user-joined', {name, room});

// if new user joined recieve his name from server
socket.on('user-joined', name =>{
    //console.log("AAAAAAAAAAA");
    append(`${name} joined the aChat`, 'left');
});
socket.on('welcome', data =>{
    append(data,"noclass");
})
// if server sends a message with receive variable, receive it.
socket.on('receive', data =>{
    //console.log("AAAAAAAAAAA");
    append(`${data.name}: ${data.message}`, 'left');
   
});

// if someone left from aChat, let all know.
socket.on('left', name =>{
    //console.log("AAAAAAAAAAA");
    append(`${name} left the aChat`, 'left');
   // audio.play();
});

// name of all users
socket.on('all_name', (data)=>{
    
    names.innerHTML = data.All_names;
    console.log(data.All_names);
});
