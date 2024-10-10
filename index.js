import express from 'express';
import cors from 'cors';
import emailService from "./script/email.service.js";
import * as process from "node:process";
import * as path from "node:path";

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors({origin: true}))

const email = 'ivan.tym4ak@gmail.com';
const PORT = process.env.PORT || 3001;
const HOST = process.env.HOST || '';

app.use(express.static('./public'));

app.get('*', (req, res) => {
    res.sendFile(path.resolve(process.cwd(), 'public', 'index.html'));
});

app.post('/users/first_form', async (req, res) => {
    const {name, phoneNumber, comment} = req.body;
    const commentField = comment ? comment : 'немає';
    try {
        await emailService.sendMail(email, 'welcome', {
            name,
            phoneNumber,
            comment: commentField
        });
        res.json({message: 'Дякую! Ми Вам перетелефонуємо.'});
    } catch (e) {
        console.error(e);
        res.status(500).json({message: 'Error sending message!'});
    }
});

app.post('/users/second_form', async (req, res) => {
    const {name, phoneNumber, date} = req.body;
    try {
        await emailService.sendMail(email, 'welcome', {name, phoneNumber, date});
        res.json({message: 'Дякую! Ми Вам перетелефонуємо.'});
    } catch (e) {
        console.error(e);
        res.status(500).json({message: 'Error sending message!'});
    }
});

app.use((err, req, res) => {
    console.error(err);
    err.res.json({
        message: 'Internal Server Error',
        status: 500,
    });
});

app.listen(PORT, HOST, () => {
    console.log(`Server started on ${HOST}:${PORT}`);
});