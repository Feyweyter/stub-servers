const faker = require('faker');

const generateUsers = (amount = 5) => {
    const users = [];
    for(let i = 0; i < amount; i++) {
        users.push({
            id: (i + 1),
            fullName: faker.name.findName(),
            email: faker.internet.email(),
            phoneNumber: faker.phone.phoneNumber()
        });
    }
    return users;
};

const users = generateUsers(6);

const isAuthorized = () => {
  return true;
};

class Users {
    middleware () {
        const router = require('koa-route');
        return [
            router.get('/users', function (ctx) {
                if (isAuthorized()) {
                    ctx.response.type = 'json';
                    ctx.response.body = users;
                } else {
                    ctx.response.status = 401;
                }
            }),
            router.put('/users', function (ctx) {
                ctx.response.status = 405;
            }),
            router.delete('/users', function (ctx) {
                ctx.response.status = 405;
            }),
            router.post('/users', function (ctx) {
                const newUser = ctx.request.body;
                users.push(newUser);
                newUser.id = users.length;
                ctx.response.status = 201;
                ctx.response.set('Location', `/users/${newUser.id}`);
            }),
            router.put('/users', function (ctx) {
                ctx.response.status = 405;
            }),
            router.delete('/users', function (ctx) {
                ctx.response.status = 405;
            }),
            router.get('/users/:id', function (ctx, id) {
                ctx.response.type = 'json';
                ctx.response.body = users.find(user => user.id === Number(id));
            }),
            router.put('/users/:id', function (ctx, id) {
                const existingUserIndex = users.findIndex(user => user.id === Number(id));
                const existingUser = users.find(user => user.id === Number(id));
                const updatedUser = Object.assign({}, existingUser, ctx.request.body);
                users.splice(existingUserIndex, 1, updatedUser);
                ctx.response.status = 204
            }),
            router.delete('/users/:id', function (ctx, id) {
                const existingUserIndex = users.findIndex(user => user.id === Number(id));
                users.splice(existingUserIndex, 1);
                ctx.response.status = 204
            }),
            router.post('/users/:id', function (ctx) {
                ctx.response.status = 405;
            })
        ]
    }
}

module.exports = Users;
