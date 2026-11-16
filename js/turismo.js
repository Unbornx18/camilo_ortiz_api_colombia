const URL_ATRACCIONES = "https://api-colombia.com/api/v1/TouristicAttraction";
const URL_CIUDADES = "https://api-colombia.com/api/v1/City";
const URL_DEPARTAMENTOS = "https://api-colombia.com/api/v1/Department";

const RESPALDOS_COLOMBIA = [
    "https://images.unsplash.com/photo-1583531352515-8884af319dc1?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1568632234157-ce7aecd03d0d?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1518638150340-f706e86654de?auto=format&fit=crop&w=800&q=80"
];

const contenedor = document.getElementById("contenedor-atracciones");
const estadoCarga = document.getElementById("estado-carga");

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

    lista.forEach((atraccion, index) => {
        const infoCiudad = mapaCiudades.get(atraccion.cityId);
        const ciudadNombre = atraccion.city?.name || infoCiudad?.nombreCiudad || "Ciudad no especificada";
        const deptoNombre = atraccion.city?.department?.name || infoCiudad?.nombreDepartamento || "Colombia";

        const imagenRespaldoActual = RESPALDOS_COLOMBIA[index % RESPALDOS_COLOMBIA.length];
        const imagenUrl = Array.isArray(atraccion.images) && atraccion.images.length > 0 && atraccion.images[0]
            ? atraccion.images[0]
            : imagenRespaldoActual;

        const descripcionTexto = atraccion.description || "Sin descripción disponible para este atractivo turístico.";

        const tarjeta = document.createElement("article");
        tarjeta.className = "tarjeta";

        const img = document.createElement("img");
        img.className = "tarjeta-img";
        img.src = imagenUrl;
        img.alt = atraccion.name;
        img.loading = "lazy";
        img.onerror = function () {
            this.onerror = null;
            this.src = imagenRespaldoActual;
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