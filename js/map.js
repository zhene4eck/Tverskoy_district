// Карта
const map = L.map('map').setView(
    [55.765, 37.605],
    14
);

// Масштабная регулеровка справа
map.zoomControl.setPosition('topright');

// Слои
let heritageLayer;
let bikeRoutesLayer;
let bikeParkingLayer;
let stopsLayer;
let addressLayer;
let roadsLayer;
let buildingsLayer;
let waterLayer;
let waterwaysLayer;
let greeneryLayer;
let landuseLayer;
let boundaryLayer;

// =======================
// ПОРЯДОК СЛОЁВ
// =======================

map.createPane('boundary');
map.createPane('landuse');
map.createPane('greenery');
map.createPane('water');
map.createPane('waterways');
map.createPane('roads');
map.createPane('buildings');
map.createPane('addresses');
map.createPane('stops');
map.createPane('bikeRoutes');
map.createPane('bikeParking');
map.createPane('heritage');

map.getPane('boundary').style.zIndex = 200;
map.getPane('landuse').style.zIndex = 210;
map.getPane('greenery').style.zIndex = 220;
map.getPane('water').style.zIndex = 230;
map.getPane('waterways').style.zIndex = 240;
map.getPane('roads').style.zIndex = 250;
map.getPane('buildings').style.zIndex = 260;
map.getPane('addresses').style.zIndex = 270;
map.getPane('stops').style.zIndex = 280;
map.getPane('bikeRoutes').style.zIndex = 290;
map.getPane('bikeParking').style.zIndex = 300;
map.getPane('heritage').style.zIndex = 310;

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

        heritageLayer = L.geoJSON(data, {
            pane: 'heritage',

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
        
         bikeParkingLayer = L.geoJSON(data, {
            pane: 'bikeParking',

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

        bikeParkingLayer.addTo(map);

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

        bikeRoutesLayer = L.geoJSON(data, {
            pane: 'bikeRoutes',

            style: {
                color: '#1976d2',
                weight: 4,
                opacity: 0.9
            }

        });

        bikeRoutesLayer.addTo(map);

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

        stopsLayer = L.geoJSON(data, {
            pane: 'stops',

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

        addressLayer = L.geoJSON(data, {
            pane: 'addresses',

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

        roadsLayer = L.geoJSON(data, {
            pane: 'roads',

            style: function(feature) {

    const code = feature.properties.Code;

    switch(code) {

        // Магистральные
        case 'В3':
            return {
                color: '#b7bec4',
                weight: 3
            };

        // Районные
        case 'В4':
            return {
                color: '#c6cdd3',
                weight: 2.5
            };

        // Местные
        case 'В5':
            return {
                color: '#d6dce0',
                weight: 2
            };

        // Внутриквартальные
        case 'В6':
            return {
                color: '#e4e8eb',
                weight: 1.5
            };

        // Пешеходные
        case 'В7':
            return {
                color: '#d0d0d0',
                weight: 1,
                dashArray: '4,4'
            };

        default:
            return {
                color: '#d6dce0',
                weight: 1.5
            };
    }

},

            onEachFeature: function(feature, layer) {

                const p = feature.properties;

                layer.bindPopup(`
                    <div style="font-family:Segoe UI;">
                        <b>${p.name || 'Без названия'}</b><br>
                        Категория дороги: ${p.Code || ''}
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

        buildingsLayer = L.geoJSON(data, {
            pane: 'buildings',

            style: function(feature) {

    const code = feature.properties.Code;

    switch(code) {

        // Жилые
        case 'Б1':
            return {
                fillColor: '#e6e6e3',
                color: '#cecece',
                weight: 0.3,
                fillOpacity: 1
            };

        // Офисы
        case 'Б2':
            return {
                fillColor: '#e3e4e6',
                color: '#cecece',
                weight: 0.3,
                fillOpacity: 1
            };

        // Образование
        case 'Б3':
            return {
                fillColor: '#e7e6f0',
                color: '#cecece',
                weight: 0.3,
                fillOpacity: 1
            };

        // Медицина
        case 'Б4':
            return {
                fillColor: '#f2e3e3',
                color: '#cecece',
                weight: 0.3,
                fillOpacity: 1
            };

        // Культура
        case 'Б5':
            return {
                fillColor: '#f0e8dc',
                color: '#cecece',
                weight: 0.3,
                fillOpacity: 1
            };

        // Религия
        case 'Б6':
            return {
                fillColor: '#eae6f1',
                color: '#cecece',
                weight: 0.3,
                fillOpacity: 1
            };

        // Промышленность
        case 'Б7':
            return {
                fillColor: '#dcdcdc',
                color: '#cecece',
                weight: 0.3,
                fillOpacity: 1
            };

        // Спорт
        case 'Б8':
            return {
                fillColor: '#e7eee3',
                color: '#cecece',
                weight: 0.3,
                fillOpacity: 1
            };

        default:
            return {
                fillColor: '#e6e6e3',
                color: '#cecece',
                weight: 0.3,
                fillOpacity: 1
            };
    }

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

        waterLayer = L.geoJSON(data, {
            pane: 'water',

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

        waterwaysLayer = L.geoJSON(data, {
            pane: 'waterways',

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

        greeneryLayer = L.geoJSON(data, {
            pane: 'greenery',

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

        landuseLayer = L.geoJSON(data, {
            pane: 'landuse',

            style: function(feature) {

                const code = feature.properties.Code;

                switch(code) {

                    case 'Е1':
                        return {
                            fillColor: '#f0f1ee',
                            color: '#d6d6d6',
                            weight: 0.3,
                            fillOpacity: 1
                        };

                    case 'Е2':
                        return {
                            fillColor: '#bdc4d3',
                            color: '#a3aabb',
                            weight: 0.3,
                            fillOpacity: 1
                        };

                    default:
                        return {
                            fillColor: '#f0f1ee',
                            color: '#d6d6d6',
                            weight: 0.3,
                            fillOpacity: 1
                        };
                }

            },

            onEachFeature: function(feature, layer) {

                layer.bindPopup(`
                    <div style="font-family:Segoe UI;">
                        <b>Территория</b><br>
                        Код: ${feature.properties.Code || 'не указан'}
                    </div>
                `);

            }

        });

        landuseLayer.addTo(map);

    })
    .catch(error => {
        console.error('Ошибка территорий:', error);
    });

// =======================
// ГРАНИЦА ТВЕРСКОГО РАЙОНА
// =======================

fetch('district_boundary.geojson')
    .then(response => response.json())
    .then(data => {

        boundaryLayer = L.geoJSON(data, {
            pane: 'boundary',

            style: {
                color: '#4a148c',
                weight: 3,
                opacity: 1,
                fillOpacity: 0
            },

            onEachFeature: function(feature, layer) {

                layer.bindPopup(`
                    <div style="font-family:Segoe UI;">
                        <b>${feature.properties.name}</b>
                    </div>
                `);

            }

        });

        boundaryLayer.addTo(map);

    })
    .catch(error => {
        console.error('Ошибка границы района:', error);
    });

// =======================
// ЧЕКБОКСЫ СЛОЁВ
// =======================

function toggleLayer(layer, checked) {

    if (!layer) return;

    if (checked) {
        map.addLayer(layer);
    } else {
        map.removeLayer(layer);
    }
}

setTimeout(() => {

    document.getElementById('heritageCheck')
        ?.addEventListener('change', function() {
            toggleLayer(heritageLayer, this.checked);
        });

        document.getElementById('addressCheck')
        ?.addEventListener('change', function() {
            toggleLayer(addressLayer, this.checked);
        });

    document.getElementById('roadsCheck')
        ?.addEventListener('change', function() {
            toggleLayer(roadsLayer, this.checked);
        });

    document.getElementById('buildingsCheck')
        ?.addEventListener('change', function() {
            toggleLayer(buildingsLayer, this.checked);
        });

    document.getElementById('waterCheck')
        ?.addEventListener('change', function() {
            toggleLayer(waterLayer, this.checked);
        });

    document.getElementById('waterwaysCheck')
        ?.addEventListener('change', function() {
            toggleLayer(waterwaysLayer, this.checked);
        });

    document.getElementById('greeneryCheck')
        ?.addEventListener('change', function() {
            toggleLayer(greeneryLayer, this.checked);
        });

    document.getElementById('landuseCheck')
        ?.addEventListener('change', function() {
            toggleLayer(landuseLayer, this.checked);
        });

    document.getElementById('boundaryCheck')
        ?.addEventListener('change', function() {
            toggleLayer(boundaryLayer, this.checked);
        });

    document.getElementById('bikeRoutesCheck')
        ?.addEventListener('change', function() {
            toggleLayer(bikeRoutesLayer, this.checked);
        });

    document.getElementById('bikeParkingCheck')
        ?.addEventListener('change', function() {
            toggleLayer(bikeParkingLayer, this.checked);
        });

    document.getElementById('stopsCheck')
        ?.addEventListener('change', function() {
            toggleLayer(stopsLayer, this.checked);
        });

}, 3000);
