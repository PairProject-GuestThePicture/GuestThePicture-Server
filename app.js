const app = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

let rooms = [
  {
    title: "Fiah Room",
    description:'About everthing',
    members: 1
  },
  {
    title: 'Ichals Room',
    description: 'About animals',
    members: 1
  }
]

io.on('connect', function(socket){
  console.log('Someone connected')
  // socket === connected client
  // send data
  socket.emit('roomsFromServer', rooms)
  // receive data
  socket.on('newRooms', function(payload){
    rooms.push(payload)
     console.log(rooms)
     
  //   //  send to all except its self
  //    socket.broadcast.emit('')
     
  //   //  send to all include its self
  //    socket.emit('')
  })
  socket.on('joinRoom', function(room){
    console.log('someone wanna join the room', room)
    rooms.forEach(room=>{
      if(room.title == room & room.members > 4){
        room.members++
        socket.join(room.title)
      }else{
        let message = 'No empty space'
        socket.emit('fullMember', message)
      }
    })
  })
});

server.listen(3000, function(){
  console.log('server running on port 3000')
});