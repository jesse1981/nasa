importScripts('general-geo-utils.js');

// Tile Data Holder
var tileData = {};
var tileDataNDWI = {};

var colorHash = {
    low: [215, 25, 28],
    mid: [255, 255, 191],
    high: [26, 150, 65]
}

var color_filter;

//Listen for events

self.addEventListener('message', function (e) {
    // obect to hold various methods based on message to worker
    var edgeFind = {
        // If tile data was sent, add to data object
        tiledata: function (inTile) {
            var dataArray = new Float32Array(65536);
            for (var i = 0; i < inTile.array.length / 4; i++) {
                var height = -10000 + ((inTile.array[i * 4] * 256 * 256 + inTile.array[i * 4 + 1] * 256 + inTile.array[i * 4 + 2]) * 0.1);

                if (height > 500) {
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