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

            onEachFeature: function(feature, layer) {

                const p = feature.properties;

                layer.bindPopup(`
                    <div>
                        <h3>${p.Name}</h3>
                        <p><b>Категория:</b> ${p.Subtype}</p>
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
