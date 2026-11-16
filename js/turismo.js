const URL_ATRACCIONES = "https://api-colombia.com/api/v1/TouristicAttraction";
const URL_CIUDADES = "https://api-colombia.com/api/v1/City";
const IMAGEN_RESPALDO = "https://images.unsplash.com/photo-1518638150340-f706e86654de?auto=format&fit=crop&w=800&q=80";

const contenedor = document.getElementById("contenedor-atracciones");
const estadoCarga = document.getElementById("estado-carga");

function cargarAtraccionesTuristicas() {
    // 1. Mostrar mensaje de carga inicial
    estadoCarga.textContent = "Cargando atractivos turísticos de Colombia...";
    estadoCarga.classList.remove("oculto", "error");

    // 2. Consumir atractivos y ciudades para cruzar ciudad y departamento
    Promise.all([
        fetch(URL_ATRACCIONES).then((res) => {
            if (!res.ok) throw new Error(`Error HTTP atracciones: ${res.status}`);
            return res.json();
        }),
        fetch(URL_CIUDADES).then((res) => {
            if (!res.ok) throw new Error(`Error HTTP ciudades: ${res.status}`);
            return res.json();
        })
    ])
        .then(([atracciones, ciudades]) => {
            // Crear mapa rápido de ciudades por ID para obtener ciudad y departamento
            const mapaCiudades = new Map();
            ciudades.forEach((ciudad) => {
                mapaCiudades.set(ciudad.id, {
                    nombreCiudad: ciudad.name,
                    nombreDepartamento: ciudad.department ? ciudad.department.name : "Colombia"
                });
            });

            // EXTRA: Mostrar solo los primeros 20 elementos
            const primerosVeinte = atracciones.slice(0, 20);

            // Ocultar mensaje de carga
            estadoCarga.classList.add("oculto");

            // Construir el DOM dinámicamente
            renderizarTarjetas(primerosVeinte, mapaCiudades);
        })
        .catch((error) => {
            // Manejo de errores con catch
            console.error("Error al obtener los datos:", error);
            estadoCarga.textContent = "Ocurrió un error al cargar los atractivos turísticos. Por favor, intenta nuevamente más tarde.";
            estadoCarga.classList.add("error");
        });
}

function renderizarTarjetas(lista, mapaCiudades) {
    contenedor.innerHTML = "";

    lista.forEach((atraccion) => {
        // Obtener ciudad y departamento (desde el objeto city o desde el mapa de ciudades)
        const infoCiudad = mapaCiudades.get(atraccion.cityId);
        const ciudadNombre = atraccion.city?.name || infoCiudad?.nombreCiudad || "Ciudad no especificada";
        const deptoNombre = atraccion.city?.department?.name || infoCiudad?.nombreDepartamento || "Colombia";

        // Validar imagen de la API o usar respaldo
        const imagenUrl = Array.isArray(atraccion.images) && atraccion.images.length > 0 && atraccion.images[0]
            ? atraccion.images[0]
            : IMAGEN_RESPALDO;

        const descripcionTexto = atraccion.description || "Sin descripción disponible para este atractivo turístico.";

        // Crear elementos en el DOM
        const tarjeta = document.createElement("article");
        tarjeta.className = "tarjeta";

        const img = document.createElement("img");
        img.className = "tarjeta-img";
        img.src = imagenUrl;
        img.alt = atraccion.name;
        img.loading = "lazy";
        // Si la URL de la API está rota, reemplaza automáticamente por una imagen válida
        img.onerror = function () {
            this.onerror = null;
            this.src = IMAGEN_RESPALDO;
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