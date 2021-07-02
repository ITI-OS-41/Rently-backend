const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const { OAuth2 } = google.auth;
const OAUTH_PLAYGROUND = "https://developers.google.com/oauthplayground";

const {
  MAILING_SERVICE_CLIENT_ID,
  MAILING_SERVICE_CLIENT_SECRET,
  MAILING_SERVICE_REFRESH_TOKEN,
  SENDER_EMAIL_ADDRESS,
} = process.env;

const oauth2Client = new OAuth2(
  MAILING_SERVICE_CLIENT_ID,
  MAILING_SERVICE_CLIENT_SECRET,
  MAILING_SERVICE_REFRESH_TOKEN,
  OAUTH_PLAYGROUND
);

// send mail
const sendEmail = (data, txt,res) => {
  oauth2Client.setCredentials({
    refresh_token: MAILING_SERVICE_REFRESH_TOKEN,
  });

  const accessToken = oauth2Client.getAccessToken();

  const smtpTransport = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: SENDER_EMAIL_ADDRESS,
      clientId: MAILING_SERVICE_CLIENT_ID,
      clientSecret: MAILING_SERVICE_CLIENT_SECRET,
      refreshToken: MAILING_SERVICE_REFRESH_TOKEN,
      accessToken,
    },
  });

  const mailOptions = {
    from: data.email,
    to: SENDER_EMAIL_ADDRESS,
    subject: "Rently Application Contact Us Form",
    html: `
             <p>You have a new contact request.</p>
      <h3>Contact Details</h3>
      <ul>
      <li>Email: ${data.email}</li>
        <li>Name: ${data.name}</li>
        <li>phone: ${data.phone}</li>
        <li>Message: ${data.message}</li>
      </ul>
        `,
  };
  try {
    smtpTransport.sendMail(mailOptions, (err, infor) => {
      if (err)  {
         res.status(500).send({
          success:false,
          message:"something went wrong. try again later"
        })
      }else{

          res.status(200).send({
            success: true,
            message: "Thanks for contacting us, we will get back to you shortly",
          });
          return infor;
      }
    });
  } catch (error) {
     res.status(500).send({
      success: false,
      message: "something went wrong. try again later",
    });
    // ex.FailedRecipient and ex.GetBaseException() should give you enough info.
  }
};

module.exports = sendEmail;
