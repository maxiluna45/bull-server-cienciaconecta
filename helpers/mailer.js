import nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
    },
});

try {
    transporter.verify()
    console.log("Ready to send emails")
} catch (error) {
    console.log(error)
}
