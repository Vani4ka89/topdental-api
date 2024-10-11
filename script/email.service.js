import nodemailer from 'nodemailer';
import hbs from "nodemailer-express-handlebars";
import * as path from "node:path";

const transporter = nodemailer.createTransport({
    from: "No reply",
    service: 'gmail',
    auth: {
        user: 'ivan.tym4ak@gmail.com',
        pass: 'djljvxdukglxdvau',
    }
});

transporter.use('compile', hbs({
    viewEngine: {
        extname: '.hbs',
        partialsDir: path.join(process.cwd(), './views'),
        defaultLayout: false,
    },
    viewPath: path.join(process.cwd(), './views'),
    extName: '.hbs',
}));

const emailService = {
    sendMail: async (to, emailAction, context) => {
        const mailOptions = {
            from: 'Top Dental <ivan.tym4ak@gmail.com>',
            to,
            subject: context.name,
            template: 'appointment',
            context: {
                patientName: context.name,
                phoneNumber: context.phoneNumber,
                appointmentDate: context.date,
                comment: context.comment
            },
            // attachments: [{
            //     filename: 'logo_small.png',
            //     path: path.join(process.cwd(), 'views', 'image', 'logo_small.png'),
            //     cid: 'logo@topdental'
            // }]
        };

        try {
            const info = await transporter.sendMail(mailOptions);
            console.log('Email відправлено:', info.response);
        } catch (error) {
            console.error('Помилка при відправці email:', error);
        }
    }
};

export default emailService;