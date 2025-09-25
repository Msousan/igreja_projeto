// script.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc, query, orderBy } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js";

// --- CONFIGURAÇÃO FIREBASE ---
const firebaseConfig = {
  apiKey: "AIzaSyCq0LqGYwgaOcRehEo6-0Rvu5K1cE0AxxM",
  authDomain: "projetoigreja-13bec.firebaseapp.com",
  databaseURL: "https://projetoigreja-13bec-default-rtdb.firebaseio.com",
  projectId: "projetoigreja-13bec",
  storageBucket: "projetoigreja-13bec.firebasestorage.app",
  messagingSenderId: "661621046603",
  appId: "1:661621046603:web:76fb2948812ed37fe2fcce",
  measurementId: "G-GPC39HQEQ7"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const membrosCol = collection(db, "membros");

// --- FORMULÁRIO ---
const form = document.getElementById("formIntegracao");
const mensagem = document.getElementById("mensagem");

form.addEventListener("submit", async (e) => {
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
    await addDoc(membrosCol, { nome, email, telefone, createdAt: new Date() });
    mensagem.textContent = "Cadastro realizado com sucesso!";
    mensagem.style.color = "green";
    form.reset();
  } catch (err) {
    console.error("Erro ao cadastrar:", err);
    mensagem.textContent = "Erro ao cadastrar. Verifique o console.";
    mensagem.style.color = "red";
  }
});

// --- ADMIN ---
const adminTab = document.getElementById("admin");
const tbody = document.querySelector("#tabelaAdmin tbody");

async function carregarAdmin() {
  tbody.innerHTML = "";
  try {
    const q = query(membrosCol, orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    if (snapshot.empty) {
      tbody.innerHTML = '<tr><td colspan="4" style="text-align:center;">Nenhum cadastro encontrado</td></tr>';
      return;
    }
    snapshot.forEach(docSnap => {
      const r = docSnap.data();
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${r.nome}</td>
        <td>${r.email}</td>
        <td>${r.telefone}</td>
        <td><button class="btn-excluir" data-id="${docSnap.id}">Excluir</button></td>
      `;
      tbody.appendChild(tr);
    });
  } catch (err) {
    console.error("Erro admin:", err);
  }
}

// Excluir cadastro
tbody.addEventListener("click", async (e) => {
  if (e.target.classList.contains("btn-excluir")) {
    const id = e.target.dataset.id;
    if (confirm("Tem certeza que deseja excluir?")) {
      try {
        await deleteDoc(doc(db, "membros", id));
        carregarAdmin();
      } catch (err) {
        console.error("Erro ao excluir:", err);
      }
    }
  }
});

// Atalho para mostrar admin
let segredo = "";
document.addEventListener("keydown", (e) => {
  segredo += e.key;
  if (segredo.includes("admin123")) {
    segredo = "";
    adminTab.classList.add("active");
    carregarAdmin();
  }
});
