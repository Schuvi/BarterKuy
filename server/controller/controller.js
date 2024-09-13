const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const pool = require('../database/db')
const otpGenerator = require('otp-generator')
const mailSender = require('../utils/mailSender')

const barterController = {
    register: async (req, res) => {
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction()

            const {email, nama_lengkap, password, nomor_telepon, role, provinsi, kota, kecamatan} = req.body
            const hashedPassword = await bcrypt.hash(password, 12)

            const sqlPengguna1 = 'INSERT INTO pengguna (email, nama_lengkap, password, nomor_telepon, role, verifikasi) VALUES (?, ?, ?, ?, ?, "invalid")'

            const sqlPengguna2 = 'UPDATE pengguna SET lokasi = ?'

            const sqlLokasi = 'INSERT INTO lokasi (user_id, provinsi, kota, kecamatan) VALUES (?, ?, ?, ?)'

            const sqlPengguna3 = 'SELECT email, nama_lengkap FROM pengguna WHERE email = ? OR nama_lengkap = ?'

            console.log(email)

            const [responseSql3] = await connection.query(sqlPengguna3, [email, nama_lengkap])
            
            if (responseSql3.length === 1) {

                if (responseSql3[0].email === email) {
                    res.status(401).json({
                        statusCode: 401,
                        message: 'Email used'
                    })
                } else if (responseSql3[0].nama_lengkap === nama_lengkap) {
                    res.status(401).json({
                        statusCode: 401,
                        message: 'Name used'
                    })
                }

            } else if (responseSql3.length === 0) {
                const [response] = await connection.query(sqlPengguna1, [email, nama_lengkap, hashedPassword, nomor_telepon, role])

                if (response) {
                    const [responseLokasi] = await connection.query(sqlLokasi, [response.insertId, provinsi, kota, kecamatan])
    
                    if (responseLokasi) {
                        const [responseUpdate] =  await connection.query(sqlPengguna2, [responseLokasi.insertId])
    
                        if (responseUpdate) {
                            res.status(201).json({
                                statusCode: 201,
                                message: 'User creation success',
                            })
                        }
                    }
                }
            }

            await connection.commit()

        } catch (error) {
            await connection.rollback()
            console.error(error)
            res.status(500).json({
                statusCode: 500,
                message: 'Failed to create new user',
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

            const {email, password} = req.body


            const sql = 'SELECT * FROM pengguna WHERE email = ?'

            const [response] = await connection.query(sql, [email])

            await connection.commit()

            if (response.length === 1) {
                const userData = response[0]

                if (userData.verifikasi === "invalid") {
                    res.status(401).json({
                        statusCode: 401,
                        message: 'Email not verified'
                    })
                } 

                const isValid = await bcrypt.compare(password, userData.password)
                if (!isValid) {
                    res.status(401).json({
                        statusCode: 401,
                        message: 'Data is not valid'
                    })
                } else {
                    const accessToken = jwt.sign({
                        id: userData.user_id,
                        username: userData.email
                    }, process.env.JWT_SECRET, {
                        expiresIn: process.env.JWT_EXPIRES_IN
                    })

                    const refreshToken = jwt.sign({
                        id: userData.user_id,
                        username: userData.email
                    }, process.env.JWT_REFRESH_SECRET, {
                        expiresIn: process.env.JWT_REFRESH_EXPIRES_IN
                    })

                    res.cookie('refreshToken', refreshToken, {
                        httpOnly: true,
                        secure: false,
                        path: '/',
                        sameSite: 'strict'
                    })
                    res.status(201).json({
                        statusCode: 201,
                        message: 'Login success!',
                        accessToken: accessToken,
                        userId: userData.user_id
                    })
                }

            }
        } catch (error) {
            console.error(error)
            res.status(500).json({
                statusCode: 500,
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
            statusCode: 201,
            message: 'Logout succesful'
        })
    },

    postinganBarang: async (req, res) => {
        const connection = await pool.getConnection()
        try {
            await connection.beginTransaction()

            const sql = 'SELECT * FROM barang'

            const [response] = await connection.query(sql)

            if (response) {
                res.status(200).json(response)({
                    statusCode: 200,
                    message: "Successfully retrieved item",
                    data: response.data
                })
            }
        } catch (error) {
            await connection.rollback()
            console.error(error)
            res.status(500).json({
                statusCode: 500,
                message: 'Internal Server Error',
                error: error.message
            })
        } finally {
            connection.release()
        }
    },

    pengajuanBarang: async (req, res) => {
        const connection = await pool.getConnection()

        try {
            await connection.beginTransaction()

            const {user_id, nama_barang, deskripsi_barang, kategori_barang, lokasi, jenis_penawaran, status_pengajuan} = req.body

            const sql = 'INSERT INTO barang (user_id, nama_barang, deskripsi_barang, kategori_barang, lokasi, jenis_penawaran, status_pengajuan, status_barter) VALUES (?, ?, ?, ?, ?, ?, "diajukan")'

            const [response] = connection.query(sql, [user_id, nama_barang, deskripsi_barang, kategori_barang, lokasi, jenis_penawaran, status_pengajuan])

            await connection.commit()

            if (response.affectedRows === 1) {
                res.status(201).json({
                    statusCode: 201,
                    message: "Successfully submitted the goods"
                })
            }
        } catch (error) {
            console.error(error)
            res.status(500).json({
                statusCode: 500,
                message: 'Internal Server Error',
                error: error.message
            })
        } finally {
            connection.release()
        }
    },

    waitingListBarang: async (req, res) => {
        const connection = await pool.getConnection()

        try {
            await connection.beginTransaction()

            const {user_id, status} = req.query

            const sql = 'SELECT * FROM barang WHERE user_id = ? AND status_pengajuan = ?'

            const [response] = await connection.query(sql, [user_id, status])

            if (response.length >= 1) {
                res.status(200).json({
                    statusCode: 200,
                    message: "List of goods waiting for approval",
                    data: response
                })
            }
        } catch (error) {
            await connection.rollback()
            console.error(error)
            res.status(500).json({
                statusCode: 500,
                message: 'Internal Server Error',
                error: error.message
            })
        }
    },

    chat: async (req, res) => {
        const connection = await pool.getConnection()
        try {
            await connection.beginTransaction()

            const {userId, tujuan} = req.query

            const sql = 'SELECT sender, receiver, chat, timestamp FROM chat WHERE (sender = ? AND receiver = ?) OR (sender = ? AND receiver = ?) ORDER BY timestamp ASC'

            const [response] = pool.query(sql, [userId, tujuan, userId, tujuan])

            await connection.commit()

            if (response) {
                res.status(201).json({
                    statusCode: 201,
                    message: "Successfully retrieved chat data",
                    data: response.data
                })
            }
        } catch (error) {
            await connection.rollback()
            console.error(error)
            res.status(500).json({
                statusCode: 500,
                message: "Failed to retrieved chat data"
            })
        } finally {
            connection.release()
        }
    },

    otp: async (req, res) => {
        const connection = await pool.getConnection()
        try {
            const { email } = req.body;

            connection.beginTransaction()
    
            // Validasi input email
            if (!email) {
                return res.status(400).json({
                    statusCode: 400,
                    message: "Email is required"
                });
            }
    
            // Generate OTP
            let otp = otpGenerator.generate(6, {
                upperCaseAlphabets: false,
                lowerCaseAlphabets: false,
                specialChars: false
            });
    
            // Kirim email
            const sql = 'INSERT INTO otp (email, otp) VALUES (?, ?)'

            const [response] = await connection.query(sql, [email, otp])

            console.log(response)

            if (response.affectedRows === 1) {
                mailSender(
                    email,
                    "Verifikasi Kode OTP",
                    `<h1>Masukkan Kode OTP ini ke dalam aplikasi</h1>
                    <p>Kode OTP: <strong>${otp}</strong></p>`
                );

                connection.commit()
                
                res.status(201).json({
                    statusCode: 201,
                    message: "OTP sent successfully",
                })
            }
    
        } catch (error) {
            console.error('Error sending email:', error.message);
            return res.status(500).json({
                statusCode: 500,
                message: "Failed to send OTP"
            });
        } finally {
            connection.release()
        }
    },

    verifyOtp: async (req, res) => {
        const connection = await pool.getConnection()

        try {
            const {email, otp} = req.body
            
            await connection.beginTransaction()

            const sqlVerify = 'SELECT email, otp FROM otp WHERE email = ?'

            const sqlValidEmail = 'UPDATE pengguna set verifikasi = "valid" WHERE email = ?'

            const sqlDeleteOtp = 'DELETE FROM otp WHERE email = ?'

            const [response] = await connection.query(sqlVerify, [email])

            
            if (response[0].otp === otp) {
                
                await connection.query(sqlValidEmail, [email])

                await connection.query(sqlDeleteOtp, [email])
                
                await connection.commit()

                res.status(200).json({
                    statusCode: 200,
                    message: "OTP verified successfully"
                })
            } else {
                res.status(401).json({
                    statusCode: 401,
                    message: "Invalid OTP"
                })
            }

        } catch (error) {
            console.error(error)
            res.status(500).json({
                statusCode: 500,
                state: "error",
                message: error.message
            })
        } finally {
            connection.release()
        }
    },

}

module.exports = barterController;