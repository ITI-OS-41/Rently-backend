
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
 ** ROUTES
 */

// const auth = require('./routes/auth.js');
const user = require("./routes/user");
const notification = require("./routes/notification");
const blog = require("./routes/blog");
const faq = require("./routes/faq");
const rent = require("./routes/rent");
const item = require("./routes/item");
const category = require("./routes/category");
const subcategory = require("./routes/subCategory");
const appRate = require("./routes/appRate");
const itemRate = require("./routes/itemRate");
const userRate = require("./routes/userRate");


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

app.use(passport.initialize());
require("./config/passport")(passport);

// app.use("/api/auth", auth);
app.use("/api/user", user);
app.use("/api/category", category);
app.use("/api/subcategory", subcategory);
app.use("/api/notification", notification);
app.use("/api/blog", blog);
app.use("/api/faq", faq);
app.use("/api/rent", rent);
app.use("/api/item", item);
app.use("/api/apprate", appRate);
app.use("/api/itemrate", itemRate);
app.use("/api/userrate", userRate);
// TODO

/*
 ** RUN APP
 */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is up and running on port http://localhost:${PORT}/`);
});

// ! TODO:
// - user roles permissions by middleware
