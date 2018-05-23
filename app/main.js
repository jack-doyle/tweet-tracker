"use strict";

import { Observable } from 'rxjs/Observable';
import { events, createObservables } from "./events";
import { inputsContainer, tweetsContainer, getInputs, makeTweet, presentTweet, updateCurrent } from "./dom";
import { formatTweet } from "./helpers";
import { combineLatest } from 'rxjs/observable/combineLatest';
import { Subject } from 'rxjs';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/observable/fromEventPattern';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/distinct';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/withLatestFrom';

const socket = io.connect("http://localhost:3000");

const input$ = Array.from(getInputs())
    .map(input => Observable.fromEvent(input, events.ui.INPUT));

const keywords$ = combineLatest(input$)
    .map(events => events.map(e => e.target.value));

const updateTracking = keywords => socket.emit(events.server.UPDATE_TRACKING, keywords);

const { tweet$, error$, warning$, connect$, reconnect$, disconnect$, saveBtn$ } = createObservables(socket);

tweet$
    .debounceTime(500)
    .map(formatTweet)
    .distinct(tweet => tweet.retweeted_status ? tweet.retweeted_status.id_str : undefined)
    .subscribe(tweet => presentTweet(makeTweet(tweet)));

saveBtn$
    .withLatestFrom(keywords$)
    .map(([_, keywords]) => keywords)
    .subscribe(keywords => {
        updateTracking(keywords);
        updateCurrent(keywords);
    });