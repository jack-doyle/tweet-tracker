const whitelist = new Set([
    "MAPBOX_ACCESS_TOKEN"
]);

module.exports = (app) => {
    app.get("/env", (req, res) => {
        res.send(Object.keys(process.env)
            .filter(k => whitelist.has(k))
            .reduce((a, k) => (a[k] = process.env[k], a), {})
        );
    });
};