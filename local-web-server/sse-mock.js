const faker = require('faker');

const getNotification = (id = 0) => (
    {
        id,
        text: `${faker.commerce.product()} was added, color: ${faker.commerce.color()}`
    }
);

module.exports = MockBase => class SSE extends MockBase {
  mocks () {
    let i = 0;
    return   [
      {
            route: '/notifications',
            responses: [
                {
                    response: async function (ctx) {
                        ctx.body = new require('stream').PassThrough();
                        ctx.type = 'text/event-stream';
                        ctx.set('Cache-Control', 'no-cache');
                        ctx.set('Connection', 'keep-alive');

                        const interval = setInterval(() => {
                            ++i;
                            ctx.body.write(`event: message\n`);
                            ctx.body.write(`data: ${JSON.stringify(getNotification(i))}\n\n`)
                        }, 3000);

                        function finished () {
                            clearInterval(interval);
                            ctx.body.end();
                        }

                        ctx.req.on('close', finished);
                        ctx.req.on('finish', finished);
                        ctx.req.on('error', finished);
                    }
                }
            ]
        },
        {
            route: '/alerts',
            responses: [
                {
                    response: async function (ctx) {
                        ctx.body = new require('stream').PassThrough();
                        ctx.type = 'text/event-stream';
                        ctx.set('Cache-Control', 'no-cache');
                        ctx.set('Connection', 'keep-alive');
                        const timeout = setTimeout(() => {
                            ctx.body.write(`event: message\n`);
                            ctx.body.write(`data: ${JSON.stringify({text: i, id: 45})}\n\n`);
                        }, 3000);
                        function finished () {
                          clearTimeout(timeout);
                            ctx.body.end();
                        }

                        ctx.req.on('close', finished);
                        ctx.req.on('finish', finished);
                        ctx.req.on('error', finished);
                    }
                }
            ]
        }
    ]
  }
};
