// Создание карты
const map = L.map('map').setView(
    [55.765, 37.605],
    14
);

// Подложка OpenStreetMap
L.tileLayer(
    'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
    {
        attribution: '&copy; OpenStreetMap'
    }
).addTo(map);

// Загрузка объектов культурного наследия
fetch('36.geojson')
    .then(response => response.json())
    .then(data => {

        const heritageLayer = L.geoJSON(data, {

            pointToLayer: function(feature, latlng) {

                return L.circleMarker(latlng, {
                    radius: 6,
                    color: '#8b0000',
                    weight: 1,
                    fillColor: '#c0392b',
                    fillOpacity: 0.8
                });

            },

            onEachFeature: function(feature, layer) {

                const p = feature.properties;

                layer.bindPopup(`
                    <div style="max-width:320px;">
                        <h3 style="margin-top:0;">
                            ${p.Name || 'Без названия'}
                        </h3>

                        <p>
                            <b>Категория:</b><br>
                            ${p.Subtype || '-'}
                        </p>

                        <p>
                            <b>Вид объекта:</b><br>
                            ${p.Subsubtype || '-'}
                        </p>

                        <p>
                            <b>Адрес:</b><br>
                            ${p.Addresses || '-'}
                        </p>
                    </div>
                `);

            }

        });

        heritageLayer.addTo(map);

        // Автоматический переход к объектам
        map.fitBounds(
            heritageLayer.getBounds(),
            {
                padding: [20, 20]
            }
        );

    })
    .catch(error => {
        console.error('Ошибка загрузки GeoJSON:', error);
    });
