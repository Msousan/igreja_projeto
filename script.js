// script.js - Versão Final Completa
document.addEventListener("DOMContentLoaded", () => {
  console.log("JS carregado! Iniciando event listeners...");

  const links = document.querySelectorAll("nav a[data-tab]");
  const tabs = document.querySelectorAll(".tab-content");

  // ===========================
  // TROCA DE ABAS
  // ===========================
  links.forEach(link => {
    link.addEventListener("click", e => {
      e.preventDefault();
      links.forEach(l => l.classList.remove("active"));
      tabs.forEach(tab => tab.classList.remove("active"));
      link.classList.add("active");
      const target = link.dataset.tab;
      const targetTab = document.getElementById(target);
      if (targetTab) {
        targetTab.classList.add("active");
        targetTab.scrollIntoView({ behavior: "smooth" });
      }
    });
  });

  // ===========================
  // FORMULÁRIO
  // ===========================
  const form = document.getElementById("formIntegracao");
  const mensagem = document.getElementById("mensagem");

  if (form && mensagem) {
    form.addEventListener("submit", e => {
      e.preventDefault();

      const nome = document.getElementById("nome").value.trim();
      const email = document.getElementById("email").value.trim();
      const telefone = document.getElementById("telefone").value.trim();

      if (!nome || !email || !telefone) {
        mensagem.textContent = "Por favor, preencha todos os campos!";
        mensagem.style.color = "red";
        return;
      }

      try {
        let registros = JSON.parse(localStorage.getItem("membros")) || [];
        const novoRegistro = {
          id: Date.now().toString(),
          nome,
          email,
          telefone,
          data: new Date().toLocaleDateString()
        };
        registros.push(novoRegistro);
        localStorage.setItem("membros", JSON.stringify(registros));

        mensagem.textContent = "Cadastro realizado com sucesso! Seus dados foram salvos.";
        mensagem.style.color = "green";
        form.reset();
        mensagem.scrollIntoView({ behavior: "smooth" });
      } catch (error) {
        mensagem.textContent = "Erro ao salvar dados. Tente novamente.";
        mensagem.style.color = "red";
        console.error("Erro no localStorage:", error);
      }
    });
  }

  // ===========================
  // ADMIN - ACESSO
  // ===========================
  let segredo = "";
  let timeoutId;

  document.addEventListener("keydown", e => {
    if (e.target.tagName === "INPUT") return;

    segredo += e.key.toLowerCase();
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => segredo = "", 2000);

    if (segredo.includes("admin123")) {
      segredo = "";
      clearTimeout(timeoutId);
      mostrarAdmin();
    }
  });

  if (window.location.search.includes("admin=true")) {
    mostrarAdmin();
  }

  // ===========================
  // FUNÇÃO MOSTRAR ADMIN
  // ===========================
  function mostrarAdmin() {
    tabs.forEach(tab => tab.classList.remove("active"));
    const adminTab = document.getElementById("admin");
    if (!adminTab) return console.error("Seção #admin não encontrada!");

    adminTab.classList.add("active");
    adminTab.scrollIntoView({ behavior: "smooth" });

    // Mensagem
    let adminMensagem = document.getElementById("adminMensagem");
    if (!adminMensagem) {
      adminMensagem = document.createElement("div");
      adminMensagem.id = "adminMensagem";
      adminTab.appendChild(adminMensagem);
    }
    adminMensagem.style.display = "none";

    // Seleciona o tbody
    const tbody = document.querySelector("#tabelaAdmin tbody");
    if (!tbody) return;

    // Limpa tabela para evitar duplicação
    tbody.innerHTML = "";

    try {
      const registros = JSON.parse(localStorage.getItem("membros")) || [];

      if (registros.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 20px;">Nenhum cadastro encontrado.</td></tr>';
        return;
      }

      registros.forEach(r => {
        const tr = document.createElement("tr");
        tr.setAttribute("data-id", r.id); // garante que cada linha tem ID
        tr.innerHTML = `
          <td data-label="Nome">${r.nome}</td>
          <td data-label="Email">${r.email}</td>
          <td data-label="Telefone">${r.telefone}</td>
          <td data-label="Data">${r.data || 'N/A'}</td>
          <td data-label="Ações">
            <button class="btn-excluir">
              <i class="fas fa-trash"></i> Excluir
            </button>
          </td>
        `;
        tbody.appendChild(tr);
      });
    } catch (error) {
      console.error("Erro ao carregar admin:", error);
      tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 20px;">Erro ao carregar dados.</td></tr>';
    }
  }

  // ===========================
  // DELEGAÇÃO DE EVENTO PARA EXCLUIR
  // ===========================
  const tbodyAdmin = document.querySelector("#tabelaAdmin tbody");
  tbodyAdmin.addEventListener("click", e => {
    const btn = e.target.closest(".btn-excluir");
    if (!btn) return;

    const tr = btn.closest("tr");
    const id = tr.dataset.id;
    const adminMensagem = document.getElementById("adminMensagem");

    excluirRegistroDireto(id, tr, adminMensagem);
  });

  // ===========================
  // FUNÇÃO EXCLUIR DIRETO
  // ===========================
  function excluirRegistroDireto(id, tr, adminMensagem) {
    if (!confirm("Tem certeza que deseja excluir este cadastro? Esta ação não pode ser desfeita.")) return;

    try {
      let registros = JSON.parse(localStorage.getItem("membros")) || [];
      registros = registros.filter(r => r.id !== id);
      localStorage.setItem("membros", JSON.stringify(registros));

      // Remove a linha da tabela diretamente
      tr.remove();

      // Se não houver mais linhas, mostra mensagem
      const tbody = document.querySelector("#tabelaAdmin tbody");
      if (tbody.children.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 20px;">Nenhum cadastro encontrado.</td></tr>';
      }

      // Mensagem de sucesso
      adminMensagem.textContent = "Registro excluído com sucesso!";
      adminMensagem.className = "sucesso";
      adminMensagem.style.display = "block";
      adminMensagem.scrollIntoView({ behavior: "smooth" });

      setTimeout(() => adminMensagem.style.display = "none", 3000);

      console.log("Registro excluído:", id);
    } catch (error) {
      adminMensagem.textContent = "Erro ao excluir registro. Tente novamente.";
      adminMensagem.className = "erro";
      adminMensagem.style.display = "block";
      console.error("Erro ao excluir:", error);
    }
  }
});
