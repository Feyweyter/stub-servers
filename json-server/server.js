const jsonServer = require('json-server');
const faker = require('faker');
const moment = require('moment');
const CONSTS = require('./consts');

const server = jsonServer.create();
const router = jsonServer.router('data.json');
const middlewares = jsonServer.defaults();

const getOperations = (accountNumber) => {
    const operations = [];

    let listSize;
    let documents;
    for (let i = 0; i < CONSTS.DAYS_AMOUNT; i++) {
        let date = moment().subtract(i, 'days').format('YYYY-MM-DD');
        listSize = faker.random.number({min: CONSTS.MIN_OPERATIONS_AMOUNT, max: CONSTS.MAX_OPERATIONS_AMOUNT});
        documents = [];
        for (let j = 0; j < listSize; j++) {
            documents.push({
                documentId: faker.random.uuid(),
                documentNum: faker.random.number(),
                amount: (!faker.random.boolean() ? '-' : '') + faker.random.number({precision: 0.01, min: 1, max: 100000}),
                paymentDesc: faker.lorem.sentence(),
                accountNumber //Добавим требуемый accountNumber
            });
        }
        operations.push({date, currency: '810', documents});
    }
    return operations;
};

// Проверить авторизацию
const isAuthorized = (res) => {
   return true;
};

// Set default middlewares (logger, static, cors and no-cache)
server.use(middlewares);

// Добавить правила в роутер
server.use(jsonServer.rewriter({
    '/api/*': '/$1',
}));

// Добавить кастомные пути в роутер
server.get('/operations', (req, res) => {
    res.jsonp(getOperations(req.query.accountNumber))
});

server.use((req, res, next) => {
    if (isAuthorized(req)) { // add your authorization logic here
        next() // continue to JSON Server router
    } else {
        res.sendStatus(401);
    }
});

// To handle POST, PUT and PATCH you need to use a body-parser
// You can use the one used by JSON Server
server.use(jsonServer.bodyParser);

// Для получения изображения
server.post('/image', (req, res, next) => {
    res.sendStatus(200);
    next();
});

server.post('/messages', (req, res, next) => {
    let userId = req.body['senderId'];
    if (userId != null && userId >= 0) {
        req.body.createdAt = moment().format();
    } else {
        // Проставить свой статус код ответа
        res.status(400).jsonp({
            error: "No valid senderId"
        });
    }
    // Continue to JSON Server router
    next();
});



// Use default router
server.use(router);
server.listen(3000, () => {
    console.log('JSON Server is running')
});
