// from https://gist.github.com/jhubley/099627b8f640deba200973bcd3cecc74

function createFloodMapBox() {

    // used to be imagedata.js
    function imageDataWorker() {
        //Listen for events
        self.addEventListener('message', function (e) {
            // Tile Data Holder
            var tileData = {};
            var color_filter;

            // obect to hold various methods based on message to worker
            var edgeFind = {
                // If tile data was sent, add to data object
                tiledata: function (inTile) {
                    var dataArray = new Float32Array(65536);
                    for (var i = 0; i < inTile.array.length / 4; i++) {
                        var height = -10000 + ((inTile.array[i * 4] * 256 * 256 + inTile.array[i * 4 + 1] * 256 + inTile.array[i * 4 + 2]) * 0.1);

                        if (height > inTile.heightLevel) {
                            alphaMultiplier = 0; //(- ((height / 14.7) - 255)) - 20;
                        } else {
                            alphaMultiplier = 255;
                        }

                        inTile.array[i * 4] = 66;
                        inTile.array[i * 4 + 1] = 134;
                        inTile.array[i * 4 + 2] = 244;
                        inTile.array[i * 4 + 3] = alphaMultiplier;

                        dataArray[i] = height;
                    }
                    self.postMessage({
                        'data': {
                            'tileUID': inTile.tileUID,
                            'array': inTile.array
                        },
                        'type': 'tiledata'
                    },
                        [inTile.array.buffer]
                    );
                    delete inTile.array;
                    tileData[inTile.tileUID] = dataArray;
                },

                // If a tile unload event was sent, delete the corresponding data
                tileunload: function (tileUnloadID) {
                    delete tileData[tileUnloadID];
                },

                setfilter: function (elev) {
                    color_filter = elev;
                }
            }
            // Call function based on message, send data.
            edgeFind[e.data.type](e.data.data);


        }, false);

    }

    let config = {
        heightLevel: 50,
    };

    let elevTiles;

    function setConfig(key, value) {
        if (key in config) {
            config[key] = value;
        }
    }

    function update() {
        if (elevTiles) {
            elevTiles.redraw();
        }
    }

    function updateHeight(height) {
        setConfig('heightLevel', height);
        update();
    }

    function _init() {
        var tileSize,
            everyOther = true,
            drawElev = false;

        L.mapbox.accessToken = 'pk.eyJ1IjoibWF0dCIsImEiOiJTUHZkajU0In0.oB-OGTMFtpkga8vC48HjIg';

        var map = L.map('map_canvas', {
            worldCopyJump: true,
            doubleClickZoom: false,
            center: [-27.4698, 153.0251],
            zoom: 15,
        });

        //var hash = L.hash(map);

        // L.mapbox.tileLayer('').addTo(map);
        L.mapbox.tileLayer('mapbox.streets').addTo(map);

        elevTiles = new L.TileLayer.Canvas({
            unloadInvisibleTiles: true,
            attribution: '<a href="http://www.mapbox.com/about/maps/" target="_blank">Terms &amp; Feedback</a>'
        });

        elevTiles.on('tileunload', function (e) {
            //Send tile unload data to elevWorker to delete un-needed pixel data
            elevWorker.postMessage({ 'data': e.tile._tilePoint.id, 'type': 'tileunload' });
        });

        function setupWebWorker() {
            var code = imageDataWorker.toString();
            code = code.substring(code.indexOf("{") + 1, code.lastIndexOf("}"));

            var blob = new Blob([code], { type: "application/javascript" });
            return new Worker(URL.createObjectURL(blob));
        }

        var elevWorker = setupWebWorker();
        var tileContextsElev = {};

        var locs = location.search.split('?');

        if (locs.length > 1) {
            locs = locs[1].split('=');
        } else {
            locs = ['no']
        }

        if (locs[0] == 'elev') {
            elev_filter = parseInt(locs[1]);
        } else {
            elev_filter = 10;
        }

        elevWorker.postMessage({
            data: elev_filter,
            type: 'setfilter'
        });

        elevTiles.drawTile = function (canvas, tile, zoom) {
            tileSize = this.options.tileSize;

            var context = canvas.getContext('2d'),
                imageObj = new Image(),
                tileUID = '' + zoom + '/' + tile.x + '/' + tile.y;

            var drawContext = canvas.getContext('2d');

            // To access / delete elevTiles later
            tile.id = tileUID;

            tileContextsElev[tileUID] = drawContext;

            imageObj.onload = function () {
                // Draw Image Tile
                context.drawImage(imageObj, 0, 0);

                // Get Image Data
                var imageData = context.getImageData(0, 0, tileSize, tileSize);

                elevWorker.postMessage({
                    data: {
                        tileUID: tileUID,
                        tileSize: tileSize,
                        array: imageData.data,
                        drawElev: drawElev,
                        heightLevel: config.heightLevel,
                    },
                    type: 'tiledata'
                },
                    [imageData.data.buffer]);
            };

            // Source of image tile
            imageObj.crossOrigin = 'Anonymous';
            imageObj.src = 'https://a.tiles.mapbox.com/v4/mapbox.terrain-rgb/' + zoom + '/' + tile.x + '/' + tile.y + '.pngraw?access_token=pk.eyJ1IjoibWF0dCIsImEiOiJTUHZkajU0In0.oB-OGTMFtpkga8vC48HjIg';

        };

        elevWorker.addEventListener('message', function (response) {
            if (response.data.type === 'tiledata') {
                var dispData = tileContextsElev[response.data.data.tileUID].createImageData(tileSize, tileSize);
                dispData.data.set(response.data.data.array);
                tileContextsElev[response.data.data.tileUID].putImageData(dispData, 0, 0);
            }
        }, false);

        elevTiles.addTo(map);

        map.touchZoom.disable();
        map.doubleClickZoom.disable();

    }

    _init();
    return {
        setConfig,
        update,
        updateHeight
    };
}

