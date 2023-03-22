const express = require('express')
const index = express()
const nodemailer = require("nodemailer");
const port = process.env.PORT || 6060
const cors = require('cors')
const bodyParser = require('body-parser')

index.use(bodyParser.urlencoded({extended: false}))
index.use(bodyParser.json())



const corsOptions = {
    origin: "https://asont.github.io",
    optionsSuccessStatus: 200
}

index.get('/', cors(corsOptions),(req, res)=>{
    res.send("Server ok")
})


index.post('/send', cors(corsOptions), async (req, res) => {

    const {name, phone, email, subject, message} = req.body

    const transporter = nodemailer.createTransport({
        service:'gmail',
        port: 465,
        host: "smtp.gmail.com",
        auth: {
            user: process.env.API_URL_EMAIL,
            pass: process.env.API_URL_PASSWORD,
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
            address: email,
        },
        replyTo: email,
        to: process.env.API_URL_EMAIL,
        subject: subject,
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