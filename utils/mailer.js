import nodemailer from 'nodemailer';
import 'dotenv/config';

export const sendEmail = async ({ to, subject, htmlContent }) => {
    let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: process.env.MAIL_PORT,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.MAIL_USERNAME, // generated ethereal user
            pass: process.env.MAIL_PASSWORD, // generated ethereal password
        },
    });

    const options = {
        from: process.env.MAIL_FROM, // sender address
        to: to, // list of receivers
        subject: subject, // Subject line
        html: htmlContent, // html body
    };

    return await transporter.sendMail(options);
};
