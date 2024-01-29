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
