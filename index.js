/** @format */

const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors');
const passport = require('passport');



/*
 ** ROUTES
 */

const auth = require("./routes/auth.js")
const user = require("./routes/user.js")
const notification = require("./routes/notification.js")
const blog = require('./routes/blog.js');
const faq = require('./routes/faq.js');
const rent = require('./routes/rent.js');
const category = require('./routes/category.js');
const subcategory = require('./routes/subCategory.js');


/*
 ** SETUP ENVIRONMENT
 */
dotenv.config();

/*
 ** MONGO DB CONNECT
 */
mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});


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
app.use('/uploads', express.static('uploads'));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.use(passport.initialize());
require('./config/passport')(passport);


app.use('/api/auth', auth);
app.use('/api/user', user);
app.use('/api/category', category);
app.use('/api/subcategory', subcategory);
app.use("/api/notification", notification)
app.use('/api/blog', blog);
app.use('/api/faq', faq);
app.use("/api/rent", rent)


/*
 ** RUN APP
 */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is up and running on port http://localhost:${PORT}/`);
});

