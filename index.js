const express = require("express")
const dotenv = require("dotenv")
const mongoose = require("mongoose")
const cors = require("cors")
const passport = require("passport")

/*
 ** ROUTES
 */
const auth = require("./routes/auth.js")
const user = require("./routes/user.js")
const blog = require("./routes/blog.js")

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
app.use("/api/blog", blog)

/*
 ** RUN APP
 */
const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Server is up and running on port http://localhost:${PORT}/`)
})

// ! TODO:
// - user roles permissions by middleware