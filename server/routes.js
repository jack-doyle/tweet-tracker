const whitelist = new Set([
    "APP_URL"
]);

module.exports = (app) => {
    app.get("/env", (req, res) => {
        res.send(Object.keys(process.env)
            .filter(k => whitelist.has(k))
            .reduce((a, k) => (a[k] = process.env[k], a), {})
        );
    });
};