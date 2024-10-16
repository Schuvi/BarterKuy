const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../database/db");
const otpGenerator = require("otp-generator");
const mailSender = require("../utils/mailSender");
const axios = require("axios");
const imagekit = require("../utils/imageKitReq");

const barterController = {
  register: async (req, res) => {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      const { email, nama_lengkap, password, nomor_telepon, role, provinsi, kota, kecamatan } = req.body;
      const hashedPassword = await bcrypt.hash(password, 12);

      const sqlPengguna1 = 'INSERT INTO pengguna (email, nama_lengkap, password, nomor_telepon, role, verifikasi) VALUES (?, ?, ?, ?, ?, "invalid")';

      const sqlPengguna2 = "UPDATE pengguna SET lokasi = ? WHERE user_id = ?";

      const sqlLokasi = "INSERT INTO lokasi (user_id, provinsi, kota, kecamatan) VALUES (?, ?, ?, ?)";

      const sqlPengguna3 = "SELECT email, nama_lengkap FROM pengguna WHERE email = ? OR nama_lengkap = ?";

      const [responseSql3] = await connection.query(sqlPengguna3, [email, nama_lengkap]);

      if (responseSql3.length === 1) {
        if (responseSql3[0].email === email) {
          res.status(401).json({
            statusCode: 401,
            message: "Email used",
          });
        } else if (responseSql3[0].nama_lengkap === nama_lengkap) {
          res.status(401).json({
            statusCode: 401,
            message: "Name used",
          });
        }
      } else if (responseSql3.length === 0) {
        const [response] = await connection.query(sqlPengguna1, [email, nama_lengkap, hashedPassword, nomor_telepon, role]);

        if (response) {
          const [responseLokasi] = await connection.query(sqlLokasi, [response.insertId, provinsi, kota, kecamatan]);
          const userId = response.insertId;
          if (responseLokasi && userId) {
            const [responseUpdate] = await connection.query(sqlPengguna2, [responseLokasi.insertId, userId]);

            if (responseUpdate) {
              res.status(201).json({
                statusCode: 201,
                message: "User creation success",
              });
            }
          }
        }
      }

      await connection.commit();
    } catch (error) {
      await connection.rollback();
      console.error(error);
      res.status(500).json({
        statusCode: 500,
        message: "Failed to create new user",
        error: error.message,
      });
    } finally {
      connection.release();
    }
  },

  login: async (req, res) => {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      const { email, password } = req.body;

      const sql = "SELECT * FROM pengguna WHERE email = ?";

      const [response] = await connection.query(sql, [email]);

      await connection.commit();

      if (response.length === 1) {
        const userData = response[0];

        if (userData.verifikasi === "invalid") {
          res.status(401).json({
            statusCode: 401,
            message: "Email not verified",
          });
        }

        const isValid = await bcrypt.compare(password, userData.password);
        if (!isValid) {
          res.status(401).json({
            statusCode: 401,
            message: "Data is not valid",
          });
        } else {
          const accessToken = jwt.sign(
            {
              id: userData.user_id,
              username: userData.email,
            },
            process.env.JWT_SECRET,
            {
              expiresIn: process.env.JWT_EXPIRES_IN,
            }
          );

          const refreshToken = jwt.sign(
            {
              id: userData.user_id,
              username: userData.email,
            },
            process.env.JWT_REFRESH_SECRET,
            {
              expiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
            }
          );

          res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: false,
            path: "/",
            sameSite: "strict",
          });
          res.status(201).json({
            statusCode: 201,
            message: "Login success!",
            accessToken: accessToken,
            userId: userData.user_id,
          });
        }
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({
        statusCode: 500,
        message: "Internal Server Error",
        error: error.message,
      });
    } finally {
      connection.release();
    }
  },

  logout: async (req, res) => {
    res.clearCookie("refreshToken");
    res.status(201).json({
      statusCode: 201,
      message: "Logout succesful",
    });
  },

  postinganBarang: async (req, res) => {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      const { lokasi, kategori } = req.query;

      const sql =
        'SELECT id, nama_barang, deskripsi_barang, barang.lokasi, jenis_penawaran, status_pengajuan, status_barter, kategori, pengguna.nama_lengkap, link_gambar from barang JOIN kategori_barang ON barang.kategori_barang=kategori_barang.kategori_id JOIN pengguna ON barang.user_id=pengguna.user_id JOIN gambar_barang ON gambar_barang.barang_id=barang.id WHERE status_pengajuan = "diterima" AND barang.lokasi = ?';

      const sqlKategori =
        'SELECT id, nama_barang, deskripsi_barang, barang.lokasi, jenis_penawaran, status_pengajuan, status_barter, kategori, pengguna.nama_lengkap, link_gambar from barang JOIN kategori_barang ON barang.kategori_barang=kategori_barang.kategori_id JOIN pengguna ON barang.user_id=pengguna.user_id JOIN gambar_barang ON gambar_barang.barang_id=barang.id WHERE status_pengajuan = "diterima" AND barang.lokasi = ? AND kategori_barang = ?';

      await connection.commit();

      if (lokasi && kategori) {
        const [response] = await connection.query(sqlKategori, [lokasi, kategori]);

        if (response.length > 0) {
          const reducedData = response.reduce((acc, item) => {
            const existing = acc.find((el) => el.id === item.id);

            if (existing) {
              existing.link_gambar.push(item.link_gambar);
            } else {
              acc.push({
                ...item,
                link_gambar: [item.link_gambar],
              });
            }

            return acc;
          }, []);

          if (reducedData) {
            res.status(200).json({
              statusCode: 200,
              data: reducedData,
            });
          }
        } else {
          res.status(404).json({
            statusCode: 404,
            message: "Data not found",
          });
        }
      } else if (lokasi) {
        const [response] = await connection.query(sql, [lokasi]);

        if (response.length > 0) {
          const reducedData = response.reduce((acc, item) => {
            const existing = acc.find((el) => el.id === item.id);

            if (existing) {
              existing.link_gambar.push(item.link_gambar);
            } else {
              acc.push({
                ...item,
                link_gambar: [item.link_gambar],
              });
            }

            return acc;
          }, []);

          if (reducedData) {
            res.status(200).json({
              statusCode: 200,
              data: reducedData,
            });
          }
        } else {
          res.status(404).json({
            statusCode: 404,
            message: "Data not found",
          });
        }
      }
    } catch (error) {
      await connection.rollback();
      console.error(error);
      res.status(500).json({
        statusCode: 500,
        message: "Internal Server Error",
        error: error.message,
      });
    } finally {
      connection.release();
    }
  },

  detailBarang: async (req, res) => {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      const { id } = req.query;

      const sqlDetail =
        'SELECT id, nama_barang, deskripsi_barang, barang.lokasi, jenis_penawaran, status_pengajuan, status_barter, kategori, pengguna.user_id, pengguna.nama_lengkap, pengguna.gambar_profile, lokasi.kota, lokasi.kecamatan, link_gambar FROM barang JOIN kategori_barang ON barang.kategori_barang=kategori_barang.kategori_id JOIN pengguna ON barang.user_id=pengguna.user_id JOIN gambar_barang ON gambar_barang.barang_id=barang.id JOIN lokasi ON pengguna.lokasi=lokasi.id_lokasi WHERE status_pengajuan = "diterima" AND id = ?';

      const [response] = await connection.query(sqlDetail, [id]);

      await connection.commit();

      if (response.length > 0) {
        const reducedData = response.reduce((acc, item) => {
          const existing = acc.find((el) => el.id === item.id);

          if (existing) {
            existing.link_gambar.push(item.link_gambar);
          } else {
            acc.push({
              ...item,
              link_gambar: [item.link_gambar],
            });
          }

          return acc;
        }, []);

        res.status(200).json({
          statusCode: 200,
          data: reducedData,
        });
      } else {
        res.status(404).json({
          statusCode: 404,
          message: "Data not found",
        });
      }
    } catch (error) {
      await connection.rollback();
      console.error(error);
      res.status(500).json({
        statusCode: 500,
        message: "Internal Server Error",
        error: error.message,
      });
    } finally {
      connection.release();
    }
  },

  pengajuanBarang: async (req, res) => {
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      const { user_id, nama_barang, deskripsi_barang, kategori_barang, lokasi, jenis_penawaran, link_gambar } = req.body;

      const sql = 'INSERT INTO barang (user_id, nama_barang, deskripsi_barang, kategori_barang, lokasi, jenis_penawaran, status_pengajuan, status_barter) VALUES (?, ?, ?, ?, ?, ?, "diajukan", null)';

      const [response] = await connection.query(sql, [user_id, nama_barang, deskripsi_barang, kategori_barang, lokasi, jenis_penawaran]);

      if (response) {
        const barangId = response.insertId;

        const linkGambarArray = JSON.parse(link_gambar);

        const sqlGambar = "INSERT INTO gambar_barang (barang_id, link_gambar, fileId) VALUES (?, ?, ?)";
        for (const gambar of linkGambarArray) {
          await connection.query(sqlGambar, [barangId, gambar.filePath, gambar.fileId]);
        }

        res.status(201).json({
          statusCode: 201,
          message: "Successfully submitted the goods",
        });
      }

      await connection.commit();
    } catch (error) {
      console.error(error);
      res.status(500).json({
        statusCode: 500,
        message: "Internal Server Error",
        error: error.message,
      });
    } finally {
      connection.release();
    }
  },

  waitingListBarang: async (req, res) => {
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      const { user_id, status } = req.query;

      const sql = "SELECT * FROM barang WHERE user_id = ? AND status_pengajuan = ?";

      const [response] = await connection.query(sql, [user_id, status]);

      if (response.length >= 1) {
        res.status(200).json({
          statusCode: 200,
          message: "List of goods waiting for approval",
          data: response,
        });
      }
    } catch (error) {
      await connection.rollback();
      console.error(error);
      res.status(500).json({
        statusCode: 500,
        message: "Internal Server Error",
        error: error.message,
      });
    }
  },

  chat: async (req, res) => {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      const { userId, tujuan } = req.query;

      const sql = "SELECT sender, receiver, chat, timestamp FROM chat WHERE (sender = ? AND receiver = ?) OR (sender = ? AND receiver = ?) ORDER BY timestamp ASC";

      const [response] = pool.query(sql, [userId, tujuan, userId, tujuan]);

      await connection.commit();

      if (response) {
        res.status(201).json({
          statusCode: 201,
          message: "Successfully retrieved chat data",
          data: response.data,
        });
      }
    } catch (error) {
      await connection.rollback();
      console.error(error);
      res.status(500).json({
        statusCode: 500,
        message: "Failed to retrieved chat data",
      });
    } finally {
      connection.release();
    }
  },

  otp: async (req, res) => {
    const connection = await pool.getConnection();
    try {
      const { email } = req.body;

      connection.beginTransaction();

      // Validasi input email
      if (!email) {
        return res.status(400).json({
          statusCode: 400,
          message: "Email is required",
        });
      }

      // Generate OTP
      let otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      });

      // Kirim email
      const sql = "INSERT INTO otp (email, otp) VALUES (?, ?)";

      const [response] = await connection.query(sql, [email, otp]);

      if (response.affectedRows === 1) {
        mailSender(
          email,
          "Verifikasi Kode OTP",
          `<h1>Masukkan Kode OTP ini ke dalam aplikasi</h1>
                    <p>Kode OTP: <strong>${otp}</strong></p>`
        );

        connection.commit();

        res.status(201).json({
          statusCode: 201,
          message: "OTP sent successfully",
        });
      }
    } catch (error) {
      console.error("Error sending email:", error.message);
      return res.status(500).json({
        statusCode: 500,
        message: "Failed to send OTP",
      });
    } finally {
      connection.release();
    }
  },

  verifyOtp: async (req, res) => {
    const connection = await pool.getConnection();

    try {
      const { email, otp } = req.body;

      await connection.beginTransaction();

      const sqlVerify = "SELECT email, otp FROM otp WHERE email = ?";

      const sqlValidEmail = 'UPDATE pengguna SET verifikasi = "valid" WHERE email = ?';

      const sqlDeleteOtp = "DELETE FROM otp WHERE email = ?";

      const [response] = await connection.query(sqlVerify, [email]);

      if (response[0].otp === otp) {
        await connection.query(sqlValidEmail, [email]);

        await connection.query(sqlDeleteOtp, [email]);

        await connection.commit();

        res.status(200).json({
          statusCode: 200,
          message: "OTP verified successfully",
        });
      } else {
        res.status(401).json({
          statusCode: 401,
          message: "Invalid OTP",
        });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({
        statusCode: 500,
        state: "error",
        message: error.message,
      });
    } finally {
      connection.release();
    }
  },

  fetchKabupaten: async (req, res) => {
    try {
      const { prov } = req.query;

      const fetchProv = await axios.get("https://alamat.thecloudalert.com/api/provinsi/get");

      const provinsi = fetchProv.data.result.find((item) => item.text === prov);

      const provinsiData = provinsi.id;

      const fetchKab = await axios.get(`https://alamat.thecloudalert.com/api/kabkota/get/?d_provinsi_id=${provinsiData}`);

      const kabupaten = fetchKab.data.result;

      if (kabupaten) {
        res.status(200).json({
          statusCode: 200,
          data: kabupaten,
        });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({
        statusCode: 500,
        state: "error",
        message: error.message,
      });
    }
  },

  laporkanPengguna: async (req, res) => {
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      const { reporter_id, target_id, alasan, isi_laporan } = req.body;

      const sqlLaporkan = "INSERT INTO laporan (reporter_id, target_id, alasan, isi_laporan) VALUES (?, ?, ?, ?)";

      const [response] = await connection.query(sqlLaporkan, [reporter_id, target_id, alasan, isi_laporan]);

      await connection.commit();

      if (response.affectedRows === 1) {
        res.status(200).json({
          statusCode: 200,
          message: "Laporan berhasil disimpan",
        });
      }
    } catch (error) {
      await connection.rollback();
      console.error(error.message);

      res.status(500).json({
        statusCode: 500,
        state: "error",
        message: error.message,
      });
    } finally {
      connection.release();
    }
  },

  likeBarang: async (req, res) => {
    const connection = await pool.getConnection();
    try {
      const { id_barang, id_user } = req.query;

      await connection.beginTransaction();

      const sqlLike = "INSERT INTO like_barang (barang_id, user_id) VALUES (?, ?)";

      const [response] = await connection.query(sqlLike, [id_barang, id_user]);

      await connection.commit();

      if (response.affectedRows === 1) {
        res.status(201).json({
          statusCode: 201,
          message: "Successfull liked things",
        });
      }
    } catch (error) {
      await connection.rollback();
      console.error(error.message);
      res.status(500).json({
        statusCode: 500,
        state: "error",
        message: error.message,
      });
    } finally {
      connection.release();
    }
  },

  getLikeBarang: async (req, res) => {
    const connection = await pool.getConnection();
    try {
      const { user_id } = req.query;

      await connection.beginTransaction();

      const getLikeSql =
        "SELECT barang.id, like_barang.user_id, barang.nama_barang, gambar_barang.link_gambar FROM like_barang JOIN barang ON like_barang.barang_id=barang.id JOIN gambar_barang ON like_barang.barang_id=gambar_barang.barang_id WHERE like_barang.user_id = ?";

      const [response] = await connection.query(getLikeSql, [user_id]);

      if (response.length > 0) {
        const reducedData = response.reduce((acc, item) => {
          const existing = acc.find((el) => el.id === item.id);

          if (existing) {
            existing.link_gambar.push(item.link_gambar);
          } else {
            acc.push({
              ...item,
              link_gambar: [item.link_gambar],
            });
          }

          return acc;
        }, []);

        if (reducedData) {
          res.status(200).json({
            statusCode: 200,
            data: reducedData,
          });
        }
      } else if (response.length === 0) {
        res.status(404).json({
          statusCode: 404,
          message: "Not Found",
        });
      }

      await connection.commit();
    } catch (error) {
      await connection.rollback();
      console.error(error.message);
      res.status(500).json({
        statusCode: 500,
        state: "error",
        message: error.message,
      });
    } finally {
      connection.release();
    }
  },

  deleteLikeBarang: async (req, res) => {
    const connection = await pool.getConnection();
    try {
      const { id_barang, user_id } = req.query;

      await connection.beginTransaction();

      const sqlDelete = "DELETE FROM like_barang WHERE barang_id = ? AND user_id = ?";

      const [response] = await connection.query(sqlDelete, [id_barang, user_id]);

      if (response.affectedRows === 1) {
        res.status(200).json({
          statusCode: 200,
          message: "Success delete liked things",
        });
      }
    } catch (error) {
      await connection.rollback();
      res.status(500).json({
        statusCode: 500,
        state: "error",
        message: error.message,
      });
    } finally {
      connection.release();
    }
  },

  searchBarang: async (req, res) => {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      const { lokasi, nama_barang } = req.query;

      const sqlSearchLoc =
        "SELECT id, nama_barang, deskripsi_barang, barang.lokasi, jenis_penawaran, status_pengajuan, status_barter, kategori, pengguna.nama_lengkap, link_gambar from barang JOIN kategori_barang ON barang.kategori_barang=kategori_barang.kategori_id JOIN pengguna ON barang.user_id=pengguna.user_id JOIN gambar_barang ON gambar_barang.barang_id=barang.id WHERE status_pengajuan = 'diterima' AND barang.lokasi = ? AND nama_barang LIKE ?";

      const sqlSearch =
        "SELECT id, nama_barang, deskripsi_barang, barang.lokasi, jenis_penawaran, status_pengajuan, status_barter, kategori, pengguna.nama_lengkap, link_gambar from barang JOIN kategori_barang ON barang.kategori_barang=kategori_barang.kategori_id JOIN pengguna ON barang.user_id=pengguna.user_id JOIN gambar_barang ON gambar_barang.barang_id=barang.id WHERE status_pengajuan = 'diterima' AND nama_barang LIKE ?";

      if (lokasi === "all" && nama_barang) {
        const [response] = await connection.query(sqlSearch, [nama_barang]);

        if (response.length > 0) {
          const reducedData = response.reduce((acc, item) => {
            const existing = acc.find((el) => el.id === item.id);

            if (existing) {
              existing.link_gambar.push(item.link_gambar);
            } else {
              acc.push({
                ...item,
                link_gambar: [item.link_gambar],
              });
            }

            return acc;
          }, []);

          if (reducedData) {
            res.status(200).json({
              statusCode: 200,
              message: "Success retrieved things",
              data: reducedData,
            });
          }
        } else if (response.length === 0) {
          res.status(404).json({
            statusCode: 404,
            message: "Not found",
          });
        }
      } else if (lokasi && nama_barang) {
        const [response] = await connection.query(sqlSearchLoc, [lokasi, nama_barang]);

        if (response.length > 0) {
          const reducedData = response.reduce((acc, item) => {
            const existing = acc.find((el) => el.id === item.id);

            if (existing) {
              existing.link_gambar.push(item.link_gambar);
            } else {
              acc.push({
                ...item,
                link_gambar: [item.link_gambar],
              });
            }

            return acc;
          }, []);

          if (reducedData) {
            res.status(200).json({
              statusCode: 200,
              message: "Success retrieved things",
              data: reducedData,
            });
          }
        } else if (response.length === 0) {
          res.status(404).json({
            statusCode: 404,
            message: "Not found",
          });
        }
      }
    } catch (error) {
      await connection.rollback();
      console.error(error);
      res.status(500).json({
        statusCode: 500,
        message: "Internal server error :",
        error,
      });
    } finally {
      connection.release();
    }
  },

  reqUploadGambar: (req, res) => {
    let result = imagekit.getAuthenticationParameters();

    res.send(result);
  },

  getKategori: async (req, res) => {
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      const sqlGetKategori = "SELECT * FROM kategori_barang";

      const [response] = await connection.query(sqlGetKategori);

      if (response.length > 0) {
        res.status(200).json({
          statusCode: 200,
          message: "Success retrieved kategori",
          data: response,
        });
      } else {
        res.status(404).json({
          statusCode: 404,
          message: "Not found",
        });
      }
    } catch (error) {
      await connection.rollback();
      res.status(500).json({
        statusCode: 500,
        message: "Internal server error :",
      });
    } finally {
      connection.release();
    }
  },

  getUserProfile: async (req, res) => {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      const { user_id } = req.query;

      const sqlProfile =
        "SELECT email, nama_lengkap, nomor_telepon, gambar_profile, gambar_id, role, lokasi.provinsi, lokasi.kota, lokasi.kecamatan FROM pengguna JOIN lokasi ON pengguna.lokasi = lokasi.id_lokasi WHERE pengguna.user_id = ?";

      const [response] = await connection.query(sqlProfile, [user_id]);

      await connection.commit();

      if (response.length > 0) {
        res.status(200).json({
          statusCode: 200,
          message: "Success retrieved user profile",
          data: response,
        });
      } else {
        res.status(404).json({
          statusCode: 404,
          message: "Not found",
        });
      }
    } catch (error) {
      await connection.rollback();
      res.status(500).json({
        statusCode: 500,
        message: "Internal server error",
      });
    } finally {
      connection.release();
    }
  },

  editProfileImg: async (req, res) => {
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      const { gambar_profile, gambar_id, user_id } = req.query;

      const sqlEditImg = "UPDATE pengguna SET gambar_profile = ?, gambar_id = ? WHERE user_id = ?";

      const [response] = await connection.query(sqlEditImg, [gambar_profile, gambar_id, user_id]);

      if (response) {
        res.status(201).json({
          statusCode: 201,
          message: "Success updated profile image",
        });
      }

      await connection.commit();
    } catch (error) {
      await connection.rollback();
      res.status(500).json({
        statusCode: 500,
        message: "Internal server error",
      });
    } finally {
      connection.release();
    }
  },

  deleteImageKit: async (req, res) => {
    try {
      const { fileId } = req.query;

      imagekit.deleteFile(fileId, (err, result) => {
        if (err) {
          return res.status(400).json({
            statusCode: 400,
            message: "Failed to delete image",
          });
        }

        res.status(200).json({
          statusCode: 200,
          message: "Success delete image",
          data: result,
        });
      });
    } catch (error) {
      res.status(500).json({
        statusCode: 500,
        message: "Image delete failed",
      });
    }
  },

  editDataProfile: async (req, res) => {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      const { nama_lengkap, nomor_telepon, password, user_id, old_password } = req.body;

      const sqlCheckName = "SELECT nama_lengkap FROM pengguna WHERE nama_lengkap = ?";

      const sqlEditProfileNama = "UPDATE pengguna SET nama_lengkap = ? WHERE user_id = ?";
      const sqlEditProfileNomor = "UPDATE pengguna SET nomor_telepon = ? WHERE user_id = ?";
      const sqlEditProfilePassword = "UPDATE pengguna SET password = ? WHERE user_id = ?";

      if (nama_lengkap && !nomor_telepon && !password && !old_password) {
        const [responseCheck] = await connection.query(sqlCheckName, [nama_lengkap]);

        if (responseCheck.length > 0) {
          return res.status(400).json({
            statusCode: 400,
            message: "Name has been used",
          });
        }

        const [response] = await connection.query(sqlEditProfileNama, [nama_lengkap, user_id]);

        if (response.affectedRows === 1) {
          res.status(200).json({
            statusCode: 200,
            message: "Success edit name",
          });
        }
      } else if (nomor_telepon && !nama_lengkap && !password && old_password) {
        const [response] = await connection.query(sqlEditProfileNomor, [nomor_telepon, user_id]);

        if (response) {
          res.status(200).json({
            statusCode: 200,
            message: "Success edit telephone number",
          });
        }
      } else if (password && old_password && !nomor_telepon && !nama_lengkap) {
        const sqlCheckPass = "SELECT password FROM pengguna WHERE user_id = ?";

        const [response] = await connection.query(sqlCheckPass, [user_id]);

        if (response) {
          const oldPass = response[0];

          const [compare, hashedPassword] = await Promise.all([
            bcrypt.compare(old_password, oldPass.password),
            bcrypt.hash(password, 12)
          ])

          if (!compare) {
            return res.status(400).json({
              statusCode: 400,
              message: "Password is incorrect",
            });
          } else {

            const [responsePost] = await connection.query(sqlEditProfilePassword, [hashedPassword, user_id]);

            if (responsePost) {
              res.status(200).json({
                statusCode: 200,
                message: "Success edit password",
              });
            }
          }
        }
      }
      await connection.commit();
    } catch (error) {
      await connection.rollback();
      res.status(500).json({
        statusCode: 500,
        message: "Error edit profile, internal server error",
      });
    } finally {
      connection.release();
    }
  },

  editProfileLocation: async (req, res) => {
    const connection = await pool.getConnection();

    try {
      const { provinsi, kota, kecamatan, user_id } = req.body;

      const sqlEditLocation = "UPDATE lokasi SET provinsi = ?, kota = ?, kecamatan = ? WHERE user_id = ?";

      const [response] = await connection.query(sqlEditLocation, [provinsi, kota, kecamatan, user_id]);

      if (response.affectedRows > 0) {
        res.status(200).json({
          statusCode: 200,
          message: "Success edit location",
        });
      }
    } catch (error) {
      await connection.rollback();
      res.status(500).json({
        statusCode: 500,
        message: "Error edit location, internal server error",
      });
    } finally {
      connection.release();
    }
  },
};

module.exports = barterController;
