// Importando os módulos do Firebase via ES Modules
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
  appId: "1:126594979891:web:a20398cf3b66abe6c52b46",
  measurementId: "G-GSYZRK4MHD"
};

// Inicializando Firebase e Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Referência ao formulário e lista de eventos
const eventoForm = document.getElementById("evento-form");
const listaEventos = document.getElementById("lista-eventos");

// Função para carregar eventos do Firestore
async function carregarEventos() {
  listaEventos.innerHTML = ""; // Limpa antes de carregar

  const querySnapshot = await getDocs(collection(db, "eventos"));
  querySnapshot.forEach((documento) => {
    const evento = documento.data();
    const id = documento.id;

    const dataEvento = new Date(evento.data);
    const agora = new Date();

    // Ignorar eventos que já passaram
    if (dataEvento < agora) {
      return;
    }

    const div = document.createElement("div");
    div.className = "evento";

    div.innerHTML = `
      <h3>${evento.nome}</h3>
      <p><strong>Data:</strong> ${dataEvento.toLocaleString()}</p>
      <p><strong>Local:</strong> ${evento.local}</p>
      <p>${evento.descricao}</p>
      <button class="btn-excluir" data-id="${id}">Excluir</button>
      <hr>
    `;

    listaEventos.appendChild(div);

    // Botão de exclusão
    const botaoExcluir = div.querySelector(".btn-excluir");
    botaoExcluir.addEventListener("click", async () => {
      const confirmacao = confirm("Tem certeza que deseja excluir este evento?");
      if (confirmacao) {
        await deleteDoc(doc(db, "eventos", id));
        carregarEventos(); // Recarrega após deletar
      }
    });
  });
}

// Quando o formulário for enviado, salva no Firebase
eventoForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const nome = document.getElementById("nome").value;
  const data = document.getElementById("data").value;
  const local = document.getElementById("local").value;
  const descricao = document.getElementById("descricao").value;

  try {
    await addDoc(collection(db, "eventos"), {
      nome,
      data,
      local,
      descricao
    });

    eventoForm.reset();
    carregarEventos();

  } catch (error) {
    console.error("Erro ao adicionar evento: ", error);
  }
});

// Carrega eventos ao abrir a página
carregarEventos();
