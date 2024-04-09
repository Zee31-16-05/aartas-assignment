const express = require('express');
const app = express();
const mongoose = require('mongoose');
const PORT = 3004

const jwt = require('jsonwebtoken');
const socketio = require('socket.io');
const http = require('http');
const multer = require('multer');
const path = require('path');


const userRoute = require('./routes/user.route')
const messageRoute = require('./routes/message.route')

app.use(express.json())

app.use('/user/',userRoute)
app.use('/message/',messageRoute)


mongoose.connect("mongodb://0.0.0.0:27017/chatApplication", {
    // useNewUrlParser: true,
    // useUnifiedTopology: true
})
.then(()=>console.log("successfully connected to the database"))
.catch((err)=>console.log("Database Connection Failed",err.stack))


const server = http.createServer(app);
const io = socketio(server);
app.use('/images', express.static(path.join(__dirname, 'images')));


// File upload setup
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'images');
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname);
    }
  });
  const upload = multer({ storage: storage });

  // Socket.io connection
io.use(async (socket, next) => {
    try {
      const token = socket.handshake.query.token;
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId);
      if (!user) {
        return next(new Error('Authentication error'));
      }
      socket.user = user;
      next();
    } catch (error) {
      next(error);
    }
  }).on('connection', socket => {
    console.log('User connected: ', socket.user.username);
  
    socket.on('sendMessage', async messageData => {
      try {
        const { sender, receiver, content, image } = messageData;
        const message = new Message({
          sender,
          receiver,
          content,
          image
        });
        await message.save();
        io.emit('newMessage', message);
      } catch (error) {
        console.error(error);
      }
    });
  
    socket.on('disconnect', () => {
      console.log('User disconnected: ', socket.user.username);
    });
  });


app.listen(PORT,()=>{
    console.log(`listening on PORT : ${PORT}`)
});

