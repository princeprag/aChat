//This is different from nodeserver
const socket = io('http://localhost:800');

//get DOM element in respective javascript variable
const form = document.getElementById('send-form');
const messageInput = document.getElementById('messageInp');
const messageContainer = document.querySelector(".message-container");
const navbar = document.querySelector(".navbar");
const audio = new Audio('notification.mp3')

// append function which is being used in user-joined section it will append all the message into message section
const append = (message, position)=>{
    //time
    var time = new Date();
    time = time.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })
    if(position!="noclass") message = `<span style = "color:#275b00;">${time}</span> `+ message;
    //
    const messageElement = document.createElement('div');
    messageElement.innerHTML = message;
    if(position!="noclass") messageElement.classList.add('message'); // set class = message
    messageElement.classList.add(position); // set class = left or right
    if(position!="noclass") messageContainer.append(messageElement);
    else{
        messageElement.innerHTML+=`<h4>You have joined this app at <span style = "color:red;">${time}</span> </h4>`
          navbar.append(messageElement);
    }
    if(position=="left")
        audio.play();
}

// whenever form get submited send the message to server so that all other user can get the message
form.addEventListener('submit',(e)=>{
    e.preventDefault();//  event.preventDefault(); can also be used
    // is used to prevent autorefresh
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
    append(`<h1>Welcome <span style = "color: #171cb0f2;">${data.name} </span> to <span style = "color: #fc0000;">aChat app</span>.<br>you are currently in <span style = "color: green;">${data.room} </span> room.</h1>`,"noclass");
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

// time 
