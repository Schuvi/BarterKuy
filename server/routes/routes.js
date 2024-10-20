const express = require("express");
const router = express.Router();
const authJWT = require("./protectedApi")

const barterController = require("../controller/controller");

router.post("/register", barterController.register);
router.post("/login", barterController.login);
router.post("/logout", authJWT, barterController.logout);
router.post("/otp", authJWT, barterController.otp);
router.post("/verify-otp", authJWT, barterController.verifyOtp);
router.post("/laporkan", authJWT, barterController.laporkanPengguna);
router.post("/delete/liked", authJWT, barterController.deleteLikeBarang);
router.post("/post/liked", authJWT, barterController.likeBarang);
router.post("/post/barang", authJWT, barterController.pengajuanBarang);
router.post("/update/profile/img", authJWT, barterController.editProfileImg);
router.post("/delete/img", authJWT, barterController.deleteImageKit);
router.post("/edit/profile", authJWT, barterController.editDataProfile);
router.post("/edit/profile/location", authJWT, barterController.editProfileLocation);
router.get("/search", authJWT, barterController.searchBarang);
router.get("/posts", authJWT, barterController.postinganBarang);
router.get("/kabupaten", authJWT, barterController.fetchKabupaten);
router.get("/detail", authJWT, barterController.detailBarang);
router.get("/get/liked", authJWT, barterController.getLikeBarang);
router.get("/get/auth/imagekit", authJWT, barterController.reqUploadGambar);
router.get("/get/kategori", authJWT, barterController.getKategori);
router.get("/get/user", authJWT, barterController.getUserProfile);

module.exports = router;
