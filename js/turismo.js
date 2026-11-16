const URL_ATRACCIONES = "https://api-colombia.com/api/v1/TouristicAttraction";
const URL_CIUDADES = "https://api-colombia.com/api/v1/City";
const URL_DEPARTAMENTOS = "https://api-colombia.com/api/v1/Department";

// Respaldo limpio en SVG (sin fotos de otros países) por si falla alguna URL externa
const IMAGEN_SIN_FOTO = "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='450' viewBox='0 0 800 450'%3E%3Crect fill='%23003893' width='800' height='450'/%3E%3Ctext fill='%23FCD116' font-family='sans-serif' font-size='28' font-weight='bold' x='50%25' y='50%25' text-anchor='middle' dominant-baseline='middle'%3EAtractivo Turístico de Colombia%3C/text%3E%3C/svg%3E";

// Imágenes reales verificadas de cada lugar para reemplazar las URLs rotas de la API
const IMAGENES_COLOMBIA = {
    "hacienda napoles": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Portada_Hacienda_N%C3%A1poles.jpg/800px-Portada_Hacienda_N%C3%A1poles.jpg",
    "santa fe de antioquia": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/86/Santa_Fe_de_Antioquia_-_Iglesia_de_Santa_B%C3%A1rbara.jpg/800px-Santa_Fe_de_Antioquia_-_Iglesia_de_Santa_B%C3%A1rbara.jpg",
    "la ventana del mundo": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Ventana_al_Mundo_-_Barranquilla.jpg/800px-Ventana_al_Mundo_-_Barranquilla.jpg",
    "gran malecon": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Gran_Malec%C3%B3n_del_R%C3%ADo_Magdalena_-_Barranquilla.jpg/800px-Gran_Malec%C3%B3n_del_R%C3%ADo_Magdalena_-_Barranquilla.jpg",
    "castillo san felipe de barajas": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Castillo_de_San_Felipe_de_Barajas%2C_Cartagena.jpg/800px-Castillo_de_San_Felipe_de_Barajas%2C_Cartagena.jpg",
    "islas del rosario": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Islas_del_Rosario%2C_Cartagena%2C_Colombia.jpg/800px-Islas_del_Rosario%2C_Cartagena%2C_Colombia.jpg",
    "museo del oro": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Museo_del_Oro%2C_Bogot%C3%A1.jpg/800px-Museo_del_Oro%2C_Bogot%C3%A1.jpg",
    "monserrate": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Santuario_de_Monserrate_Bogot%C3%A1.jpg/800px-Santuario_de_Monserrate_Bogot%C3%A1.jpg",
    "catedral de sal de zipaquira": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Catedral_de_Sal_de_Zipaquir%C3%A1_-_Nave_Central.jpg/800px-Catedral_de_Sal_de_Zipaquir%C3%A1_-_Nave_Central.jpg",
    "piedra del penol": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Piedra_del_Pe%C3%B1ol%2C_Guatap%C3%A9%2C_Colombia.jpg/800px-Piedra_del_Pe%C3%B1ol%2C_Guatap%C3%A9%2C_Colombia.jpg",
    "guatape": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Z%C3%B3calos_de_Guatap%C3%A9%2C_Antioquia.jpg/800px-Z%C3%B3calos_de_Guatap%C3%A9%2C_Antioquia.jpg",
    "parque tayrona": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/26/Cabo_San_Juan%2C_Parque_Nacional_Natural_Tayrona.jpg/800px-Cabo_San_Juan%2C_Parque_Nacional_Natural_Tayrona.jpg",
    "ciudad perdida": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Ciudad_Perdida%2C_Sierra_Nevada_de_Santa_Marta.jpg/800px-Ciudad_Perdida%2C_Sierra_Nevada_de_Santa_Marta.jpg",
    "valle de cocora": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Valle_del_Cocora%2C_Salento%2C_Quind%C3%ADo.jpg/800px-Valle_del_Cocora%2C_Salento%2C_Quind%C3%ADo.jpg",
    "cano cristales": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Ca%C3%B1o_Cristales%2C_Meta%2C_Colombia.jpg/800px-Ca%C3%B1o_Cristales%2C_Meta%2C_Colombia.jpg",
    "desierto de la tatacoa": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/Desierto_de_la_Tatacoa%2C_Huila.jpg/800px-Desierto_de_la_Tatacoa%2C_Huila.jpg",
    "santuario de las lajas": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/Santuario_de_Las_Lajas%2C_Ipiales%2C_Colombia.jpg/800px-Santuario_de_Las_Lajas%2C_Ipiales%2C_Colombia.jpg",
    "parque nacional del cafe": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Parque_Nacional_del_Caf%C3%A9%2C_Montenegro%2C_Quind%C3%ADo.jpg/800px-Parque_Nacional_del_Caf%C3%A9%2C_Montenegro%2C_Quind%C3%ADo.jpg",
    "canon del chicamocha": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/Ca%C3%B1%C3%B3n_del_Chicamocha%2C_Santander.jpg/800px-Ca%C3%B1%C3%B3n_del_Chicamocha%2C_Santander.jpg",
    "barichara": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Barichara%2C_Santander%2C_Colombia.jpg/800px-Barichara%2C_Santander%2C_Colombia.jpg"
};

