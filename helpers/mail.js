/** @format */

// //
const nodemailer = require('nodemailer');
const {promisify} = require('es6-promisify');
const juice = require('juice');
const htmlToText = require('html-to-text');
const pug = require('pug');
// var transport = nodemailer.createTransport({
//   host: "smtp.mailtrap.io",
//   port: 2525,
//   auth: {
//     user: "614611d8444f1a",
//     pass: "64cca22127a029"
//   }
// });

// var mailOptions = {
//   from: '"Example Team" <from@example.com>',
//   to: 'user1@example.com, user2@example.com',
//   subject: 'Nice Nodemailer test',
//   text: 'Hey there, it’s our first message sent with Nodemailer ',
//   html: '<b>Hey there! </b><br> This is our first message sent with Nodemailer<br /><img src="cid:uniq-mailtrap.png" alt="mailtrap" />',
//   attachments: [
//     {
//       filename: 'mailtrap.png',
//       path: __dirname + 'https://576154-1866656-raikfcquaxqncofqfm.stackpathdns.com/mailtrap.png',
//       cid: 'uniq-mailtrap.png'
//     }
//   ]
// };

// transport.sendMail(mailOptions, (error, info) => {
//   if (error) {
//     return console.log(error);
//   }
//   console.log('Message sent: %s', info.messageId);
// });
const transport = nodemailer.createTransport({
	host: process.env.MAIL_HOST,
	port: process.env.MAIL_PORT,
	auth: {
		user: process.env.MAIL_USER,
		pass: process.env.MAIL_PASS,
	},
});

const generateHTML = (filename, options = {}) => {
	const html = pug.renderFile(
		`${__dirname}/../views/email/${filename}.pug`,
		options
	);
	const inlined = juice(html);
	return inlined;
};

exports.send = async (options) => {
	const html = generateHTML(options.filename, options);
	const text = htmlToText.fromString(html);
	const mailOptions = {
		from: `Site <noreply@domain.com>`,
		to: options.user.email,
		subject: options.subject,
		html,
		text,
	};
	// const sendMail = promisify(transport.sendMail, transport);
	return transport.sendMail(mailOptions);
};
