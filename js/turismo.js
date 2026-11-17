const URL_ATRACCIONES = "https://api-colombia.com/api/v1/TouristicAttraction";
const URL_CIUDADES = "https://api-colombia.com/api/v1/City";
const URL_DEPARTAMENTOS = "https://api-colombia.com/api/v1/Department";

// Mapa por ID del atractivo turístico.
// Cuando una imagen de la API falle, pega aquí la URL real de ese lugar específico
// (clic derecho en la foto en Google Imágenes -> "Copiar dirección de imagen"):
// OJO: las claves son los IDs reales que devuelve la API (los que se ven en el título de cada tarjeta).
const FOTOS_POR_ATRACTIVO = {
    36: "https://commons.wikimedia.org/wiki/Special:FilePath/P%C3%B3rtico_Hacienda_N%C3%A1poles.JPG?width=800", // Hacienda Nápoles
    17: "https://commons.wikimedia.org/wiki/Special:FilePath/Ventanalmundo.jpg?width=800", // La Ventana del Mundo
    26: "https://commons.wikimedia.org/wiki/Special:FilePath/Ritacuba_.jpg?width=800", // Nevado del Cocuy
    28: "https://commons.wikimedia.org/wiki/Special:FilePath/Nevado_del_Ruiz_nos_saludo_4.jpg?width=800", // Nevado del Ruiz
    40: "https://commons.wikimedia.org/wiki/Special:FilePath/Centro_Hist%C3%B3rico_2.JPG?width=800", // Centro Histórico de Popayán
    19: "", // Volcán del Totumo -> pega aquí una URL de imagen que funcione
    41: ""  // Parque Natural Puracé -> pega aquí una URL de imagen que funcione
};

const contenedor = document.getElementById("contenedor-atracciones");
const estadoCarga = document.getElementById("estado-carga");

// CORRECCIÓN: las listas de ciudades y departamentos son datos de apoyo.
// Si alguna falla, devolvemos [] en lugar de romper toda la página.
function obtenerListaOpcional(url) {
    return fetch(url)
        .then((res) => {
            if (!res.ok) throw new Error(`Error HTTP: ${res.status}`);
            return res.json();
        })
        .catch((error) => {
            console.warn("No se pudo cargar una lista de apoyo:", url, error);
            return [];
        });
}

function cargarAtraccionesTuristicas() {
    estadoCarga.textContent = "Cargando atractivos turísticos de Colombia...";
    estadoCarga.classList.remove("oculto", "error");

    Promise.all([
        fetch(URL_ATRACCIONES).then((res) => {
            if (!res.ok) throw new Error(`Error HTTP atracciones: ${res.status}`);
            return res.json();
        }),
        obtenerListaOpcional(URL_CIUDADES),
        obtenerListaOpcional(URL_DEPARTAMENTOS)
    ])
        .then(([atracciones, ciudades, departamentos]) => {
            const mapaDepartamentos = new Map();
            departamentos.forEach((depto) => {
                mapaDepartamentos.set(depto.id, depto.name);
            });

            const mapaCiudades = new Map();
            ciudades.forEach((ciudad) => {
                const nombreDepto = ciudad.department?.name || mapaDepartamentos.get(ciudad.departmentId) || "Colombia";
                mapaCiudades.set(ciudad.id, {
                    nombreCiudad: ciudad.name,
                    nombreDepartamento: nombreDepto
                });
            });

            // Extra: mostrar solo los primeros 20 elementos
            const primerosVeinte = atracciones.slice(0, 20);

            estadoCarga.classList.add("oculto");
            renderizarTarjetas(primerosVeinte, mapaCiudades, mapaDepartamentos);
        })
        .catch((error) => {
            console.error("Error al obtener los datos:", error);
            estadoCarga.textContent = "Ocurrió un error al cargar los atractivos turísticos. Por favor, intenta nuevamente más tarde.";
            estadoCarga.classList.add("error");
        });
}

