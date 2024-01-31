let lastScrollTop = 0;
const navbar = document.getElementById("navbar");
const navbarHeight = navbar.clientHeight;


window.addEventListener("scroll", function() {
  let currentScroll = window.pageYOffset || document.documentElement.scrollTop;
  if (currentScroll > lastScrollTop) {
    // Scroll para baixo
    navbar.style.top = `-${navbarHeight}px`; // Move a barra de navegação para cima da tela (fora da visualização)
  } else {
    // Scroll para cima
    navbar.style.top = "0"; // Mostra a barra de navegação
  }
  lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
}, false);

function changeBackground() {
  var checkbox = document.getElementById("dark");
  var body = document.body;
  
  // Verifica o estado do checkbox
  if (checkbox.checked) {
    body.style.backgroundColor = "#e7e7e7"; // Altere para a cor desejada
  } else {
    body.style.backgroundColor = "#181818"; // Volta à cor original ou substitua pela cor desejada quando desmarcado
  }
}

// Adiciona o evento onchange ao carregar a página
document.addEventListener("DOMContentLoaded", function() {
  // Chama a função para definir a cor de fundo inicial
  changeBackground();
  
  // Adiciona o evento onchange ao checkbox
  document.getElementById("dark").addEventListener("change", changeBackground);
});

window.sr = ScrollReveal({ reset: true });
sr.reveal('.sumir',{duration: 2000});


$(document).ready(function() {
  $("a").on("click", function (event) {
      if (this.hash !== "") {
          event.preventDefault();

          const hash = this.hash;
          let offset = $(hash).offset().top;

          // Ajuste do deslocamento para considerar a altura da barra de navegação
          offset -= $("#navbar").outerHeight();

          $("html, body").animate(
              {
                  scrollTop: offset
              },
              800
          );
      }
  });
});
