const express = require("express")
const dotenv = require("dotenv")
const mongoose = require("mongoose")
const cors = require("cors")
const passport = require("passport")
const Pusher = require("pusher");



/*
 ** ROUTES
 */
const auth = require("./routes/auth.js")
const user = require("./routes/user.js")
const notification = require("./routes/notification.js")

/*
 ** SETUP ENVIRONMENT
 */
dotenv.config()

/*
 ** MONGO DB CONNECT
 */
mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
})



/*
** ! Pusher
*/
const pusher = new Pusher({
  appId: process.env.APP_ID,
  key: process.env.KEY,
  secret: process.env.SECRET,
  cluster: "eu",
  useTLS: true
});

// pusher.trigger("my-channel", "my-event", {
//   message: "hello world"
// });





const app = express()
app.use("/uploads", express.static("uploads"))

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cors())

app.use(passport.initialize())
require("./config/passport")(passport)

// * Routes
app.use("/api/auth", auth)
app.use("/api/user", user)
app.use("/api/notification", notification)









/*
 ** RUN APP
 */
const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Server is up and running on port http://localhost:${PORT}/`)
})

