// js/galeria.js:
const API_BASE_URL =
  window.location.hostname === "localhost"
    ? "http://localhost:3000"
    : "https://venezuela-api.onrender.com";

const galeriaContainer = document.getElementById("galeriaContainer");
const modalTitulo = document.getElementById("modalTitulo");
const modalContenido = document.getElementById("modalContenido");
const loadingIndicator = document.getElementById("loadingIndicator");

// Función para mostrar el indicador de carga
function mostrarCarga() {
  loadingIndicator.style.display = "block";
  galeriaContainer.innerHTML = ""; // Limpiar el contenedor si hay contenido previo
}

// Función para ocultar el indicador de carga
function ocultarCarga() {
  loadingIndicator.style.display = "none";
}

// Mostrar carga inicial
mostrarCarga();

fetch(API_BASE_URL) // Realizamos la solicitud GET a la ruta de sitios
  .then((res) => {
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    return res.json();
  })
  .then((data) => {
    ocultarCarga();
    data.forEach((lugar) => {
      const card = document.createElement("div");
      card.className = "col-lg-3 col-md-4 col-sm-6 mb-4";
      card.setAttribute("data-aos", "fade-up");
      card.innerHTML = `
        <div class="card h-100 cursor-pointer" data-id="${lugar.id}" data-bs-toggle="modal" data-bs-target="#detalleModal">
          <img src="${lugar.imagen}" class="card-img-top" alt="${lugar.nombre}">
          <div class="card-body">
            <h5 class="card-title">${lugar.nombre}</h5>
            <p class="card-text">${lugar.ubicacion}</p>
          </div>
        </div>
      `;
      galeriaContainer.appendChild(card);
    });

    // Asignamos el evento de click en cada tarjeta
    document.querySelectorAll(".card").forEach((card) => {
      card.addEventListener("click", () => {
        const id = card.getAttribute("data-id");
        // Hacemos una nueva solicitud para obtener los detalles del lugar
        fetch(`${API_BASE_URL}/sitios/${id}`)
          .then((res) => res.json())
          .then((lugar) => {
            modalTitulo.textContent = lugar.nombre;
            modalContenido.innerHTML = `
              <img src="${lugar.imagen}" class="img-fluid mb-3" alt="${
              lugar.nombre
            }">
              <p><strong>Ubicación:</strong> ${lugar.ubicacion}</p>
              <p><strong>Atractivo:</strong> ${lugar.atractivo}</p>
              ${
                lugar.caracteristicas
                  ? `<ul>${lugar.caracteristicas
                      .map((c) => `<li>${c}</li>`)
                      .join("")}</ul>`
                  : "<p>No hay características disponibles.</p>"
              }
            `;
          })
          .catch((error) => {
            modalTitulo.textContent = "Error";
            modalContenido.textContent =
              "No se pudieron cargar los detalles del lugar.";
          });
      });
    });

    // Inicialización de AOS después de cargar los elementos
    AOS.init({
      duration: 2000,
      once: true,
    });
  })
  .catch((error) => {
    ocultarCarga();
    console.error("Error al cargar los datos:", error);
    galeriaContainer.innerHTML = `<div class="alert alert-danger" role="alert">
      Error al cargar la galería. Por favor, intenta nuevamente más tarde.
    </div>`;
  });
