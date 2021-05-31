const express = require("express")
const dotenv = require("dotenv")
const mongoose = require("mongoose")
const bodyParser = require("body-parser")
const cors = require("cors")
const passport = require("passport")

/*
 ** ROUTES
 */
const users = require("./routes/users.js")

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

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cors())

app.use(passport.initialize())
require("./config/passport")(passport)

app.use("/api/users", users)

/*
 ** RUN APP
 */
const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Server is up and running on port ${PORT}`)
})
