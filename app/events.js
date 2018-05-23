"use strict";

import { Observable } from 'rxjs/Observable';
import { saveBtn } from "./dom";

export const events = {
    server: {
        TWEET: "tweet",
        ERROR: "error",
        WARNING: "warning",
        CONNECT: "connect",
        RECONNECT: "reconnect",
        DISCONNECT: "disconnect",
        UPDATE_TRACKING: "updateTracking"
    },
    ui: {
        INPUT: "input",
        CLICK: "click"
    }
};

const onSocketEvent = (event, socket) => Observable.fromEventPattern(payload => socket.on(event, payload));

export function createObservables(socket) {
    const [
        tweet$,
        error$,
        warning$,
        connect$,
        reconnect$,
        disconnect$] = Object.values(events.server).map(e => onSocketEvent(e, socket));

    const saveBtn$ = Observable.fromEvent(saveBtn, events.ui.CLICK);

    return { tweet$, error$, warning$, connect$, reconnect$, disconnect$, saveBtn$ };
}