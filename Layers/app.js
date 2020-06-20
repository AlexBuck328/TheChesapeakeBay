var map;

map = L.map('map', {
    center: [0, 0],
    crs: L.CRS.Simple,
    zoom: 0
});

var iconLayers = [];
var showImages = [1, 5, 6, 7];

// https://purl.stanford.edu/zf275jj8939/iiif/manifest.json

// https://collections.leventhalmap.org/search/commonwealth:0r96fk80z/manifest.json

// Grab images from a IIIF Manifest
$.getJSON('https://purl.stanford.edu/zf275jj8939/iiif/manifest.json', function (data) {
    $.each(data.sequences[0].canvases, function (i, value) {

        // Only show certain images
        if (showImages.indexOf(i + 1) === -1) {
            return true;
        }

        var tileLayer = L.tileLayer.iiif(
            value.images[0].resource['@id'].replace('full/full/0/default.jpg', 'info.json'), {
                fitBounds: false,
                attribution: data.attribution
            });
console.log(tileLayer)

        iconLayers.push({
            title: value.label,
            layer: tileLayer,
            icon: value.images[0].resource['@id'].replace(
                'full/full/0/default.jpg',
                'full/1024,/0/default.jpg'
            )
        });
    });

    var iconLayersControl = new L.Control.IconLayers(
        iconLayers, {
            position: 'topright'
        });

    iconLayersControl.addTo(map);

    // Only fit the bounds of the layer on first load
    var firstTime = true;
    iconLayers[0].layer.on('tileload', function () {
        if (firstTime) {
            this._fitBounds();
            firstTime = false;
        }
    });
});