// Busca en Wikipedia una foto del lugar (se usa cuando la imagen de la API no existe o está rota)
function buscarImagenWikipedia(nombre, ciudad) {
    const consulta = encodeURIComponent(`${nombre.trim()} ${ciudad} Colombia`);
    const url =
        "https://es.wikipedia.org/w/api.php?action=query&generator=search" +
        `&gsrsearch=${consulta}&gsrlimit=1&prop=pageimages&piprop=thumbnail&pithumbsize=800` +
        "&format=json&origin=*";

    return fetch(url)
        .then((res) => res.json())
        .then((datos) => {
            const paginas = datos.query && datos.query.pages ? Object.values(datos.query.pages) : [];
            return paginas.length > 0 && paginas[0].thumbnail ? paginas[0].thumbnail.source : null;
        })
        .catch(() => null);
}

// Pone la imagen en la tarjeta: primero la manual/de la API; si falla, la de Wikipedia
function ponerImagen(tarjeta, nombre, ciudad, urlInicial) {
    const img = document.createElement("img");
    img.className = "tarjeta-img";
    img.alt = `${nombre} - ${ciudad}`;
    img.loading = "lazy";

    let usoRespaldo = false;

    function intentarRespaldo() {
        if (usoRespaldo) {
            img.remove();
            return;
        }
        usoRespaldo = true;
        buscarImagenWikipedia(nombre, ciudad).then((urlWiki) => {
            if (urlWiki) {
                img.src = urlWiki;
                if (!img.isConnected) tarjeta.prepend(img);
            } else {
                img.remove();
            }
        });
    }

    img.onerror = intentarRespaldo;

    if (urlInicial) {
        img.src = urlInicial;
        tarjeta.prepend(img);
    } else {
        intentarRespaldo();
    }
}

function renderizarTarjetas(lista, mapaCiudades, mapaDepartamentos) {
    contenedor.innerHTML = "";

    lista.forEach((atraccion, indice) => {
        const infoCiudad = mapaCiudades.get(atraccion.cityId);
        const ciudadNombre = atraccion.city?.name || infoCiudad?.nombreCiudad || "Ciudad no especificada";
        // CORRECCIÓN: la API trae city.departmentId (city.department viene en null),
        // así que el departamento se busca directamente por ese ID.
        const deptoNombre =
            atraccion.city?.department?.name ||
            mapaDepartamentos.get(atraccion.city?.departmentId) ||
            infoCiudad?.nombreDepartamento ||
            "Colombia";
        const descripcionTexto = atraccion.description || "Sin descripción disponible para este atractivo turístico.";

        const fotoManual = FOTOS_POR_ATRACTIVO[atraccion.id];
        const primeraImagen = Array.isArray(atraccion.images) && atraccion.images.length > 0 ? atraccion.images[0] : null;
        // Algunas imágenes de la API no son URLs válidas (son texto); esas se descartan
        const urlApi = typeof primeraImagen === "string" && primeraImagen.startsWith("http") ? primeraImagen : null;
        const imagenFinal = fotoManual || urlApi;

        const tarjeta = document.createElement("article");
        tarjeta.className = "tarjeta";

        ponerImagen(tarjeta, atraccion.name, ciudadNombre, imagenFinal);

        const cuerpo = document.createElement("div");
        cuerpo.className = "tarjeta-cuerpo";

        const ubicacion = document.createElement("span");
        ubicacion.className = "tarjeta-ubicacion";
        ubicacion.textContent = `${ciudadNombre} • ${deptoNombre}`;

        const titulo = document.createElement("h3");
        titulo.className = "tarjeta-titulo";
        // Numeración en orden de 1 a 20 (en vez del ID interno de la API)
        titulo.textContent = `${indice + 1}. ${atraccion.name}`;

        const descripcion = document.createElement("p");
        descripcion.className = "tarjeta-descripcion";
        descripcion.textContent = descripcionTexto;

        cuerpo.append(ubicacion, titulo, descripcion);
        tarjeta.appendChild(cuerpo);
        contenedor.appendChild(tarjeta);
    });
}

document.addEventListener("DOMContentLoaded", cargarAtraccionesTuristicas);