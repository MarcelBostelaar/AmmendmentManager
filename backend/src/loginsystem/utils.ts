import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: process.env.MAILSERVICE,
    auth: {
      user: process.env.MAILUSER,
      pass: process.env.MAILPASSWORD
    }
});

export function sendPasswordForgottenMail(receipiant, title, content){
      const mailOptions = {
        from: process.env.MAILUSER,
        to: receipiant,
        subject: title,
        text: content
      };
      
      return transporter.sendMail(mailOptions);
}