const contenedor = document.getElementById("contenedor-atracciones");
const estadoCarga = document.getElementById("estado-carga");

function normalizarTexto(texto) {
    return texto
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim();
}

function obtenerImagenAtractivo(atraccion) {
    const nombreNormalizado = normalizarTexto(atraccion.name);

    // 1. Buscar coincidencia exacta o parcial en el diccionario de imágenes reales de Colombia
    for (const [clave, url] of Object.entries(IMAGENES_COLOMBIA)) {
        if (nombreNormalizado.includes(clave) || clave.includes(nombreNormalizado)) {
            return url;
        }
    }

    // 2. Si no está en el diccionario, intentar usar la imagen que trae la API
    if (Array.isArray(atraccion.images) && atraccion.images.length > 0 && atraccion.images[0]) {
        return atraccion.images[0];
    }

    // 3. Respaldo neutro
    return IMAGEN_SIN_FOTO;
}

function cargarAtraccionesTuristicas() {
    estadoCarga.textContent = "Cargando atractivos turísticos de Colombia...";
    estadoCarga.classList.remove("oculto", "error");

    Promise.all([
        fetch(URL_ATRACCIONES).then((res) => {
            if (!res.ok) throw new Error(`Error HTTP atracciones: ${res.status}`);
            return res.json();
        }),
        fetch(URL_CIUDADES).then((res) => {
            if (!res.ok) throw new Error(`Error HTTP ciudades: ${res.status}`);
            return res.json();
        }),
        fetch(URL_DEPARTAMENTOS).then((res) => {
            if (!res.ok) throw new Error(`Error HTTP departamentos: ${res.status}`);
            return res.json();
        })
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

            const primerosVeinte = atracciones.slice(0, 20);

            estadoCarga.classList.add("oculto");
            renderizarTarjetas(primerosVeinte, mapaCiudades);
        })
        .catch((error) => {
            console.error("Error al obtener los datos:", error);
            estadoCarga.textContent = "Ocurrió un error al cargar los atractivos turísticos. Por favor, intenta nuevamente más tarde.";
            estadoCarga.classList.add("error");
        });
}

function renderizarTarjetas(lista, mapaCiudades) {
    contenedor.innerHTML = "";

    lista.forEach((atraccion) => {
        const infoCiudad = mapaCiudades.get(atraccion.cityId);
        const ciudadNombre = atraccion.city?.name || infoCiudad?.nombreCiudad || "Ciudad no especificada";
        const deptoNombre = atraccion.city?.department?.name || infoCiudad?.nombreDepartamento || "Colombia";

        const imagenUrl = obtenerImagenAtractivo(atraccion);
        const descripcionTexto = atraccion.description || "Sin descripción disponible para este atractivo turístico.";

        const tarjeta = document.createElement("article");
        tarjeta.className = "tarjeta";

        const img = document.createElement("img");
        img.className = "tarjeta-img";
        img.src = imagenUrl;
        img.alt = atraccion.name;
        img.loading = "lazy";
        img.onerror = function () {
            // Si falla la URL de la API, intenta buscar en el diccionario; si también falla, usa el SVG neutro
            const nombreNorm = normalizarTexto(atraccion.name);
            const urlAlternativa = Object.entries(IMAGENES_COLOMBIA).find(([clave]) => nombreNorm.includes(clave))?.[1];
            if (urlAlternativa && this.src !== urlAlternativa) {
                this.src = urlAlternativa;
            } else {
                this.onerror = null;
                this.src = IMAGEN_SIN_FOTO;
            }
        };

        const cuerpo = document.createElement("div");
        cuerpo.className = "tarjeta-cuerpo";

        const ubicacion = document.createElement("span");
        ubicacion.className = "tarjeta-ubicacion";
        ubicacion.textContent = `${ciudadNombre} • ${deptoNombre}`;

        const titulo = document.createElement("h3");
        titulo.className = "tarjeta-titulo";
        titulo.textContent = atraccion.name;

        const descripcion = document.createElement("p");
        descripcion.className = "tarjeta-descripcion";
        descripcion.textContent = descripcionTexto;

        cuerpo.append(ubicacion, titulo, descripcion);
        tarjeta.append(img, cuerpo);
        contenedor.appendChild(tarjeta);
    });
}

document.addEventListener("DOMContentLoaded", cargarAtraccionesTuristicas);