const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const pool = require('../database/db')

const barterController = {
    register: async (req, res) => {
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction()

            const {email, nama_lengkap, password, nomor_telepon, role, lokasi} = req.body
            const hashedPassword = await bcrypt.hash(password, 12)

            const sql = 'INSERT INTO pengguna (email, nama_lengkap, password, nomor_telepon, role, lokasi) VALUES (?, ?, ?, ?, ?, ?)'

            const [response] = await connection.query(sql, [email, nama_lengkap, hashedPassword, nomor_telepon, role, lokasi])

            await connection.commit()

            if (response) {
                res.status(201).json({
                    message: 'User berhasil dibuat'
                })
            }
        } catch (error) {
            console.error(error)
            res.status(500).json({
                message: 'Gagal membuat user',
                error: error.message
            })
        } finally {
            connection.release()
        }
    },

    login: async (req, res) => {
        const connection = await pool.getConnection()
        try {
            await connection.beginTransaction()

            const {nama_lengkap, password} = req.body


            const sql = 'SELECT * FROM pengguna WHERE nama_lengkap = ?'

            const [response] = await connection.query(sql, [nama_lengkap])

            await connection.commit()

            if (response.length === 1) {
                const userData = response[0]
                const isValid = await bcrypt.compare(password, userData.password)
                if (!isValid) {
                    res.status(401).json({
                        message: 'Data login tidak valid'
                    })
                } else {
                    const accessToken = jwt.sign({
                        id: userData.user_id,
                        username: userData.nama_lengkap
                    }, process.env.JWT_SECRET, {
                        expiresIn: process.env.JWT_EXPIRES_IN
                    })

                    const refreshToken = jwt.sign({
                        id: userData.user_id,
                        username: userData.nama_lengkap
                    }, process.env.JWT_REFRESH_SECRET, {
                        expiresIn: process.env.JWT_REFRESH_EXPIRES_IN
                    })

                    res.cookie('refreshToken', refreshToken, {
                        httpOnly: true,
                        secure: false,
                        path: '/',
                        sameSite: 'strict'
                    })
                    res.json({
                        message: 'Login berhasil',
                        accessToken: accessToken,
                        userId: userData.user_id
                    })
                }

            }
        } catch (error) {
            console.error(error)
            res.status(500).json({
                message: 'Internal Server Error',
                error: error.message
            })
        } finally {
            connection.release()
        }
    },

    logout: async (req, res) => {
        res.clearCookie('refreshToken')
        res.status(201).json({
            message: 'Logout berhasil'
        })
    },

    authenticateJWT: (req, res, next) => {
        const token = req.header('Authorization')?.split(' ')[1];
        if (!token) return res.status(401).json({ message: 'Access denied' });
      
        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
          if (err) return res.status(403).json({ message: 'Invalid token' });
          req.user = user;
          next();
        });
    },

    pengajuanBarang: async (req, res) => {
        const connection = await pool.getConnection()

        try {
            await connection.beginTransaction()

            const {user_id, nama_barang, deskripsi_barang, kategori_barang, lokasi, jenis_penawaran, status_pengajuan} = req.body

            const sql = 'INSERT INTO barang (user_id, nama_barang, deskripsi_barang, kategori_barang, lokasi, jenis_penawaran, status_pengajuan, status_barter) VALUES (?, ?, ?, ?, ?, ?, "diajukan")'

            const [response] = connection.query(sql, [user_id, nama_barang, deskripsi_barang, kategori_barang, lokasi, jenis_penawaran, status_pengajuan])

            await connection.commit()

            if (response) {
                res.status(201).json({
                    message: "Berhasil mengajukan barang"
                })
            }
        } catch (error) {
            console.error(error)
            res.status(500).json({
                message: 'Internal Server Error',
                error: error.message
            })
        } finally {
            connection.release()
        }
    }

}

module.exports = barterController