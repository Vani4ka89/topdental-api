import nodemailer from 'nodemailer';
// const path = require("path");
// const hbs = require("nodemailer-express-handlebars");
// const { emailTemplates } = require("../constants/email.constants");

const transporter = nodemailer.createTransport({
    from: "No reply",
    service: 'gmail',
    auth: {
        user: 'ivan.tym4ak@gmail.com',
        pass: 'djljvxdukglxdvau', // Варто зберігати цей пароль в змінних оточення!
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

const emailService = {
    sendMail: async (to, emailAction, context) => {
        let text = '';

        if (context.comment) {
            text = `Зателефонуйте мені за номером: ${context.phoneNumber}, Коментар: ${context.comment}`;
        } else if (context.date) {
            text = `Зателефонуйте мені за номером: ${context.phoneNumber}, Бажана дата: ${context.date}`;
        }

        const mailOptions = {
            from: process.env.EMAIL_USER || 'ivan.tym4ak@gmail.com',
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

export default emailService;