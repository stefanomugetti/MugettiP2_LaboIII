import crearTabla from "./tablaDinamica.js";
import Anuncio_Auto from "./auto.anuncio.js";
const url = "http://localhost:3000/anuncios";

//#region AGREGAR

const $frmAnuncio = document.forms[0];

$frmAnuncio.addEventListener("submit", (e) => {
  const frm = e.target;
  e.preventDefault();

  let titulo = frm.txtTitulo.value;
  let descripcion = frm.txtDescripcion.value;
  let precio = parseFloat(frm.txtPrecio.value);
  let potencia = parseInt(frm.txtPotencia.value);
  let kms = parseInt(frm.txtKms.value);
  let puertas = parseInt(frm.txtPuertas.value);
  let caracteristicas = new Array();

  let transaccionInt = "Alquiler";
  if (document.formulario.transaccion[0].checked) {
    transaccionInt = "Venta";
  }

  if (frm.chkTurbo.checked) {
    caracteristicas.push("Turbo");
  }
  if (frm.chkAleron.checked) {
    caracteristicas.push("Aleron");
  }
  if (frm.chkNeon.checked) {
    caracteristicas.push("Neon");
  }

  if (precio > 0 && potencia > 0 && kms > 0 && puertas > 0) {
    const xhr = new XMLHttpRequest();

    xhr.addEventListener("readystatechange", () => {
      if (xhr.readyState == 4) {
        if (xhr.status >= 200 && xhr.status < 300) {
          alert("El anuncio fue agregado");
        } else {
          alert(
            "El anuncio no fue agregado. Error en la solicitud al servidor."
          );
        }
        eliminarSpinner();
      } else {
        cargarSpinner();
      }
    });
    let newAnuncio = new Anuncio_Auto(
      titulo,
      transaccionInt,
      descripcion,
      precio,
      puertas,
      potencia,
      kms,
      caracteristicas
    );
    xhr.open("POST", url);
    xhr.setRequestHeader("Content-type", "application/json;charset=utf8");
    xhr.send(JSON.stringify(newAnuncio));
  } else {
    swal("Atencion", "Los valores numericos deben ser mayores a 0.", "error");
  }
});
//#endregion
//#region MAPEO

function MapearObjetoAControl(id) {
  const xhr = new XMLHttpRequest();
  xhr.addEventListener("readystatechange", () => {
    if (xhr.readyState == 4) {
      if (xhr.status >= 200 && xhr.status < 300) {
        const anuncios = JSON.parse(xhr.responseText);
        anuncios.forEach((element) => {
          if (element.id == id) {
            document.getElementById("txtTitulo").value = element.titulo;
            document.getElementById("txtDescripcion").value = element.descripcion;
            document.getElementById("txtPrecio").value = element.precio;
            document.getElementById("txtPuertas").value = element.puertas;
            document.getElementById("txtPotencia").value = element.potencia;
            document.getElementById("txtKms").value = element.kilometros;
            document.formulario.transaccion[0].checked = true;
            if (element.transaccion == "Alquiler") {
              document.formulario.transaccion[1].checked = true;
            }
            const chkNeon = document.getElementById("chkNeon");
            const chkAleron = document.getElementById("chkAleron");
            const chkTurbo = document.getElementById("chkTurbo");

            chkNeon.checked = false;
            chkAleron.checked = false;
            chkTurbo.checked = false;

            if (element.caracteristicas != null) {
              if (element.caracteristicas.includes("Neon")) {
                chkNeon.checked = true;
              }
              if (element.caracteristicas.includes("Aleron")) {
                chkAleron.checked = true;
              }
              if (element.caracteristicas.includes("Turbo")) {
                chkTurbo.checked = true;
              }
            }
            document.getElementById("botonera").removeAttribute("Hidden");
            localStorage.setItem("Id", id);
            return;
          }
        });
      } else {
        console.error(xhr.status, xhr.statusText);
      }
      eliminarSpinner();
    } else {
      document.getElementById("botonera").setAttribute("Hidden","true");
      cargarSpinner();
    }
  });
  xhr.open("GET", url, true);
  xhr.setRequestHeader("Content-type", "application/json;charset=utf8");
  xhr.send();
}

