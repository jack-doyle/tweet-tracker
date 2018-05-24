export class TweetMarker extends L.Marker {
    constructor(latLng, opts, map) {
        super(latLng, opts);

        this.map = map;
        this.opacity = 1;
        this.opacityInterval = window.setInterval(this.decrementOpacity.bind(this), 100);
    }

    decrementOpacity() {
        if (this.opacity <= 0) {
            this.removeFrom(this.map);
            window.clearInterval(this.opacityInterval);
            return;
        }

        if (this.opacity < 0.5) {
            this.setIcon(L.divIcon({ className: 'tweet-marker old' }));
        }

        this.opacity -= 0.01;
        this.setOpacity(this.opacity);
    }
}