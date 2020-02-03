const externalHost = 'http://randomuser.ru/api.json';
const url = '/users';

//Метод для создания списка пользователей с использованием fakerJS
const generateUsers = (amount = 5) => {
    const users = [];
    while(amount > 0) {
        users.push({
            id: faker.random.uuid(),
            fullName: faker.name.findName(),
            email: faker.internet.email(),
            country: faker.address.country(),
            phoneNumber: faker.phone.phoneNumber()
        });
        --amount;
    }
    return users;
};

const fakeServerWrapper = {
    init: function() {
        faker.locale = "ru"; //Устанавливаем локаль

        this.fs = sinon.createFakeServer({autoRespond: true});
        this.fs.xhr.useFilters = true;

        // Если фильтр возвратит true, запрос не будет сэмулирован, а пойдет на настоящий сервер
        this.fs.xhr.addFilter(
            function(method, url, async, username, password) {
                return (new RegExp(externalHost)).test(url);
        });

        this.fs.respondWith("GET", url,
            (xhr) => {
                const users = generateUsers(3);
                xhr.respond(200, //Устанавливаем любой статус код ответа
                    { "Content-Type": "application/json" }, JSON.stringify(users));
            });

        this.fs.respondWith("GET", /\/users\/(\d+)/,
            (xhr, id) => {
                const users = generateUsers(1);
                xhr.respond(200, //Устанавливаем любой статус код ответа
                    { "Content-Type": "application/json" },
                    JSON.stringify({...users[0], id})); //Заменяем id на полученный
            });
    },

    restore: function() {
        this.fs.restore();
    }
};



$(document).ready(function() {
    const callButton = $('#call');
    const fsCheckbox = $('#fsOn');
    fsCheckbox.change(function() {
        if (fsCheckbox.is(':checked')) {
            fakeServerWrapper.init();
        } else {
            fakeServerWrapper.restore();
        }
    });

    //Обрабатываем нажатие на кнопку
    callButton.click(function() {
        $.ajax({
            url //url: url + "/2" чтобы получить пользователя по id
        }).done(function(value) {
            console.info(value);
        }).fail(function(value) {
            console.error(value);
        });
    });
});