//#endregion
//#region FUNCIONALIDAD TABLA
//const botones = document.getElementById("botonera");
document.getElementById("table-container").addEventListener("click", (e) => {
  if (e.target.matches("tr td")) {
    MapearObjetoAControl(e.target.parentElement.dataset.id);
    //botones.removeAttribute("Hidden");
  }
});
function allAnunciosToTable() {
  const xhr = new XMLHttpRequest();
  xhr.addEventListener("readystatechange", () => {
    if (xhr.readyState == 4) {
      if (xhr.status >= 200 && xhr.status < 300) {
        const anuncios = JSON.parse(xhr.responseText);
        limpiarTabla();
        document
          .querySelector(".table-container")
          .appendChild(crearTabla(anuncios));
        document.querySelector(".table-container").removeAttribute("Hidden");
      } else {
        console.error("No hay datos en db.json");
      }
      eliminarSpinner();
    } else {
      cargarSpinner();
    }
  });

  xhr.open("GET", url, true);
  xhr.setRequestHeader("Content-type", "application/json;charset=utf8");
  xhr.send();
}

function cargarTablaCustom(array) {
  document.querySelector(".table-container").firstElementChild.remove();
  document.querySelector(".table-container").appendChild(crearTabla(array));
}

function limpiarTabla() {
  const container = document.querySelector(".table-container");
  while (container.children.length > 0) {
    container.removeChild(container.firstElementChild);
  }
}


function limpiarFormulario() {
  //SIEMPRE QUE OCURRA ALGUNA ACCION DEL ABM SE VA A LIMPIAR LOS CAMPOS Y DESAPARECE LA BOTONERA
  const botones = document.getElementById("botonera");
  botones.setAttribute("Hidden", true);

  document.getElementById("txtTitulo").value = "";
  document.getElementById("txtDescripcion").value = "";
  document.getElementById("txtPrecio").value = "";
  document.getElementById("txtPuertas").value = "";
  document.getElementById("txtKms").value = "";
  document.getElementById("txtPotencia").value = "";

  document.getElementById("chkTurbo").checked = false;
  document.getElementById("chkAleron").checked = false;
  document.getElementById("chkNeon").checked = false;
}
//#endregion
//#region CANCELAR
let btnCancelar = document.getElementById("btnCancelar");
btnCancelar.addEventListener("click", (e) => {
  cancelar();
});
function cancelar() {
  limpiarFormulario();
  localStorage.removeItem("Id");
}
//#endregion
//#region ELIMINAR
let btnEliminar = document.getElementById("btnEliminar");

btnEliminar.addEventListener("click", (e) => {
  swal({
    title: "¿Esta Seguro?",
    text: "No podra recuperar el anuncio",
    icon: "warning",
    buttons: true,
    dangerMode: true,
  }).then((willDelete) => {
    if (willDelete) {
      eliminar();
    }
  });
});

function eliminar() {
  let id = localStorage.getItem("Id");
  if (!parseInt(id) > 0) {
    return;
  }
  const xhr = new XMLHttpRequest();
  xhr.addEventListener("readystatechange", () => {
    if (xhr.readyState == 4) {
      if (xhr.status >= 200 && xhr.status < 300) {
        alert("El anuncio fue eliminado");
      } else {
        console.error(xhr.status, xhr.statusText);
      }
      eliminarSpinner();
    } else {
      cargarSpinner();
    }
  });
  xhr.open("DELETE", url + "/" + id, true);
  xhr.setRequestHeader("Content-type", "application/json;charset=utf8");
  xhr.send(null);
}

//#endregion
//#region MODIFICAR
let btnModificar = document.getElementById("btnModificar");

btnModificar.addEventListener("click", (e) => {
  modificar();
});

function modificar() {
  let id = localStorage.getItem("Id");
  if (!parseInt(id) > 0) {
    return;
  }
  const xhr = new XMLHttpRequest();
  xhr.addEventListener("readystatechange", () => {
    if (xhr.readyState == 4) {
      if (xhr.status >= 200 && xhr.status < 300) {
        const anuncio = JSON.parse(xhr.responseText);
        modificarAnuncio(anuncio)
          .then(() => {
            alert("Anuncio modificado");
            eliminarSpinner();
          })
          .catch(() => {
            alert("Error, Datos invalidos.");
          });
      } else {
        console.error(xhr.status, xhr.statusText);
      }
    } else {
      cargarSpinner();
    }
  });
  xhr.open("GET", url + "/" + id, true);
  xhr.setRequestHeader("Content-type", "application/json;charset=utf8");
  xhr.send();
}

