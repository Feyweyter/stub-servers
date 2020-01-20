const faker = require('faker');
const moment = require('moment');
const CONSTS = require('./consts');
const data = require('./data.json');

faker.locale = "ru";

module.exports = () => {
    data.operations = [];

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
                paymentDesc: faker.lorem.sentence()
            });
        }
        data.operations.push({date, currency: '810', documents});
    }
    return data;
};

// Не смогли добавить меняющийся номер счета, этот вариант не подходит!
