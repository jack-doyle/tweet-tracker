const request = require('request')
    , split = require('split')
    , Writable = require('stream').Writable
    , util = require('util');

const Twitter = require('node-tweet-stream');

Twitter.prototype.connectGet = function (url) {
    this.stale = false;

    if (this.stream) return;

    this.stream = request.get({
        url,
        oauth: this.oauth
    });

    this.once('error', function (err) {
        console.log('Encountered an unrecoverable error, the stream is abort.')
        console.log('  Reason: [', err.code, ']', err.explain.long)
        console.log('  Please refer to https://dev.twitter.com/streaming/overview/connecting to debug your request parameters.')
    })

    this.stream.on('response', (function (res) {
        var self = this
        // Rate limited or temporarily unavailable
        if (res.statusCode === 420 || res.statusCode === 503) {
            var backoff = res.statusCode === 420 ? this.rateBackoff() : this.httpBackoff();
            this.abort()
            setTimeout(function () {
                self.connect()
            }, backoff)

            this.emit('reconnect', {
                type: this.errorExplanation[res.statusCode].type,
                explain: this.errorExplanation[res.statusCode]
            })
            return
        }

        // Http error
        if (res.statusCode > 200) {
            this.abort()

            this.emit('error', {
                type: 'http',
                err: new Error('Twitter connection error ' + res.statusCode),
                code: res.statusCode,
                explain: this.errorExplanation[res.statusCode]
            })
            return
        }

        // 200. Alive and well.
        this.backoffs()

        this.emit('connect')

        this.parser = split(null, function (d) {
            try {
                return JSON.parse(d)
            } catch (e) { }
        })

        this.parser = res.pipe(this.parser, { end: false })
        this.parser.pipe(this, { end: false })

        // Handle this: https://dev.twitter.com/docs/streaming-apis/connecting#Stalls
        // Abort the connection and reconnect if we haven't received an update for 90 seconds
        var close = (function () {
            this.abort()
            process.nextTick(this.connect.bind(this))
            this.emit('reconnect', { type: 'stall' })
        }).bind(this)

        this.timeout = setTimeout(close, this.timeoutInterval)

        res.on('data', function () {
            clearTimeout(self.timeout)
            self.timeout = setTimeout(close, self.timeoutInterval)
        })
    }).bind(this))

    this.stream.on('error', (function (err) {
        var self = this
        this.abort()
        this.emit('reconnect', { type: 'network', err: err })
        setTimeout(function () {
            self.connect()
        }, this.networkBackoff())
    }).bind(this))
};

Twitter.prototype.sample = function () {
    this.connectGet("https://stream.twitter.com/1.1/statuses/sample.json");
};

module.exports = new Twitter({
    consumer_key: process.env.TWITTER_API_KEY,
    consumer_secret: process.env.TWITTER_API_SECRET,
    token: process.env.TWITTER_ACCESS_TOKEN,
    token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});