function modificarAnuncio(anuncio) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      let titulo = document.getElementById("txtTitulo").value;
      let descripcion = document.getElementById("txtDescripcion").value;
      let precio = document.getElementById("txtPrecio").value;
      let potencia = document.getElementById("txtPotencia").value;
      let kms = document.getElementById("txtKms").value;
      let puertas = document.getElementById("txtPuertas").value;
      let caracteristicas = new Array();
      let transaccion = "Alquiler";
      if (document.formulario.transaccion[0].checked) {
        transaccion = "Venta";
      }

      if (document.getElementById("chkTurbo").checked) {
        caracteristicas.push("Turbo");
      }
      if (document.getElementById("chkAleron").checked) {
        caracteristicas.push("Aleron");
      }
      if (document.getElementById("chkNeon").checked) {
        caracteristicas.push("Neon");
      }

      if (precio > 0 && potencia > 0 && kms > 0 && puertas > 0) {
        const xhr = new XMLHttpRequest();
        xhr.addEventListener("readystatechange", () => {
          if (xhr.readyState == 4) {
            if (xhr.status >= 200 && xhr.status < 300) {
              console.log("El anuncio ya fue modificado!");
            } else {
              console.error(xhr.status, xhr.statusText);
            }
            eliminarSpinner();
          } else {
            cargarSpinner();
          }
        });
        anuncio.titulo = titulo;
        anuncio.descripcion = descripcion;
        anuncio.precio = precio;
        anuncio.puertas = puertas;
        anuncio.kilometros = kms;
        anuncio.potencia = potencia;
        anuncio.transaccion = transaccion;
        anuncio.caracteristicas = caracteristicas;
        xhr.open("PUT", url + "/" + anuncio.id, true);
        xhr.setRequestHeader("Content-type", "application/json;charset=utf8");
        xhr.send(JSON.stringify(anuncio));
        resolve(true);
      }
      reject(false);
    }, 1500);
  });
}
//#endregion
//#region FILTRADOS
cargarPromedioInicial();
function cargarPromedioInicial() {
  const txtPromedio = document.getElementById("txtPromedio");
  const xhr = new XMLHttpRequest();
  xhr.addEventListener("readystatechange", () => {
    if (xhr.readyState == 4) {
      if (xhr.status >= 200 && xhr.status < 300) {
        const anuncios = JSON.parse(xhr.responseText);
        if (!anuncios.length > 0) {
          console.error("No hay datos en la db");
          return;
        }
        let total = 0;
        anuncios.map(({ precio }) => (total += parseInt(precio)));
        const resultado = total / anuncios.length;
        txtPromedio.value = parseInt(resultado);
      } else {
        console.error(xhr.status, xhr.statusText);
      }
    } else {
    }
  });
  xhr.open("GET", url, false);
  xhr.setRequestHeader("Content-type", "application/json;charset=utf8");
  xhr.send();
}

