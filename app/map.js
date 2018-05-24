import { checkStatus, parseJSON } from "./util";

const center = [39.82, 0.46];
const defaultZoom = 2;

export const map = L.map('map').setView(center, defaultZoom);

fetch("/env")
    .then(checkStatus)
    .then(parseJSON)
    .then(data => initialiseMap(data.MAPBOX_ACCESS_TOKEN))
    .catch(console.log);

function initialiseMap(accessToken) {
    L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
        subdomains: 'abcd',
        id: 'cartodb.darkmatter'
    }).addTo(map);
};
