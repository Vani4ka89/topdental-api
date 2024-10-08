import nodemailer from 'nodemailer';
import {configs} from "../configs/configs";
// import * as path from "node:path";
// import hbs from "nodemailer-express-handlebars";
import {EEmailActions} from "../enums/email-actions.enum";
// import {emailTemplates} from "../constants/email.constants";

const transporter = nodemailer.createTransport({
    from: "No reply",
    service: 'gmail',
    auth: {
        user: 'ivan.tym4ak@gmail.com',
        pass: 'djljvxdukglxdvau',
    }
});

// const hbsOptions = {
//     viewEngine: {
//         extname: '.hbs',
//         layoutsDir: path.join(__dirname, 'email-templates', 'layouts'),
//         defaultLayout: 'main', // Основний шаблон
//         partialsDir: path.join(__dirname, 'email-templates', 'partials'),
//     },
//     viewPath: path.join(__dirname, 'email-templates', 'views'), // Шлях до шаблонів
//     extName: '.hbs',
// };
//
// // Інтеграція шаблонів з Nodemailer
// transporter.use('compile', hbs(hbsOptions));

export const emailService = {
    sendMail: async (to: string, emailAction: EEmailActions, context: {
        name: string,
        phoneNumber: string,
        comment?: string,
        date?: string
    }) => {
        let text: string;

        if (context?.comment) {
            text = `Зателефонуйте мені за номером: ${context.phoneNumber}, Коментар: ${context.comment}`;
        } else if (context?.date) {
            text = `Зателефонуйте мені за номером: ${context.phoneNumber}, Бажана дата: ${context.date}`;
        }

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to,
            subject: `Привіт, я ${context.name}`,
            text
        };

        // const {templateName, subject} = emailTemplates[emailAction];
        // const mailOptions = {
        //     to,
        //     subject,
        //     template: templateName,
        //     context,
        //     text
        // };

        try {
            const info = await transporter.sendMail(mailOptions);
            console.log('Email відправлено:', info.response);
        } catch (error) {
            console.error('Помилка при відправці email:', error);
        }

        // return await transporter.sendMail(mailOptions);
    }
};