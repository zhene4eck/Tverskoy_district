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
map.createPane('roads_v1');
map.createPane('roads_v3');
map.createPane('roads_v4');
map.createPane('roads_v5');
map.createPane('roads_v6');
map.createPane('roads_v7');
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
map.getPane('roads_v7').style.zIndex = 250;
map.getPane('roads_v6').style.zIndex = 251;
map.getPane('roads_v5').style.zIndex = 252;
map.getPane('roads_v4').style.zIndex = 253;
map.getPane('roads_v3').style.zIndex = 254;
map.getPane('roads_v1').style.zIndex = 255;
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

function getHeritageIcon(Subtype, Subsubtype) {

    let iconNumber = 1;

    if (Subtype === 'Ансамбли' && Subsubtype === 'объекты садово-паркового искусства') iconNumber = 1;
    else if (Subtype === 'Ансамбли' && Subsubtype === 'религиозные ансамбли') iconNumber = 2;
    else if (Subtype === 'Ансамбли' && Subsubtype === 'сооружения') iconNumber = 3;

    else if (Subtype === 'Достопримечательные места' && Subsubtype === 'объекты науки и техники') iconNumber = 4;
    else if (Subtype === 'Достопримечательные места' && Subsubtype === 'сооружения') iconNumber = 5;

    else if (Subtype === 'Памятники' && Subsubtype === 'здания') iconNumber = 6;
    else if (Subtype === 'Памятники' && Subsubtype === 'мавзолеи') iconNumber = 7;
    else if (Subtype === 'Памятники' && Subsubtype === 'мемориальные квартиры') iconNumber = 8;
    else if (Subtype === 'Памятники' && Subsubtype === 'объекты науки и техники') iconNumber = 9;
    else if (Subtype === 'Памятники' && Subsubtype === 'отдельные захоронения') iconNumber = 10;
    else if (Subtype === 'Памятники' && Subsubtype === 'памятники религиозного назначения') iconNumber = 11;
    else if (Subtype === 'Памятники' && Subsubtype === 'произведения монументального искусства') iconNumber = 12;
    else if (Subtype === 'Памятники' && Subsubtype === 'сооружения') iconNumber = 13;
        
    // ПО УМОЛЧАНИЮ
    else iconNumber = 16;

    return L.icon({
        iconUrl: `icons/${iconNumber}.svg`,
        iconSize: [18, 18],
        iconAnchor: [11, 22],
        popupAnchor: [0, -22]
    });
}

