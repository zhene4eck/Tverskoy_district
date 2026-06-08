const map = L.map('map').setView(
    [55.765, 37.605],
    14
);

L.tileLayer(
    'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
    {
        attribution: '© OpenStreetMap'
    }
).addTo(map);

fetch('36.geojson')
    .then(response => response.json())
    .then(data => {

        const heritageLayer = L.geoJSON(data, {

            pointToLayer: function(feature, latlng) {
                return L.circleMarker(latlng, {
                    radius: 6,
                    weight: 1,
                    fillOpacity: 0.8
                });
            },

            onEachFeature: function(feature, layer) {

                const p = feature.properties;

                layer.bindPopup(`
                    <div style="max-width:300px;">
                        <h3>${p.Full_Name}</h3>
                        <p><b>Категория:</b> ${p.Subtype}</p>
                        <p><b>Вид:</b> ${p.Subsubtype}</p>
                        <p><b>Адрес:</b> ${p.Addresses}</p>
                    </div>
                `);

            }

        });

        heritageLayer.addTo(map);

        map.fitBounds(
            heritageLayer.getBounds()
        );

    });
