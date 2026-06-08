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

// =======================
// АДРЕСНЫЕ ТОЧКИ
// =======================

fetch('address_points.geojson')
    .then(response => response.json())
    .then(data => {

        const addressLayer = L.geoJSON(data, {

            pointToLayer: function(feature, latlng) {

                return L.circleMarker(latlng, {
                    radius: 3,
                    color: '#616161',
                    fillColor: '#9e9e9e',
                    fillOpacity: 0.8,
                    weight: 1
                });

            },

            onEachFeature: function(feature, layer) {

                const p = feature.properties;

                layer.bindPopup(`
                    <div style="font-family:Segoe UI, Arial, sans-serif;">
                        <b>Дом:</b><br>
                        ${p['addr:housenumber'] || ''}
                    </div>
                `);

            }

        });

        addressLayer.addTo(map);

    })
    .catch(error => {
        console.error('Ошибка адресных точек:', error);
    });

// =======================
// ДОРОГИ
// =======================

fetch('roads.geojson')
    .then(response => response.json())
    .then(data => {

        const roadsLayer = L.geoJSON(data, {

            style: function(feature) {

                const roadType = feature.properties.highway;

                switch (roadType) {

                    case 'primary':
                        return {
                            color: '#d32f2f',
                            weight: 4
                        };

                    case 'secondary':
                        return {
                            color: '#f57c00',
                            weight: 3
                        };

                    case 'tertiary':
                        return {
                            color: '#757575',
                            weight: 2
                        };

                    default:
                        return {
                            color: '#9e9e9e',
                            weight: 1
                        };
                }

            },

            onEachFeature: function(feature, layer) {

                const p = feature.properties;

                layer.bindPopup(`
                    <div style="font-family:Segoe UI;">
                        <b>${p.name || 'Без названия'}</b><br>
                        Тип: ${p.highway || ''}
                    </div>
                `);

            }

        });

        roadsLayer.addTo(map);

    })
    .catch(error => {
        console.error('Ошибка дорог:', error);
    });

// =======================
// ЗДАНИЯ
// =======================

fetch('buildings.geojson')
    .then(response => response.json())
    .then(data => {

        const buildingsLayer = L.geoJSON(data, {

            style: function(feature) {

                return {
                    color: '#757575',
                    weight: 0.5,
                    fillColor: '#d9d9d9',
                    fillOpacity: 0.5
                };

            },

            onEachFeature: function(feature, layer) {

                const p = feature.properties;

                layer.bindPopup(`
                    <div style="font-family:Segoe UI;">
                        <b>Здание</b><br>
                        Тип: ${p.building || 'не указан'}
                    </div>
                `);

            }

        });

        buildingsLayer.addTo(map);

    })
    .catch(error => {
        console.error('Ошибка зданий:', error);
    });

// =======================
// ВОДОЁМЫ
// =======================

fetch('waterbodies.geojson')
    .then(response => response.json())
    .then(data => {

        const waterLayer = L.geoJSON(data, {

            style: {
                color: '#42a5f5',
                weight: 1,
                fillColor: '#90caf9',
                fillOpacity: 0.7
            }

        });

        waterLayer.addTo(map);

    })
    .catch(error => {
        console.error('Ошибка водоёмов:', error);
    });

// =======================
// РУСЛА
// =======================

fetch('waterways.geojson')
    .then(response => response.json())
    .then(data => {

        const waterwaysLayer = L.geoJSON(data, {

            style: {
                color: '#1976d2',
                weight: 2,
                opacity: 0.9
            }

        });

        waterwaysLayer.addTo(map);

    })
    .catch(error => {
        console.error('Ошибка русел:', error);
    });

// =======================
// РАСТИТЕЛЬНОСТЬ
// =======================

fetch('greenery.geojson')
    .then(response => response.json())
    .then(data => {

        const greeneryLayer = L.geoJSON(data, {

            style: function(feature) {

                return {
                    color: '#43a047',
                    weight: 1,
                    fillColor: '#81c784',
                    fillOpacity: 0.5
                };

            },

            onEachFeature: function(feature, layer) {

                const p = feature.properties;

                layer.bindPopup(`
                    <div style="font-family:Segoe UI;">
                        <b>${p.Name || 'Зелёная территория'}</b><br>
                        Тип: ${p['Code OSM'] || ''}
                    </div>
                `);

            }

        });

        greeneryLayer.addTo(map);

    })
    .catch(error => {
        console.error('Ошибка растительности:', error);
    });

// =======================
// ТЕРРИТОРИИ
// =======================

fetch('landuse.geojson')
    .then(response => response.json())
    .then(data => {

        const landuseLayer = L.geoJSON(data, {

            style: function(feature) {

                const type = feature.properties.landuse;

                switch(type) {

                    case 'residential':
                        return {
                            color: '#d6c7a1',
                            fillColor: '#e8dcc0',
                            fillOpacity: 0.4,
                            weight: 0.5
                        };

                    case 'commercial':
                        return {
                            color: '#c5cae9',
                            fillColor: '#9fa8da',
                            fillOpacity: 0.4,
                            weight: 0.5
                        };

                    case 'industrial':
                        return {
                            color: '#b0bec5',
                            fillColor: '#90a4ae',
                            fillOpacity: 0.5,
                            weight: 0.5
                        };

                    case 'railway':
                        return {
                            color: '#9e9e9e',
                            fillColor: '#bdbdbd',
                            fillOpacity: 0.5,
                            weight: 0.5
                        };

                    case 'grass':
                    case 'recreation_ground':
                        return {
                            color: '#66bb6a',
                            fillColor: '#a5d6a7',
                            fillOpacity: 0.4,
                            weight: 0.5
                        };

                    default:
                        return {
                            color: '#cccccc',
                            fillColor: '#e0e0e0',
                            fillOpacity: 0.3,
                            weight: 0.5
                        };
                }

            },

            onEachFeature: function(feature, layer) {

                layer.bindPopup(`
                    <div style="font-family:Segoe UI;">
                        <b>Территория</b><br>
                        Тип: ${feature.properties.landuse || 'не указан'}
                    </div>
                `);

            }

        });

        landuseLayer.addTo(map);

    })
    .catch(error => {
        console.error('Ошибка территорий:', error);
    });
