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
        listSize = faker.random.number({min: CONSTS.MIN_OPERATIONS_AMOUNT,
            max: CONSTS.MAX_OPERATIONS_AMOUNT});
        documents = [];
        for (let j = 0; j < listSize; j++) {
            documents.push({
                documentId: faker.random.uuid(),
                documentNum: faker.random.number(),
                amount: (!faker.random.boolean() ? '-' : '') +
                    faker.random.number({precision: 0.01, min: 1, max: 100000}),
                paymentDesc: faker.lorem.sentence(),
                accountNumber //Добавим требуемый accountNumber
            });
        }
        operations.push({date, currency: '810', documents});
    }
    return operations;
};

const getChat = (chatId) => {
	let messages = [];
	let num = 0;
	while (true) {
		messages.push({
			messageId: faker.random.uuid(),
			chatId,
			userIdFrom: faker.random.number(),
			text: faker.lorem.sentence(),
			deleted: faker.random.boolean(),
			date: moment().format('YYYY-MM-DD hh:mm:ss')
		});
		if (num === 20) {
			break;
		}
		++num;
	}
	return messages;
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

// Добавить кастомные пути в роутер (/operations?accountNumber={number})
server.get('/operations', (req, res) => {
	console.log(req.query);
    res.jsonp(getOperations(req.query.accountNumber))
});

// Добавить кастомные пути в роутер (/operations)
server.get('/chat', (req, res) => {
	console.log(req.query);
    res.jsonp(getChat(req.query.id))
});

server.use((req, res, next) => {
    if (isAuthorized(req)) { // Добавить свою логику авторизации
        next() // Продолжаем
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
    const userId = req.body['senderId'];
    // Проверим, передан ли senderId
    if (userId) {
        req.body.createdAt = moment().format();
    } else {
        // Проставить свой статус код ответа
        res.status(400).jsonp({
            error: "No valid senderId"
        });
    }
    next();
});



// Use default router
server.use(router);
server.listen(3000, () => {
    console.log('JSON Server is running')
});
