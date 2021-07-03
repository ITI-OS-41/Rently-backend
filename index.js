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


const stripe = require('stripe')('sk_test_51J72gVH4P1CollSv1w4jIaimW26Lg65vhUB8DA8K4QU2iFaPgeze9ij7sFlTUZK7fe4bJZSD0UoqYyz9KzaKXa0a00Y8PTMbwq');
const YOUR_DOMAIN = 'http://localhost:3000/checkout';

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
const payment = require("./routes/payment");


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



app.post("/api/checkout", async (req, res) => {
  console.log("Request:", req.body);

  let error;
  let status;
  try {
    const { products, total, token } = req.body;

    const customer = await stripe.customers.create({
      email: token.email,
      source: token.id
    });

    // const idempotency_key = uuid();
    const idempotency_key = (Math.random() * 100000000);
    const charge = await stripe.charges.create(
      {
        amount: total * 100,
        currency: "usd",
        customer: customer.id,
        receipt_email: token.email,
        description: `Purchased from Rently with ${total}$`,
        shipping: {
          name: token.card.name,
          address: {
            line1: token.card.address_line1,
            line2: token.card.address_line2,
            city: token.card.address_city,
            country: token.card.address_country,
            postal_code: token.card.address_zip
          }
        }
      },
      {
        idempotency_key
      }
    );
    console.log("Charge:", { charge });
    status = "success";
  } catch (error) {
    console.error("Error:", error);
    status = "failure";
  }

  res.json({ error, status });
});



/*
 ** RUN APP
 */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is up and running on port http://localhost:${PORT}/`);
});

// ! TODO:
// - user roles permissions by middleware
