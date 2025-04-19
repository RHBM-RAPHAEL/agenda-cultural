import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDHGwiT-bxFTKSa1LUJ6c0icxg1Ss_kyOY",
  authDomain: "agenda-ccb-c82a6.firebaseapp.com",
  projectId: "agenda-ccb-c82a6",
  storageBucket: "agenda-ccb-c82a6.appspot.com",
  messagingSenderId: "126594979891",
  appId: "1:126594979891:web:a20398cf3b66abe6c52b46"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Elementos
const eventoForm = document.getElementById("evento-form");
const listaEventos = document.getElementById("lista-eventos");
const mostrarEventosBtn = document.getElementById("mostrar-eventos-btn");

// Carregar eventos
async function carregarEventos() {
  listaEventos.innerHTML = "";
  const querySnapshot = await getDocs(collection(db, "eventos"));
  const agora = new Date();

  querySnapshot.forEach(async (documento) => {
    const evento = documento.data();
    const dataEvento = new Date(evento.data);

    if (dataEvento < agora) {
      await deleteDoc(doc(db, "eventos", documento.id));
      return;
    }

    const div = document.createElement("div");
    div.className = "evento";
    div.innerHTML = `
      <h3>${evento.nome}</h3>
      <p><strong>Data:</strong> ${dataEvento.toLocaleString()}</p>
      <p><strong>Local:</strong> ${evento.local}</p>
      <p>${evento.descricao}</p>
      <button class="btn-excluir" data-id="${documento.id}">Excluir</button>
    `;
    listaEventos.appendChild(div);
  });
}

// Adicionar novo evento
eventoForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const nome = document.getElementById("nome").value;
  const data = document.getElementById("data").value;
  const local = document.getElementById("local").value;
  const descricao = document.getElementById("descricao").value;

  try {
    await addDoc(collection(db, "eventos"), { nome, data, local, descricao });
    eventoForm.reset();
    await carregarEventos();
    listaEventos.style.display = "block";
    mostrarEventosBtn.textContent = "Ocultar Eventos";
    mostrarEventosBtn.style.backgroundColor = "#28a745"; // verde
  } catch (error) {
    console.error("Erro ao adicionar evento: ", error);
  }
});

// Remover evento
listaEventos.addEventListener("click", async (e) => {
  if (e.target.classList.contains("btn-excluir")) {
    const id = e.target.getAttribute("data-id");
    try {
      await deleteDoc(doc(db, "eventos", id));
      e.target.closest(".evento").remove();
    } catch (error) {
      console.error("Erro ao excluir evento:", error);
    }
  }
});

// Mostrar/Ocultar eventos
mostrarEventosBtn.addEventListener("click", async () => {
  const visivel = listaEventos.style.display === "block";

  listaEventos.style.display = visivel ? "none" : "block";
  mostrarEventosBtn.textContent = visivel ? "Mostrar Eventos" : "Ocultar Eventos";
  mostrarEventosBtn.style.backgroundColor = visivel ? "#007bff" : "#28a745"; // azul ou verde

  if (!visivel) {
    await carregarEventos();
  }
});
