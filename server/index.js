const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const http = require("http");
const socketIo = require("socket.io");
const cookieParser = require("cookie-parser");
const https = require("https");
const fs = require("fs");

dotenv.config();

const options = {
  key: fs.readFileSync("./localhost-key.pem"),
  cert: fs.readFileSync("./localhost.pem"),
};

const pool = require("./database/db");

const app = express();

const barterRouter = require("./routes/routes");
app.use(cors());
app.use(cookieParser());

const server = https.createServer(options, app);

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(bodyParser.json());

app.use("/api/barterkuy", barterRouter);

const io = socketIo(server, {
  cors: {
    origin: "https://192.168.54.173:5173", // Sesuaikan dengan URL frontend
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  },
});

const users = {};

io.on("connection", (socket) => {
  console.log("a new client connected", socket.id);

  // Event 'kontak tujuan' untuk user bergabung ke room tujuan
  socket.on("kontak tujuan", (tujuan) => {
    socket.join(tujuan);
    console.log(`User joined room: ${tujuan}`);
  });

  // Event 'login' untuk mencatat user yang terhubung
  socket.on("login", async (userId) => {
    users[userId] = socket.id;
    console.log(`User logged in: ${userId}, Socket ID: ${socket.id}`);

    // Ambil pesan tertunda dari database
    const sql = "SELECT * FROM chat WHERE receiver = ? AND status = 'pending'";
    pool.query(sql, [userId], (err, results) => {
      if (err) {
        console.error("Error saat mengambil pesan tertunda:", err);
        return;
      }

      // Kirim pesan tertunda ke pengguna
      results.forEach((message) => {
        io.to(socket.id).emit("chat message", { msg: message.chat, userId: message.sender });
        console.log(`Pesan tertunda dikirim ke user ${userId}: ${message.chat}`);

        // Update status pesan menjadi 'delivered'
        const updateSql = "UPDATE chat SET status = 'delivered' WHERE id = ?";
        pool.query(updateSql, [message.id], (err) => {
          if (err) {
            console.error("Error saat memperbarui status pesan:", err);
          }
        });
      });

      if (results.length > 0) {
        console.log(`Pesan tertunda telah dikirim ke user ${userId}`);
      }
    });
  });

  // Event 'chat message' untuk menerima dan mengirim pesan ke tujuan
  socket.on("chat message", async (msg, tujuan, userId) => {
    try {
      // Periksa apakah pengirim terdaftar
      if (!users[userId]) {
        console.log("Pengirim tidak terdaftar");
        return;
      }

      // Simpan pesan dengan status 'pending' jika penerima tidak online
      const targetSocketId = users[tujuan];
      const status = targetSocketId ? "delivered" : "pending";

      // Simpan pesan ke database
      const sql = "INSERT INTO chat (sender, receiver, chat, status) VALUES (?, ?, ?, ?)";
      await pool.query(sql, [userId, tujuan, msg, status]);

      // Emit pesan hanya jika penerima terdaftar (online)
      if (targetSocketId) {
        // Emit pesan ke pengirim
        io.to(users[userId]).emit("chat message", { msg, userId });
        console.log(`Pesan terkirim ke pengirim: ${userId} dengan isi: ${msg}`);

        // Emit pesan ke penerima
        io.to(targetSocketId).emit("chat message", { msg, userId });
        console.log(`Pesan terkirim ke penerima: ${tujuan} dengan isi: ${msg}`);
      } else {
        console.log(`Penerima ${tujuan} tidak online, pesan disimpan sebagai 'pending'`);
      }
    } catch (error) {
      console.error("Error dalam mengirim pesan:", error);
    }
  });

  // Event 'disconnect' untuk menghapus user dari daftar ketika user terputus
  socket.on("disconnect", () => {
    console.log("a client disconnected", socket.id);

    // Cari dan hapus user yang terputus dari daftar users
    for (let userId in users) {
      if (users[userId] === socket.id) {
        delete users[userId];
        console.log(`User ${userId} disconnected`);
        break;
      }
    }
  });
});

const PORT = process.env.PORT || 2020;

server.listen(PORT, async () => {
  try {
    const connection = await pool.getConnection();

    if (connection) {
      console.log(`Server is running on port ${PORT}`);
    }
  } catch (error) {
    console.log("Database is off");
  }
});
