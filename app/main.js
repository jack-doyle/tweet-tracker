"use strict";

import { Tweet } from "./tweet";
import { TweetMarker } from "./tweet-marker";
import { Observable } from 'rxjs/Observable';
import { events, createObservables } from "./events";
import { inputsContainer, tweetsContainer, saveBtn, getInputs, makeTweet, presentTweet, updateCurrent } from "./dom";
import { formatTweet, getTweetLocation, hasLocation } from "./util";
import { combineLatest } from 'rxjs/observable/combineLatest';
import { Subject } from 'rxjs/Subject';
import { map } from "./map";
require("./operators");

const socket = io.connect("http://localhost:3000");
const updateTracking = keywords => socket.emit(events.server.UPDATE_TRACKING, keywords);

// UI event observables
const input$ = Array.from(getInputs()).map(input => Observable.fromEvent(input, events.ui.INPUT));
const saveBtn$ = Observable.fromEvent(saveBtn, events.ui.CLICK);

// Socket event observables
const { tweet$, error$, warning$, connect$, reconnect$, disconnect$ } = createObservables(socket);

// Search terms
const keywords$ = combineLatest(input$)
    .map(events => events.map(e => e.target.value));

// const tweetMarker = L.divIcon({ className: 'tweet-marker' });
// L.marker([53, 53], { icon: tweetMarker }).addTo(map);

const markers$ = new Subject();

tweet$
    .map(tweet => new Tweet(tweet))
    .filter(tweet => tweet.hasLocation())
    .subscribe(tweet => {
        const tweetIcon = L.divIcon({ className: 'tweet-marker' });
        const tweetMarker = new TweetMarker(tweet.coordinates, { icon: tweetIcon }).addTo(map);
        markers$.next(tweetMarker);
        presentTweet(makeTweet(tweet));
    });

saveBtn$
    .withLatestFrom(keywords$)
    .map(([_, keywords]) => keywords)
    .subscribe(keywords => {
        // updateTracking(keywords);
        // updateCurrent(keywords);
        socket.emit(events.server.SAMPLE);
    });