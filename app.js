const app = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

let rooms = [
  {
    title: "Fiah Room",
    description:'About everthing',
    members: [
      {
        username: 'fiah'
      }
    ]
  },
  {
    title: 'Ichals Room',
    description: 'About animals',
    members: [
      {
        username: 'ichlas'
      },
      {
        username: 'timothy'
      }
    ]
  }
]

io.on('connect', function(socket){
  console.log('Someone connected', socket.id)
  // socket === connected client
  // send data
  socket.on('roomsFromServer', function (message) {
    console.log(message)
    socket.emit('roomsFromServer', rooms)
  })
  // receive data
  socket.on('newRooms', function(payload){
    rooms.push(payload)
     console.log(rooms)
     
  //   //  send to all except its self
  //    socket.broadcast.emit('')
     
  //   //  send to all include its self
  //    socket.emit('')
  })
  socket.on('joinRoom', function(newRoom){
    console.log('someone wanna join the room', newRoom)
    rooms.forEach(room=>{
      if(room.title == newRoom){
        if(room.members.length < 4){
          room.members.push()
          socket.emit('responseJoin', newRoom)
          socket.join(room.title)
        }else{
          let message = 'Room is full'
          socket.emit('fullRoom', message)
          socket.emit('responseJoin', null)
          
        }
      }
      // if(room.title == newRoom && room.members.length < 4){
      //   socket.join(room.title)
      // } else if(room.title == newRoom && room.members.length > 4){
      //   let messag
      //   socket.emit('fullMember',message)
      // }
    })
  })
});

server.listen(3000, function(){
  console.log('server running on port 3000')
});