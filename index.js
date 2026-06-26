import express from 'express';
import cors from 'cors';
import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

import emailService from './script/email.service.js';

const app = express();

/* =======================
   CONFIG
======================= */

// const EMAIL = 'topdentalternopil@gmail.com';
const EMAIL = 'ivan.tym4ak@gmail.com';


const PORT = process.env.PORT || 3001;
const HOST = process.env.HOST || '';

const CONTENT_PORT = process.env.CONTENT_PORT || PORT;

const contentFile =
    process.env.CONTENT_FILE ||
    path.resolve(process.cwd(), 'data/site-content.json');

const adminPassword =
    process.env.CONTENT_ADMIN_PASSWORD ||
    process.env.REACT_APP_ADMIN_PASSWORD ||
    'topdental-admin';

/* =======================
   MIDDLEWARE
======================= */

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));

// app.use(
//     cors({
//         origin: /https:\/\/(\w+\.)?topdental\.te\.ua$/,
//         methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//     })
// );

app.use(
    cors({
        origin: [
            'https://topdental.te.ua',
            'https://www.topdental.te.ua',
            'https://topdental-api-2a1bf2e56e90.herokuapp.com/'
        ],
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'X-Admin-Password'],
    })
);

app.use(express.static('public'));

/* =======================
   EMAIL ROUTES
======================= */

app.post('/users/first_form', async (req, res) => {
    const { name, phoneNumber, comment } = req.body;

    try {
        await emailService.sendMail(EMAIL, 'welcome', {
            name,
            phoneNumber,
            comment: comment || 'немає',
        });

        res.json({ message: 'Дякую! Ми Вам перетелефонуємо.' });
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: 'Error sending message!' });
    }
});

app.post('/users/second_form', async (req, res) => {
    const { name, phoneNumber, date } = req.body;

    try {
        await emailService.sendMail(EMAIL, 'welcome', {
            name,
            phoneNumber,
            date,
        });

        res.json({ message: 'Дякую! Ми Вам перетелефонуємо.' });
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: 'Error sending message!' });
    }
});

/* =======================
   CONTENT API
======================= */

const jsonParser = express.json({
    limit: '50mb',
    strict: false,
    type: () => true,
});

const getRequestPassword = (req) => {
    const header = req.get('x-admin-password');
    const auth = req.get('authorization') || '';

    if (header) return header;
    if (auth.startsWith('Bearer ')) return auth.slice(7);

    return '';
};

const isAuthorized = (req) =>
    getRequestPassword(req) === adminPassword;

const requireAdmin = (req, res, next) => {
    if (!isAuthorized(req)) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    next();
};

const asyncHandler =
    (fn) =>
        (req, res, next) =>
            Promise.resolve(fn(req, res, next)).catch(next);

const readContent = async () => {
    try {
        const raw = await fs.readFile(contentFile, 'utf8');
        return JSON.parse(raw);
    } catch (e) {
        if (e.code === 'ENOENT') return {};
        throw e;
    }
};

const writeContent = async (data) => {
    await fs.mkdir(path.dirname(contentFile), { recursive: true });

    const tmp = `${contentFile}.tmp`;

    await fs.writeFile(tmp, JSON.stringify(data, null, 2), 'utf8');
    await fs.rename(tmp, contentFile);
};

const removeContent = async () => {
    await fs.rm(contentFile, { force: true });
};

app.get('/content', asyncHandler(async (req, res) => {
    res.json(await readContent());
}));

app.put(
    '/content',
    requireAdmin,
    jsonParser,
    asyncHandler(async (req, res) => {
        await writeContent(req.body);
        res.json({ ok: true });
    })
);

app.delete(
    '/content',
    requireAdmin,
    asyncHandler(async (req, res) => {
        await removeContent();
        res.json({ ok: true });
    })
);

app.post('/auth', requireAdmin, (req, res) => {
    res.json({ ok: true });
});

app.get('/health', (req, res) => {
    res.json({ ok: true });
});

/* =======================
   REACT (IMPORTANT: LAST)
======================= */

app.get('*', (req, res) => {
    res.sendFile(
        path.join(process.cwd(), 'public', 'index.html')
    );
});

/* =======================
   ERROR HANDLER
======================= */

app.use((err, req, res, next) => {
    console.error(err);

    if (res.headersSent) {
        return next(err);
    }

    const status =
        err?.type === 'entity.too.large'
            ? 413
            : err?.status || err?.statusCode || 500;

    res.status(status).json({
        error: err instanceof Error ? err.message : 'Server error',
    });
});

/* =======================
   START SERVER
======================= */

app.listen(PORT, HOST, () => {
    console.log(`Server running on http://${HOST || 'localhost'}:${PORT}`);
});



// import express from 'express';
// import cors from 'cors';
// import emailService from "./script/email.service.js";
// import * as process from "node:process";
// import * as path from "node:path";
//
// const app = express();
//
// app.use(express.json());
// app.use(express.urlencoded({extended: true}));
// app.use(cors({ origin: /https:\/\/(\w+\.)?topdental\.te\.ua$/ }));
//
// const email = 'topdentalternopil@gmail.com';
// const PORT = process.env.PORT || 3001;
// const HOST = process.env.HOST || '';
//
// app.use(express.static('public'));
//
// app.get('*', (req, res) => {
//     res.sendFile(path.join(process.cwd(), 'public', 'index.html'));
// });
//
// app.post('/users/first_form', async (req, res) => {
//     const {name, phoneNumber, comment} = req.body;
//     const commentField = comment ? comment : 'немає';
//     try {
//         await emailService.sendMail(email, 'welcome', {
//             name,
//             phoneNumber,
//             comment: commentField
//         });
//         res.json({message: 'Дякую! Ми Вам перетелефонуємо.'});
//     } catch (e) {
//         console.error(e);
//         res.status(500).json({message: 'Error sending message!'});
//     }
// });
//
// app.post('/users/second_form', async (req, res) => {
//     const {name, phoneNumber, date} = req.body;
//     try {
//         await emailService.sendMail(email, 'welcome', {name, phoneNumber, date});
//         res.json({message: 'Дякую! Ми Вам перетелефонуємо.'});
//     } catch (e) {
//         console.error(e);
//         res.status(500).json({message: 'Error sending message!'});
//     }
// });
//
//
//
//
//
// app.use((err, req, res) => {
//     console.error(err);
//     err.res.json({
//         message: 'Internal Server Error',
//         status: 500,
//     });
// });
//
// app.listen(PORT, HOST, () => {
//     console.log(`Server started on ${HOST}:${PORT}`);
// });
