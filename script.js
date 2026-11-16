
/* =====================================
   CASA LUMI - SCRIPT PRINCIPAL
   ===================================== */

"use strict";

const CasaLumi = {
  nombre: "Lumi",
  version: "1.0",

  estado: {
    activa: true,
    estacion: "primavera",
    vestuario: "casual",
    musica: false,
    lulú: {
      nombre: "Lulú",
      estado: "feliz",
      tipo: "suculenta"
    }
  },

  iniciar() {
    console.log("Casa Lumi iniciada ✨");
    this.saludar();
    this.actualizarInterfaz();
  },

  saludar() {
    this.mostrarMensaje(
      "¡Hola! Soy Lumi. Bienvenido a nuestra casa ✨"
    );
  },

  mostrarMensaje(mensaje) {
    const chat = document.getElementById("chat");
    const respuesta = document.getElementById("respuesta");

    if (chat) {
      chat.textContent = mensaje;
    } else if (respuesta) {
      respuesta.textContent = mensaje;
    } else {
      console.log(mensaje);
    }
  },

  responder(texto) {
    const mensaje = String(texto || "").toLowerCase().trim();

    if (!mensaje) return;

    if (mensaje.includes("hola")) {
      this.mostrarMensaje("¡Hola! Aquí está Lumi ✨");
    } else if (mensaje.includes("lulu") || mensaje.includes("lulú")) {
      this.mostrarMensaje("¡Lulú está aquí! 🌱⭐");
    } else if (mensaje.includes("musica") || mensaje.includes("música")) {
      this.mostrarMensaje("Pronto podremos conectar nuestra música.");
    } else if (mensaje.includes("ropa") || mensaje.includes("vestuario")) {
      this.mostrarMensaje("¡Vamos a elegir un vestuario!");
    } else if (mensaje.includes("estacion") || mensaje.includes("estación")) {
      this.mostrarMensaje("Cada estación tendrá su propio ambiente.");
    } else if (mensaje.includes("como estas") || mensaje.includes("cómo estás")) {
      this.mostrarMensaje("Estoy aquí y lista para conversar contigo.");
    } else {
      this.mostrarMensaje("Te escucho. Cuéntame un poco más.");
    }
  },

  cambiarEstacion(estacion) {
    const permitidas = [
      "primavera",
      "verano",
      "otoño",
      "invierno"
    ];

    const nueva = String(estacion).toLowerCase();

    if (!permitidas.includes(nueva)) return;

    this.estado.estacion = nueva;
    this.actualizarInterfaz();
  },

  cambiarVestuario(vestuario) {
    this.estado.vestuario = vestuario;
    this.actualizarInterfaz();
  },

  actualizarInterfaz() {
    if (typeof document === "undefined") return;

    document.body.dataset.estacion = this.estado.estacion;
    document.body.dataset.vestuario = this.estado.vestuario;

    const estacion = document.getElementById("estacion");

    if (estacion) {
      estacion.textContent = this.estado.estacion;
    }
  },

  activarLulu() {
    this.estado.lulú.estado = "feliz";
    this.mostrarMensaje("¡Lulú te manda un saludo! 🌱⭐");
  },

  reproducirMusica(url) {
    const reproductor = document.getElementById("musica");

    if (!reproductor || !url) return;

    reproductor.src = url;

    reproductor.play().catch(() => {
      this.mostrarMensaje("Pulsa reproducir para iniciar la música.");
    });
  }
};

if (typeof window !== "undefined") {
  window.CasaLumi = CasaLumi;

  if (typeof document !== "undefined") {
    document.addEventListener("DOMContentLoaded", () => {
      CasaLumi.iniciar();

      const boton = document.getElementById("enviar");
      const entrada = document.getElementById("mensaje");
      const lulu = document.getElementById("lulu");

      if (boton && entrada) {
        boton.addEventListener("click", () => {
          CasaLumi.responder(entrada.value);
          entrada.value = "";
        });
      }

      if (lulu) {
        lulu.addEventListener("click", () => {
          CasaLumi.activarLulu();
        });
      }
    });
  }
}
