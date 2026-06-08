// Карта
const map = L.map('map').setView(
    [55.765, 37.605],
    14
);

// Подложка
L.tileLayer(
    'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
    {
        attribution: '&copy; OpenStreetMap'
    }
).addTo(map);

// ОКН
fetch('36.geojson')
    .then(response => response.json())
    .then(data => {

        const heritageLayer = L.geoJSON(data, {

            onEachFeature: function(feature, layer) {

                const p = feature.properties;

                layer.bindPopup(`
                <div style="
                    width:350px;
                    font-family:Segoe UI, Arial, sans-serif;
                ">

                    <h3 style="
                        margin:0 0 10px 0;
                        color:#2c3e50;
                    ">
                        ${p.Name || ''}
                    </h3>

                    <div style="
                        color:#666;
                        font-size:12px;
                        margin-bottom:10px;
                    ">
                        📍 ${p.Addresses || ''}
                    </div>

                    <div style="margin-bottom:10px;">

                        <span style="
                            background:#e3f2fd;
                            color:#1565c0;
                            padding:4px 10px;
                            border-radius:20px;
                            font-size:11px;
                            font-weight:600;
                        ">
                            ${p.Type || ''}
                        </span>

                    </div>

                    <div style="margin-bottom:10px;">

                        <span style="
                            background:#f3e5f5;
                            color:#7b1fa2;
                            padding:4px 10px;
                            border-radius:20px;
                            font-size:11px;
                            font-weight:600;
                        ">
                            ${p.Subtype || ''}
                        </span>

                    </div>

                    <div style="margin-bottom:10px;">

                        <span style="
                            background:#e8f5e9;
                            color:#2e7d32;
                            padding:4px 10px;
                            border-radius:20px;
                            font-size:11px;
                            font-weight:600;
                        ">
                            ${p.Subsubtype || ''}
                        </span>

                    </div>

                    <div style="
                        background:#fafafa;
                        border-left:4px solid #1565c0;
                        padding:8px;
                        font-size:12px;
                    ">
                        <b>Подробнее:</b><br>
                        ${p.Full_Name || ''}
                    </div>

                </div>
                `);

            }

        });

        heritageLayer.addTo(map);

        map.fitBounds(
            heritageLayer.getBounds()
        );

    })
    .catch(error => {
        console.error(error);
    });

// =======================
// ВЕЛОПАРКОВКИ
// =======================

fetch('bike_parking.geojson')
    .then(response => response.json())
    .then(data => {
        
         const bikeParking = L.geoJSON(data, {

            pointToLayer: function(feature, latlng) {

                return L.circleMarker(latlng, {
                    radius: 5,
                    color: '#2e7d32',
                    fillColor: '#4caf50',
                    fillOpacity: 0.9,
                    weight: 1
                });

            }

        });

        bikeParking.addTo(map);

    })
    .catch(error => {
        console.error('Ошибка велопарковок:', error);
    });

// =======================
// ВЕЛОМАРШРУТЫ
// =======================

fetch('bike_routes.geojson')
    .then(response => response.json())
    .then(data => {

        const bikeRoutes = L.geoJSON(data, {

            style: {
                color: '#1976d2',
                weight: 4,
                opacity: 0.9
            }

        });

        bikeRoutes.addTo(map);

    })
    .catch(error => {
        console.error('Ошибка веломаршрутов:', error);
    });

// =======================
// ОСТАНОВКИ ОБЩЕСТВЕННОГО ТРАНСПОРТА
// =======================

fetch('stops.geojson')
    .then(response => response.json())
    .then(data => {

        const stopsLayer = L.geoJSON(data, {

            style: {
                color: '#f57c00'
            },

            pointToLayer: function(feature, latlng) {

                return L.circleMarker(latlng, {
                    radius: 6,
                    color: '#f57c00',
                    fillColor: '#ff9800',
                    fillOpacity: 0.9,
                    weight: 1
                });

            },

            onEachFeature: function(feature, layer) {

                const p = feature.properties;

                layer.bindPopup(`
                    <div style="font-family:Segoe UI, Arial, sans-serif;">
                        <b>${p.Name || 'Остановка'}</b>
                    </div>
                `);

            }

        });

        stopsLayer.addTo(map);

    })
    .catch(error => {
        console.error('Ошибка остановок:', error);
    });


