const express = require("express");
const router = express.Router();
const adminController = require('../controler/adminController');
const { authMiddleware ,preventAuthAccess} = require("../middleware/admin.js");  // Correct import

// Admin authentication routes
router.get('/login', preventAuthAccess,adminController.getLogin);
router.post("/login", preventAuthAccess,adminController.postLogin);
router.get("/logout", authMiddleware,adminController.logout);

// User management routes (Protected by authentication)
router.get("/create", authMiddleware, adminController.getCreateUser);
router.post("/create", authMiddleware, adminController.postCreateUser);
router.get("/edit/:id", authMiddleware, adminController.getEditUser);
router.post("/edit/:id", authMiddleware, adminController.postEditUser);
router.post("/delete/:id", authMiddleware, adminController.deleteUser);
 // Delete user

// Dashboard (merged with user list)
router.get("/dashboard", authMiddleware, adminController.getDashboard);

module.exports = router;
