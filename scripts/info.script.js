const params = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop),
});

var especieData;
var markers = [];

if (!params.nombre) {
    window.location.href = "./";
}

// initialize the map on the "map" div with a given center and zoom
var map = L.map("map").setView([24.334917, -103.185994], 5);

L.tileLayer(
    "https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=SITCjiQQojKS2PVJ6BOa",
    {
        attribution:
            '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>',
        maxZoom: 18,
        id: "mapbox/streets-v11",
        tileSize: 512,
        zoomOffset: -1,
        accessToken: "your.mapbox.access.token",
    }
).addTo(map);

fetch("https://ocean-dex-api.herokuapp.com/api/consultar/" + params.nombre)
    .then(data => {
        return data.json();
    })
    .then(especie => {
        especieData = especie;
        incorporarTexto();
        obterImagen();
    })
    .catch(err => {
        console.log(err);
    });

function obterImagen() {
    fetch(
        "https://ocean-dex-api.herokuapp.com/api/consultar/img/" + params.nombre
    )
        .then(data => {
            return data.json();
        })
        .then(datos => {
            especieData.img = datos.img;
            especieData.wikipedia_url = datos.wikipedia_url;
            incorporarImgYWiky();
        })
        .catch(err => {
            console.log(err);
        });
}

function incorporarTexto() {
    document.querySelector(".nombre_cientifico").textContent =
        especieData.Nombre_cientifico;
    document.querySelector(".nombre_comun").textContent =
        especieData.Nombres_comunes;
    document.querySelector(".familia").textContent = especieData.familia;
    document.querySelector(".especie").textContent = especieData.especie;
    document.querySelector(".ambiente").textContent = especieData.Ambiente;
    document.querySelector(".registros").textContent =
        especieData.Numero_de_registros;
    document.querySelector(".estatus").textContent = especieData.Estatus;
    document.querySelector(".clase").textContent = especieData.clase;
}

function incorporarImgYWiky() {
    if (especieData.img != "") {
        document.querySelector(
            ".imagen-img"
        ).innerHTML = `<img src="${especieData.img}" alt="${especieData.Nombre_cientifico}" />`;
    } else {
        document.querySelector(
            ".imagen-img"
        ).innerHTML = `<img src="http://via.placeholder.com/250x250?text=OceanDex" alt="OceanDex imagen no encontrada" />`;
    }

    if (especieData.wikipedia_url != null) {
        document.querySelector(
            ".wikipedia-link"
        ).innerHTML = `<a href="${especieData.wikipedia_url}" target="_blank">Wikipedia</a>`;
    }

    agregarMarcadores();
}

function agregarMarcadores() {
    especieData.Ejemplares.forEach(ejemplar => {
        markers.push(
            L.marker([ejemplar.latitud, ejemplar.longitud])
                .addTo(map)
                .openPopup()
        );
    });
}
