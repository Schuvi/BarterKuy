const express = require("express")
const router = express.Router()
const jwt = require('jsonwebtoken')

const barterController = require('../controller/controller')

const authenticateJWT = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Access denied' });
  
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) return res.status(403).json({ message: 'Invalid token' });
      req.user = user;
      next();
    });
}

router.post('/register', barterController.register)
router.post('/login', barterController.login)
router.post('/logout', authenticateJWT, barterController.logout)
router.post('/otp', barterController.otp)
router.post('/verify-otp', barterController.verifyOtp)
router.post('/laporkan', barterController.laporkanPengguna)
router.get('/posts', barterController.postinganBarang)
router.get('/kabupaten', barterController.fetchKabupaten)
router.get('/detail', barterController.detailBarang)

module.exports = router