var floodMapBox = createFloodMapBox();

// Not used
let createGeneralGeoUtils = function () {
    var offsetPoint = function (p1, a, d) {
        var brng = a * (Math.PI / 180.0);
        var R = 41807040;
        var lat1 = (Math.PI / 180.0) * p1.lat;
        var lon1 = (Math.PI / 180.0) * p1.lng;
        var lat2 = Math.asin(Math.sin(lat1) * Math.cos(d / R) +
            Math.cos(lat1) * Math.sin(d / R) * Math.cos(brng));
        var lon2 = lon1 + Math.atan2(Math.sin(brng) * Math.sin(d / R) * Math.cos(lat1),
            Math.cos(d / R) - Math.sin(lat1) * Math.sin(lat2));

        return { "lat": lat2 * (180.0 / Math.PI), "lng": lon2 * (180.0 / Math.PI) }
    }
    var bearingDegrees = function (p1, p2) {
        var dLon = (Math.PI / 180.0) * ((p2.lng - p1.lng));
        var lat1 = (Math.PI / 180.0) * p1.lat;
        var lat2 = (Math.PI / 180.0) * p2.lat;
        var y = Math.sin(dLon) * Math.cos(lat2);
        var x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);
        var brng = Math.atan2(y, x) * (180.0 / Math.PI);
        return brng;
    }
    var bearingRadians = function (p1, p2) {
        var dLon = (Math.PI / 180.0) * ((p2.lng - p1.lng));
        var lat1 = (Math.PI / 180.0) * p1.lat;
        var lat2 = (Math.PI / 180.0) * p2.lat;
        var y = Math.sin(dLon) * Math.cos(lat2);
        var x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);
        var brng = Math.atan2(y, x);
        return brng;
    }
    var latLng2tile = function (lat, lon, zoom) {
        var eLng = (lon + 180) / 360 * Math.pow(2, zoom);
        var eLat = (1 - Math.log(Math.tan(lat * Math.PI / 180) + 1 / Math.cos(lat * Math.PI / 180)) / Math.PI) / 2 * Math.pow(2, zoom);
        //x coord in image tile of lat/lng
        var xInd = Math.round((eLng - Math.floor(eLng)) * 256);
        //y coord in image tile of lat/lng
        var yInd = Math.round((eLat - Math.floor(eLat)) * 256);
        //flattened index for clamped array in imagedata
        var fInd = yInd * 256 + xInd;
        //for calling tile from array
        var eLng = Math.floor(eLng);
        var eLat = Math.floor(eLat);
        return { "tileCall": "" + zoom + "/" + eLng + "/" + eLat, "tileX": eLng, "tileY": eLat, "pX": xInd, "pY": yInd, "arrInd": fInd }
    }
    function haverDistance(p1, p2) {
        var R = 41807040;
        var dLat = (Math.PI / 180.0) * ((p2.lat - p1.lat));
        var dLon = (Math.PI / 180.0) * ((p2.lng - p1.lng));
        var lat1 = (Math.PI / 180.0) * p1.lat,
            lat2 = (Math.PI / 180.0) * p2.lat;
        var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = R * c;
        return d;
    }
    function roundTo(num) {
        return +(Math.round(num + "e+2") + "e-2");
    }

    return {
        offsetPoint,
        bearingDegrees,
        bearingRadians,
        latLng2tile,
        haverDistance,
        roundTo
    }
}

var generalGeoUtils = createGeneralGeoUtils();