// ОКН
fetch('36.geojson')
    .then(response => response.json())
    .then(data => {

        heritageLayer = L.geoJSON(data, {
            pane: 'heritage',
            pointToLayer: function(feature, latlng) {

                return L.marker(latlng, {
                    icon: getHeritageIcon(
                        feature.properties.Subtype,
                        feature.properties.Subsubtype
                    )
                });

            },

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

        map.fitBounds(
            heritageLayer.getBounds()
        );

        if (map.getZoom() >= 16) {
            map.addLayer(heritageLayer);
        }

        map.on('zoomend', function() {

            if (map.getZoom() >= 16) {

                if (!map.hasLayer(heritageLayer)) {
                    map.addLayer(heritageLayer);
                }

            } else {

                if (map.hasLayer(heritageLayer)) {
                    map.removeLayer(heritageLayer);
                }

            }

        });

    })
    .catch(error => {
        console.error(error);
    });

// =======================
// ВЕЛОПАРКОВКИ
// =======================

const bikeParkingIcon = L.icon({
    iconUrl: 'icons/25.svg',
    iconSize: [35, 35],
    iconAnchor: [12, 24],
    popupAnchor: [0, -24]
});

fetch('bike_parking.geojson')
    .then(response => response.json())
    .then(data => {

        bikeParkingLayer = L.geoJSON(data, {
            pane: 'bikeParking',

            pointToLayer: function(feature, latlng) {

                return L.marker(latlng, {
                    icon: bikeParkingIcon
                });

            }

        });

        if (map.getZoom() >= 18) {
            map.addLayer(bikeParkingLayer);
        }

        map.on('zoomend', function() {

            if (map.getZoom() >= 18) {

                if (!map.hasLayer(bikeParkingLayer)) {
                    map.addLayer(bikeParkingLayer);
                }

            } else {

                if (map.hasLayer(bikeParkingLayer)) {
                    map.removeLayer(bikeParkingLayer);
                }

            }

        });

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

function getStopIcon(code) {

    let iconNumber = 17;

    if (code === 'Ж1') iconNumber = 22;
    else if (code === 'Ж2') iconNumber = 17;
    else if (code === 'Ж3') iconNumber = 21;

    return L.icon({
        iconUrl: `icons/${iconNumber}.svg`,
        iconSize: [40, 40],
        iconAnchor: [9, 18],
        popupAnchor: [0, -18]
    });
}

fetch('stops.geojson')
    .then(response => response.json())
    .then(data => {

        stopsLayer = L.geoJSON(data, {
            pane: 'stops',

            pointToLayer: function(feature, latlng) {

                return L.marker(latlng, {
                    icon: getStopIcon(
                        feature.properties.Code
                    )
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

        if (map.getZoom() >= 18) {
            map.addLayer(stopsLayer);
        }

        map.on('zoomend', function() {

            if (map.getZoom() >= 16) {

                if (!map.hasLayer(stopsLayer)) {
                    map.addLayer(stopsLayer);
                }

            } else {

                if (map.hasLayer(stopsLayer)) {
                    map.removeLayer(stopsLayer);
                }

            }

        });

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

                return L.marker(latlng, {
                    icon: L.divIcon({
                        className: 'house-number',
                        html: feature.properties['addr:housenumber'] || '',
                        iconSize: [30, 14]
                    })
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

        if (map.getZoom() >= 17) {
            map.addLayer(addressLayer);
        }

        map.on('zoomend', function() {

            if (map.getZoom() >= 17) {

                if (!map.hasLayer(addressLayer)) {
                    map.addLayer(addressLayer);
                }

            } else {

                if (map.hasLayer(addressLayer)) {
                    map.removeLayer(addressLayer);
                }

            }

        });

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
                    case 'В1':
                    case 'В3':
                        return {
                            color: '#6f767c',
                            weight: 5,
                            opacity: 1
                        };

                    // Районные
                    case 'В4':
                        return {
                            color: '#8e959b',
                            weight: 4,
                            opacity: 1
                        };

                    // Местные
                    case 'В5':
                        return {
                            color: '#aeb5ba',
                            weight: 3,
                            opacity: 1
                        };

                    // Внутриквартальные
                    case 'В6':
                        return {
                            color: '#c9ced2',
                            weight: 2,
                            opacity: 1
                        };

                    // Пешеходные
                    case 'В7':
                        return {
                            color: '#e0e4e7',
                            weight: 1,
                            opacity: 1
                        };

                    default:
                        return {
                            color: '#aeb5ba',
                            weight: 2,
                            opacity: 1
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

        // Порядок отрисовки дорог
        roadsLayer.eachLayer(function(layer) {

            const code = layer.feature.properties.Code;

            if (code === 'В7') layer.bringToBack();
            else if (code === 'В6') layer.bringToFront();
            else if (code === 'В5') layer.bringToFront();
            else if (code === 'В4') layer.bringToFront();
            else if (code === 'В3') layer.bringToFront();
            else if (code === 'В1') layer.bringToFront();

        });
        
// Масштабная генерализация
        function updateRoadVisibility() {

            roadsLayer.eachLayer(function(layer) {

                const code = layer.feature.properties.Code;
                const zoom = map.getZoom();

                let visible = false;

                // Магистральные
                if (code === 'В1' || code === 'В3') {
                    visible = true;
                }

                // Районные и местные
                else if (code === 'В4' || code === 'В5') {
                    visible = zoom >= 13;
                }

                // Внутриквартальные и пешеходные
                else if (code === 'В6' || code === 'В7') {
                    visible = zoom >= 15;
                }

                layer.setStyle({
                    opacity: visible ? 1 : 0
                });

            });

        }

        updateRoadVisibility();

        map.on('zoomend', updateRoadVisibility);

        
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
                color: '#c4d4e2',
                weight: 0.5,
                fillColor: '#d8e3ed',
                fillOpacity: 1
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
                color: '#c4d4e2',
                weight: 1.5,
                opacity: 1
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

                const code = feature.properties.Code;

                switch(code) {

                    case 'Д1':
                        return {
                            fillColor: '#c1e3a5',
                            color: '#9fc77d',
                            weight: 0.5,
                            fillOpacity: 1
                        };

                    case 'Д2':
                        return {
                            fillColor: '#92c86d',
                            color: '#6ca64a',
                            weight: 0.5,
                            fillOpacity: 1
                        };

                    default:
                        return {
                            fillColor: '#c1e3a5',
                            color: '#9fc77d',
                            weight: 0.5,
                            fillOpacity: 1
                        };
                }

            },

            onEachFeature: function(feature, layer) {

                const p = feature.properties;

                layer.bindPopup(`
                    <div style="font-family:Segoe UI;">
                        <b>${p.Name || 'Зелёная территория'}</b><br>
                        Код: ${p.Code || ''}
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
                color: '#a8aeb4',
                weight: 2,
                opacity: 1,

                fillColor: '#fafaf8',
                fillOpacity: 0.85,

                dashArray: '12 4 2 4 2 4'
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
