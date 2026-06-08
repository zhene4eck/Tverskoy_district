// Создание карты
const map = L.map('map').setView([55.765, 37.605], 14);

// Кнопки масштаба справа
map.zoomControl.setPosition('topright');

// Подложка OSM
L.tileLayer(
    'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
    {
        attribution: '&copy; OpenStreetMap'
    }
).addTo(map);

// Загрузка GeoJSON
fetch('36.geojson')
    .then(response => response.json())
    .then(data => {

        const heritageLayer = L.geoJSON(data, {

            onEachFeature: function(feature, layer) {

                const p = feature.properties;

                layer.bindPopup(`
<div style="
    background:white;
    border-radius:14px;
    padding:14px;
    width:350px;
    font-family:Segoe UI, Arial, sans-serif;
    box-shadow:0 2px 8px rgba(0,0,0,0.15);
">

<h3 style="
    margin:0 0 8px 0;
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

<div style="margin-bottom:12px;">

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
    padding:8px 10px;
    margin-bottom:11px;
    font-size:12px;
">
<b>Подробнее:</b><br>
${p.Full_Name || ''}
</div>

</div>
                `, {
                    maxWidth: 420
                });

            }

        });

        heritageLayer.addTo(map);

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
