import Anuncio_Auto from "./auto.anuncio.js";
const url = "http://localhost:3000/anuncios";

function armarAnuncios(
  transaccion,
  titulo,
  descripcion,
  precio,
  kms,
  potencia,
  puertas,
  caracteristicas
) {
  const card = document.createElement("div");
  card.classList.add("card");
  const cardHeader = document.createElement("div");
  cardHeader.classList.add("card-header");
  const h1 = document.createElement("h2");
  h1.classList.add("card-title");
  h1.textContent = titulo.toUpperCase();

  const divDescripcion = document.createElement("card--descripcion");
  divDescripcion.classList.add("card-text");
  divDescripcion.textContent = descripcion;
  divDescripcion.appendChild(document.createElement("br"));

  const divPrecio = document.createElement("card--precio");
  divPrecio.classList.add("card-text");
  divPrecio.textContent = "Precio: $" + precio.toString();
  divPrecio.appendChild(document.createElement("br"));

  const divPotencia = document.createElement("card--potencia");
  divPotencia.classList.add("card-text");
  divPotencia.textContent = "Potencia: " + potencia.toString();
  divPotencia.appendChild(document.createElement("br"));

  const divKms = document.createElement("card--kms");
  divKms.classList.add("card-text");
  divKms.textContent = "Kilometros: " + kms.toString();
  divKms.appendChild(document.createElement("br"));

  const divPuertas = document.createElement("card--puertas");
  divPuertas.classList.add("card-text");
  divPuertas.textContent = "Puertas : " + puertas.toString();
  divPuertas.appendChild(document.createElement("br"));

  const divTransaccion = document.createElement("card--transaccion");
  divTransaccion.classList.add("card-text");
  divTransaccion.textContent = transaccion;
  divTransaccion.appendChild(document.createElement("br"));

  const divBtn = document.createElement("button");
  divBtn.classList.add("card-button");
  divBtn.textContent = "Ver vehiculo";
  divBtn.appendChild(document.createElement("br"));

  cardHeader.appendChild(h1);
  card.appendChild(divTransaccion);
  card.appendChild(cardHeader);
  card.appendChild(divDescripcion);
  card.appendChild(divPrecio);
  card.appendChild(divKms);
  card.appendChild(divPotencia);
  card.appendChild(divPuertas);
  if (caracteristicas != null && caracteristicas.length > 0) {
    const divCaracteristicas = document.createElement("card--car");
    divCaracteristicas.classList.add("card-text");
    divCaracteristicas.textContent = "Caracteristicas : " + caracteristicas;
    divCaracteristicas.appendChild(document.createElement("br"));
    card.appendChild(divCaracteristicas);
  }
  card.appendChild(divBtn);

  return card;
}

  cargarAnuncios();

  function cargarAnuncios(){
    const xhr = new XMLHttpRequest();
    xhr.addEventListener("readystatechange", () => {
      if (xhr.readyState == 4) {
        if (xhr.status >= 200 && xhr.status < 300) {
          const anuncios = JSON.parse(xhr.responseText);
          if (!anuncios.length > 0)
            console.error("No hay anuncios!");

          anuncios.forEach((element) => {
            document
              .getElementById("Container")
              .appendChild(
                armarAnuncios(
                  element.transaccion.toUpperCase(),
                  element.titulo,
                  element.descripcion,
                  element.precio,
                  element.kilometros,
                  element.potencia,
                  element.puertas,
                  element.caracteristicas
                )
              );
          });
        } else {
          console.error(xhr.status, xhr.statusText);
        }
      }
    });
    xhr.open("GET", url,true);
    xhr.setRequestHeader('Content-type','application/json;charset=utf8');
    xhr.send();
  }