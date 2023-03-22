const express = require('express')
const index = express()
const nodemailer = require("nodemailer");
const port = process.env.PORT || 6060
const cors = require('cors')
const bodyParser = require('body-parser')
let smtpTransport = require('nodemailer-smtp-transport');
const { send } = require('../');

index.use(cors())
index.use(bodyParser.urlencoded({extended: false}))
index.use(bodyParser.json())

let transporter = nodemailer.createTransport(smtpTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  auth: {
    user: "hoinyjibp@gmail.com",
    pass: "swcztrvmnwqrlhqk"
  }
}));

index.get('/', (req, res)=>{
    res.send("Server ok")
})

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
