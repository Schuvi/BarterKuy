const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const http = require("http");
const socketIo = require("socket.io");
const cookieParser = require("cookie-parser");

dotenv.config();

const pool = require("./database/db");

const app = express();

const server = http.createServer(app);

const barterRouter = require("./routes/routes");
app.use(cors());
app.use(cookieParser());

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(bodyParser.json());

app.use("/api/barterkuy", barterRouter);

const io = socketIo(server);

const users = {};

io.on("connection", (socket) => {
  console.log("a new client connected", socket.id);

  socket.on("kontak tujuan", (tujuan) => {
    socket.join(tujuan);
  });

  socket.on("login", (userId) => {
    users[userId] = socket.id;
  });

  socket.on("chat message", (msg, tujuan, userId) => {
    if (!users[tujuan] || !users[userId]) {
      console.log("user tidak terdaftar");
      return;
    }

    const targetSocketId = users[tujuan];

    const sql = "INSERT INTO chat (sender, receiver, chat, timestamp) VALUES (?, ?, ?, ?)";
    pool.query(sql, [userId, tujuan, msg], (err, res) => {
      if (err) throw err;
      io.to(userId).emit("chat message", { msg, userId });
      io.to(targetSocketId).emit("chat message", { msg, userId });
    });
  });

  socket.on("disconnect", () => {
    console.log("a client disconnected", socket.id);

    for (let userId in users) {
      if (users[userId] === socket.id) {
        delete users[userId];
        break;
      }
    }
  });
});

const PORT = process.env.PORT || 2020;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})
