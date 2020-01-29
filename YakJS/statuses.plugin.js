'use strict';

/* eslint-disable no-empty-function, no-unused-vars */

const STATUSES_ARRAY = ['success', 'fail', 'waiting'];

const getRandomInt = (max) => {
  return Math.floor(Math.random() * Math.floor(max));
};

const getRandomStatus = () => {
   return STATUSES_ARRAY[getRandomInt(STATUSES_ARRAY.length)]; 
};

/**
 * @constructor
 * @struct
 * @see {!PluginWorker}
 */
function DocumentsStatuses(context) {
    /**
     * @param {WebSocketMessage} message
     * @param {WebSocketConnection} connection
     */
    this.onJsonMessage = (message, connection) => {
        const list = message.data;
        const statuses = [];
        list.forEach(item => {
            statuses.push({
                id: item,
                status: getRandomStatus()
            });
        });
        
        // Можно добавить таймаут
        setTimeout(() =>
        	connection.send(statuses), 5000);
    };

    /**
     * @param {!InstanceStartedEvent} event
     */
    this.onInstanceStarted = event => {
        // Create a route for http://localhost:<PORT>/echo
        event.app.get('/echo', (request, response) => {
            response.send('Hello from the echo plugin!');
        });
    };
}

/**
 * @type {!Plugin}
 */
module.exports = {
    name: 'statuses',
    description: 'Get documents statuses',
    createWorker: (context) => new DocumentsStatuses(context)
};
