/* ===================================
   PEDRO CLEAN MARKET
   SCRIPT.JS - PARTE 1
=================================== */

/* FILTRO DE PRODUCTOS */

const botones = document.querySelectorAll(".categoria");
const productos = document.querySelectorAll(".producto");

botones.forEach(boton => {

    boton.addEventListener("click", () => {

        botones.forEach(btn => btn.classList.remove("activo"));
        boton.classList.add("activo");

        const categoria = boton.dataset.categoria;

        productos.forEach(producto => {

            if (
                categoria === "todos" ||
                producto.dataset.categoria === categoria
            ) {

                producto.style.display = "block";

            } else {

                producto.style.display = "none";

            }

        });

    });

});


/* BOTONES DE WHATSAPP */

const botonesWhatsapp = document.querySelectorAll(".whatsapp");

botonesWhatsapp.forEach(boton => {

    boton.addEventListener("click", function(e){

        e.preventDefault();

        const producto = this.dataset.producto;

        const numero = "5491171005652";

        const mensaje =
        `Hola 👋, me interesa el producto: ${producto}`;

        window.open(

        `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`,

        "_blank"

        );

    });

});/* ===================================
   PEDRO CLEAN MARKET
   SCRIPT.JS - PARTE 2
=================================== */

/* EFECTO AL HACER SCROLL */

const elementos = document.querySelectorAll(
".beneficio, .producto"
);

const observer = new IntersectionObserver((entradas)=>{

    entradas.forEach((entrada)=>{

        if(entrada.isIntersecting){

            entrada.target.classList.add("visible");

        }

    });

},{
    threshold:0.15
});

elementos.forEach((elemento)=>{

    elemento.classList.add("oculto");

    observer.observe(elemento);

});


/* HEADER */

const header = document.querySelector("header");

window.addEventListener("scroll",()=>{

    if(window.scrollY > 50){

        header.style.boxShadow =
        "0 10px 30px rgba(0,0,0,.10)";

    }else{

        header.style.boxShadow =
        "0 2px 10px rgba(0,0,0,.08)";

    }

});


/* BOTÓN SUBIR */

const subir = document.createElement("button");

subir.innerHTML = "⬆";

subir.className = "subir";

document.body.appendChild(subir);

window.addEventListener("scroll",()=>{

    if(window.scrollY > 500){

        subir.style.display="flex";

    }else{

        subir.style.display="none";

    }

});

subir.addEventListener("click",()=>{

    window.scrollTo({

        top:0,

        behavior:"smooth"

    });

});window.addEventListener("load",()=>{

    const loader = document.getElementById("loader");

    loader.style.display="none";

});
