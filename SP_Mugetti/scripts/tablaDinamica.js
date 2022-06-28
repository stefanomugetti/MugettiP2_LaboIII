function crearTabla(vec) {
    const table = document.createElement("table");
    table.appendChild(crearCabecera(vec[0]));
    table.appendChild(crearCuerpo(vec));
  
    return table;
  }
  
  function crearCabecera(obj) {
    const thead = document.createElement("thead");
    const tr = document.createElement("tr");
  
    tr.setAttribute("class","cabecera");
    for (const key in obj) {
      if (key !== "id") {
        const th = document.createElement("th");
        th.textContent = key;
        tr.appendChild(th);
      }
    }
    thead.appendChild(tr);
    return thead;
  }
  
  function crearCuerpo(vec) {
    const tbody = document.createElement("tbody");
    vec.forEach((elemento, index) => {
      const tr = document.createElement("tr");
     // tr.classList.add(index % 2 ? "colorPar" : "colorImpar");
     tr.classList.add("colorImpar");
      tr.classList.add("pointer");
      for (const key in elemento) {
        if (key === "id") {
          tr.setAttribute("data-id", elemento[key].toString()); //ATRIBUTO INVISIBLE PARA REFERENCIAR
        } else {
          const td = document.createElement("td");
          td.textContent = elemento[key].toString();
          tr.appendChild(td);
        }
      }
      tbody.appendChild(tr);
    });
    return tbody;
  }
  
  //document.body.appendChild(crearTabla(empleados));
  //document.querySelector(".table-container").appendChild(crearTabla(empleados));
  export default crearTabla;
