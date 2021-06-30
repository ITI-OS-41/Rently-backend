/*
 ** SETUP ENVIRONMENT
 */

require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const passport = require("passport");
const cookieParser = require("cookie-parser");
const path = require("path");

/*
** MONGO DB CONNECT
*/
mongoose.connect(
  process.env.MONGODB_URL,
  {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
    useCreateIndex: true,
  },
  (err) => {
    if (err) throw err;
    console.log("Connected to mongodb on atlas");
  }
  );
  
  /*
   ** ROUTES
   */
// const auth = require("./routes/auth.js");
const user = require("./routes/user.js");
const category = require("./routes/category.js");
const subcategory = require("./routes/subCategory.js");
const blog = require("./routes/blog.js");
const comment = require("./routes/comment.js");
const notification = require("./routes/notification.js");
const faq = require("./routes/faq.js");
const cart = require("./routes/cart.js");
const rent = require("./routes/rent.js");
const item = require("./routes/item.js");
const appRate = require("./routes/appRate.js");
const itemRate = require("./routes/itemRate.js");
const userRate = require("./routes/userRate.js");
const conversation = require("./routes/conversation");
const message = require("./routes/message");


/*
 ** ! Pusher
 */
// const Pusher = require("pusher");

// const pusher = new Pusher({
//   appId: process.env.PUSHER_APP_ID,
//   key: process.env.PUSHER_APP_KEY,
//   secret: process.env.PUSHER_APP_SECRET,
//   cluster: process.env.PUSHER_APP_CLUSTER,
//   useTLS: true
// });

// pusher.trigger("my-channel", "my-event", {
//   message: "hello world"
// });

const app = express();

require("./config/passport")(passport);
app.use(passport.initialize());

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  cors({
    exposedHeaders: ["X-Total-Count", "Content-Range"],
  })
);

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Expose-Headers", "X-Total-Count, Content-Range");
  next();
});

// app.use("/api/auth", auth);
app.use("/api/user", user);
app.use("/api/category", category);
app.use("/api/subcategory", subcategory);
app.use("/api/blog", blog);
app.use("/api/comment", comment);
app.use("/api/faq", faq);
app.use("/api/cart", cart);
app.use("/api/notification", notification);
app.use("/api/rent", rent);
app.use("/api/item", item);
app.use("/api/apprate", appRate);
app.use("/api/itemrate", itemRate);
app.use("/api/userrate", userRate);
app.use("/api/conversation", conversation);
app.use("/api/message", message);

/*
 ** RUN APP
 */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is up and running on port http://localhost:${PORT}/`);
});

// ! TODO:
// - user roles permissions by middleware