const btnBuscar = document.getElementById("btnBuscar");
btnBuscar.addEventListener("click", (e) => {
  const xhr = new XMLHttpRequest();
  xhr.addEventListener("readystatechange", () => {
    if (xhr.readyState == 4) {
      if (xhr.status >= 200 && xhr.status < 300) {
        const anuncios = JSON.parse(xhr.responseText);
        if (!anuncios.length > 0) {
          console.error("No hay datos en la db");
          return;
        }
        document.getElementById("checkbox-potencia").checked=true;
        document.getElementById("checkbox-puertas").checked=true;
        document.getElementById("checkbox-kilometros").checked=true;
        document.getElementById("checkbox-titulo").checked=true;
        document.getElementById("checkbox-descripcion").checked=true;
        document.getElementById("checkbox-precio").checked=true;
        document.getElementById("checkbox-tipo").checked=true;
        document.getElementById("checkbox-caracteristicas").checked=true;
  
        var transaccion = document.getElementById("cmbTransaccion");
        var txtPromedio = document.getElementById("txtPromedio");
        let total = 0;
        if (transaccion.value == "Todo") {
          anuncios.map(({ precio }) => (total += parseInt(precio)));
          const resultado = total / anuncios.length;
          cargarTablaCustom(anuncios);
          if (parseInt(resultado) > 0){ 
            txtPromedio.value = parseInt(resultado);
          }
          else {
            txtPromedio.value = 0;
          }
        } else if (transaccion.value == "Venta") {
          let anunciosVentas = anuncios.filter(
            (element) => element.transaccion == "Venta"
          );
          anunciosVentas.map(({ precio }) => (total += parseInt(precio)));
          const resultado = total / anunciosVentas.length;
          cargarTablaCustom(anunciosVentas);
          if (parseInt(resultado) > 0){
            txtPromedio.value = parseInt(resultado);
          } 
          else{
            txtPromedio.value = 0;
          } 
        } else if (transaccion.value == "Alquiler") {
          let anunciosAlquiler = anuncios.filter(
            (element) => element.transaccion == "Alquiler"
          );
          let suma = anunciosAlquiler.reduce(
            (suma, element) => suma + parseInt(element.precio),
            0
          );
          anunciosAlquiler.map(({ precio }) => (total += parseInt(precio)));
          const resultado = total / anunciosAlquiler.length;
          cargarTablaCustom(anunciosAlquiler);
          if (parseInt(resultado) > 0) {
            txtPromedio.value = parseInt(resultado);
          }
          else {
            txtPromedio.value = 0;
          }
        }
      } else {
        console.error(xhr.status, xhr.statusText);
      }
      eliminarSpinner();
    } else {
      cargarSpinner();
    }
  });
  xhr.open("GET", url, true);
  xhr.setRequestHeader("Content-type", "application/json;charset=utf8");
  xhr.send();
});

let cajasCheck = document.querySelectorAll(".checkbox-table");
const tablaCreadaDinamicamente = document.getElementById("table-container");
cajasCheck.forEach((checkbox) => {
  checkbox.addEventListener("click", (e) => {
    if (tablaCreadaDinamicamente != null) {
      let arrayCheckboxes = document
        .querySelector(".container-checkbox-campos-tabla")
        .querySelectorAll("input");

      let valueRecibido;
      let estaChequeado;

      for (let i = 0; i < 8; i++) {
        estaChequeado = arrayCheckboxes[i].checked;
        valueRecibido = arrayCheckboxes[i].value;
        columnas(valueRecibido, estaChequeado);
      }
    }
  });
});

function columnas(valueRecibido, estaChequeado) {
  let trsHeader = tablaCreadaDinamicamente
    .querySelector("thead")
    .querySelectorAll("tr");

  if (estaChequeado) {
    trsHeader[0]
      .querySelectorAll("th")
      [valueRecibido].removeAttribute("Hidden");
  } else {
    trsHeader[0]
      .querySelectorAll("th")
      [valueRecibido].setAttribute("Hidden", true);
  }
  let trs = tablaCreadaDinamicamente
    .querySelector("tbody")
    .querySelectorAll("tr");
  for (let i = 0; i < trs.length; i++) {
    if (estaChequeado) {
      trs[i].querySelectorAll("td")[valueRecibido].removeAttribute("Hidden");
    } else {
      trs[i].querySelectorAll("td")[valueRecibido].setAttribute("Hidden", true);
    }
  }
}
//#endregion
//#region SPINNER
const cargarSpinner = () => {
  const divSpinner = document.querySelector(".spinner");
  if (!divSpinner.hasChildNodes()) {
    const spinner = document.createElement("img");
    spinner.setAttribute("src", "./assets/spinner.gif");
    spinner.setAttribute("alt", "icono spinner");
    divSpinner.appendChild(spinner);
  }
};

const eliminarSpinner = () => {
  const divSpinner = document.querySelector(".spinner");
  while (divSpinner.hasChildNodes()) {
    divSpinner.removeChild(divSpinner.firstChild);
  }
};
//#endregion


allAnunciosToTable();