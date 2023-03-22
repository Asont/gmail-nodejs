const express = require('express')
const index = express()
const nodemailer = require("nodemailer");
const port = process.env.PORT || 6060
const cors = require('cors')
const bodyParser = require('body-parser')
/*let smtpTransport = require('nodemailer-smtp-transport');*/

index.use(cors())
index.use(bodyParser.urlencoded({extended: false}))
index.use(bodyParser.json())

/*let transporter = nodemailer.createTransport(smtpTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  auth: {
    user: "hoinyjibp@gmail.com",
    pass: "swcztrvmnwqrlhqk"
  }
}));*/

index.get('/', (req, res)=>{
    res.send("Server ok")
})
/*

index.post('/send', (req, res) => {

  const {name, phone, email, subject, message} = req.body

  transporter.sendMail({
        from: email,
        to: "hoinyjibp@gmail.com",
        subject: subject,
        html: `<p>${message}</p><p>${phone}</p><p>${name}</p>`
      }
      , function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });

  res.send('OK')
})

index.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

*/


index.post('/send', async (req, res) => {

    const {name, phone, email, subject, message} = req.body

    const transporter = nodemailer.createTransport({
        port: 465,
        host: "smtp.gmail.com",
        auth: {
            user: "hoinyjibp@gmail.com",
            pass: "swcztrvmnwqrlhqk",
        },
        secure: true,
    });

    await new Promise((resolve, reject) => {
        // verify connection configuration
        transporter.verify(function (error, success) {
            if (error) {
                console.log(error);
                reject(error);
            } else {
                console.log("Server is ready to take our messages");
                resolve(success);
            }
        });
    });

    const mailData = {
        from: {
            name: `${name}`,
            address: "myEmail@gmail.com",
        },
        replyTo: email,
        to: "hoinyjibp@gmail.com",
        subject: {subject},
        text: message,
        html: `<p>${message}</p><p>${phone}</p><p>${name}</p>`,
    };

    await new Promise((resolve, reject) => {
        // send mail
        transporter.sendMail(mailData, (err, info) => {
            if (err) {
                console.error(err);
                reject(err);
            } else {
                console.log(info);
                resolve(info);
            }
        });
    });

    res.status(200).json({ status: "OK" });
})

index.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})