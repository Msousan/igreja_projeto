// Script para trocar as abas
document.addEventListener("DOMContentLoaded", () => {
  const links = document.querySelectorAll("nav a");
  const tabs = document.querySelectorAll(".tab-content");

  links.forEach(link => {
    link.addEventListener("click", e => {
      e.preventDefault();

      // Remove active de todos os links
      links.forEach(l => l.classList.remove("active"));
      // Esconde todas as abas
      tabs.forEach(tab => tab.classList.remove("active"));

      // Ativa o link clicado
      link.classList.add("active");

      // Mostra a aba correspondente
      const target = link.getAttribute("data-tab");
      document.getElementById(target).classList.add("active");
    });
  });
});
