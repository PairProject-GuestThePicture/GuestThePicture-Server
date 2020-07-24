const app = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

let rooms = [
  {
    title: "Fiah Room",
    description: 'About everthing',
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

let users = []
let canvas = ''
let gambar = ['ayam', 'bebek', 'gajah', 'jerapah', 'kucing']
let jawaban = ''

function randomGambar() {
  let randomNumber = Math.floor(Math.random() * gambar.length)
  return gambar[randomNumber]
}

io.on('connect', function (socket) {
  users = []
  console.log('Someone connected')

  socket.on('clientLogin', payload => {
    let isLoggedIn = false
    users.forEach(elem => {
      if (elem == payload) {
        isLoggedIn = true
      }
    })

    if (!isLoggedIn) {
      users.push(payload)
    }

    console.log(users)
  })
  // socket === connected client
  // send data
   
//   socket.on('roomsFromServer', function (message) {
//     console.log(message)
//     socket.emit('roomsFromServer', rooms)
//   })

  //Room
  socket.emit('roomsFromServer', rooms)
  // receive data
  socket.on('newRooms', function (payload) {
    rooms.push(payload)
    console.log(rooms)
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
    })
  })

  //Gameroom
  if (canvas) {
    socket.emit('draw', canvas)
  }
  socket.on('draw', payload => {
    canvas = payload
    socket.broadcast.emit('draw', canvas)
  })

  socket.on('gameStart', payload => {
    let random = randomGambar()
    socket.emit('gameStart', { gambar: random })
    socket.broadcast.emit('gameStartForAll', random)
  })

  socket.on('assignJawaban', payload => {
    jawaban = payload
  })

  socket.on('submitAnswer', payload => {
    if (payload[0] === payload[1]) {
      socket.emit('submitAnswerResponse', true)
    } else {
      socket.emit('submitAnswerResponse', false)
    }
  })

  socket.on('stopRound', payload => {
    socket.broadcast.emit('stopRound')
  })

  socket.on('userWin', payload => {
    socket.emit('userWin', payload)
  })
});

server.listen(3000, function () {
  console.log('server running on port 3000')
});