import {Anuncio}  from "./anuncios.js"; 
class Anuncio_Auto extends Anuncio {
    constructor(titulo, transaccion,descripcion, precio, puertas,potencia,kilometros,caracteristicas) {
      super(titulo,transaccion,descripcion,precio);
      this.puertas = puertas;
      this.potencia = potencia;
      this.kilometros = kilometros;
      this.caracteristicas = caracteristicas;
    }
  }
  
  export default Anuncio_Auto