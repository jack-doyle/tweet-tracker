"use strict";

export const inputsContainer = document.querySelector("#inputs");
export const tweetsContainer = document.querySelector("#tweets");
export const saveBtn = document.querySelector("#change-hashtags");
export const tracking = document.querySelector("#tracking");
export const currentlyTracking = document.querySelector("#current");

export function getInputs() {
    return document.querySelectorAll("input");
};

export function presentTweet(tweet) {
    const el = tweetsContainer.insertBefore(tweet, tweetsContainer.childNodes[0]);
    el.classList.add("animate");
};

export function makeTweet(tweet) {
    const inner = `
        <a href="http://twitter.com/${tweet.username}/status/${tweet.id}">
            <span>${tweet.user} (@${tweet.username})</span>
            <p>${tweet.text}</p>
        </a>
    `;
    const tweetDiv = document.createElement("div");
    tweetDiv.innerHTML = inner;
    tweetDiv.classList.add("tweet");
    return tweetDiv;
};

export function updateCurrent(keyword) {
    tracking.style.display = "initial";
    current.innerHTML = keyword;
}