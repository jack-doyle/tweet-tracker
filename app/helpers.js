export function formatTweet(tweet) {
    return {
        id: tweet.id_str,
        timestamp: tweet.created_at,
        text: tweet.text,
        user: tweet.user.name,
        username: tweet.user.screen_name,
        retweeted_status: tweet.retweeted_status,
        retweet_count: tweet.retweet_count,
        favorite_count: tweet.favorite_count
    };
};