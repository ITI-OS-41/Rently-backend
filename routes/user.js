const router = require("express").Router();
const user = require("../controllers/user-controller");
const auth = require("../middleware/auth");
const authAdmin = require("../middleware/authAdmin");

router.post("/register", user.register);

router.post("/activation", user.activateEmail);

router.post("/login", user.login);

router.post("/refresh_token", user.getAccessToken);

router.post("/forgot", user.forgotPassword);

router.post("/reset", auth, user.resetPassword);

router.get("/infor", auth, user.getUserInfor);

router.get("/all_infor", auth, authAdmin, user.getUsersAllInfor);

//! Make function to return top users
router.get("/top", user.getUsersAllInfor);

router.get("/logout", user.logout);

router.patch("/update", auth, user.updateUser);

router.patch("/update_role/:id", auth, authAdmin, user.updateUsersRole);

router.delete("/delete/:id", auth, authAdmin, user.deleteUser);

router.post("/contact-us", user.contactUsForm);

// Social Login
router.post("/google_login", user.googleLogin);

router.post("/facebook_login", user.facebookLogin);

router.get("/:id",  user.getUser);


module.exports = router;
