"use strict";
// Cambia los archivos en assets/ por PNG o WebP transparentes cuando estén listos.
const ROPAS = [
  {id:"invierno",nombre:"Invierno",emoji:"❄️",descripcion:"Abrigo, bufanda y botas para el frío."},
  {id:"verano",nombre:"Verano",emoji:"☀️",descripcion:"Ropa ligera para días soleados."},
  {id:"primavera",nombre:"Primavera",emoji:"🌸",descripcion:"Vestido violeta con flores."},
  {id:"otono",nombre:"Otoño",emoji:"🍂",descripcion:"Suéter y falda de cuadros."},
  {id:"navidad",nombre:"Navidad",emoji:"🎄",descripcion:"Conjunto navideño rojo."},
  {id:"fiestas-patrias",nombre:"18 de Septiembre",emoji:"🇨🇱",descripcion:"Vestido de Fiestas Patrias de Chile."},
  {id:"ano-nuevo",nombre:"Año Nuevo",emoji:"✨",descripcion:"Vestido de celebración con destellos."},
  {id:"san-valentin",nombre:"San Valentín",emoji:"💗",descripcion:"Suéter rojo con corazón."},
  {id:"pijama-verano",nombre:"Pijama Verano",emoji:"🌙",descripcion:"Pijama liviano y pantuflas."},
  {id:"pijama-invierno",nombre:"Pijama Invierno",emoji:"🛌",descripcion:"Pijama abrigado con capucha."}
];
const img=document.getElementById("lumi-imagen");
const titulo=document.getElementById("lumi-titulo");
const descripcion=document.getElementById("lumi-descripcion");
const opciones=document.getElementById("lumi-opciones");
const CLAVE="casaLumi.vestuario2d";
function elegirRopa(id){
  const ropa=ROPAS.find(r=>r.id===id)||ROPAS[0];
  // Se usan imágenes de vista previa recortadas de la referencia proporcionada.
  img.src=`assets/${ropa.id}.webp`;
  img.alt=`Lumi con ropa de ${ropa.nombre}`;
  img.style.animation="none";void img.offsetWidth;img.style.animation="";
  titulo.textContent=ropa.nombre;descripcion.textContent=ropa.descripcion;
  for(const boton of opciones.querySelectorAll("button"))boton.setAttribute("aria-pressed",String(boton.dataset.ropa===ropa.id));
  try{localStorage.setItem(CLAVE,ropa.id)}catch(e){}
}
ROPAS.forEach(ropa=>{
  const boton=document.createElement("button");boton.type="button";
  boton.dataset.ropa=ropa.id;boton.textContent=`${ropa.emoji} ${ropa.nombre}`;
  boton.addEventListener("click",()=>elegirRopa(ropa.id));opciones.appendChild(boton);
});
let guardada="invierno";try{guardada=localStorage.getItem(CLAVE)||guardada}catch(e){}
elegirRopa(guardada);
