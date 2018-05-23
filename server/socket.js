"use strict";

const _ = require("lodash");
const fs = require("fs");
const twitter = require("./config/twitter");

const tweets = [];

const events = {
    IO_CONNECTION: "connection",
    TWEET: "tweet",
    ERROR: "error",
    WARNING: "warning",
    CONNECT: "connect",
    RECONNECT: "reconnect",
    DISCONNECT: "disconnect",
    UPDATE_TRACKING: "updateTracking"
};

const emit = (client, event) => (socket) => client.on(event, payload => socket.emit(event, payload));
const registerListeners = (client, events) => events.map(event => emit(client, event));

const listeners = registerListeners(twitter, _.values(events));

const updateTracking = (client, keywords) => {
    client.untrackAll();
    client.trackMultiple(keywords);
};

module.exports = io => {
    io.on(events.IO_CONNECTION, socket => {
        listeners.forEach(listen => listen(socket));

        socket.on(events.UPDATE_TRACKING, keywords => updateTracking(twitter, keywords));
    });
};