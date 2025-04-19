// Importando os módulos do Firebase via ES Modules
import { deleteDoc, doc } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";
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

// 🧽 Nova função para excluir eventos vencidos do Firestore
async function excluirEventosPassados() {
  const agora = new Date();
  const querySnapshot = await getDocs(collection(db, "eventos"));

  querySnapshot.forEach(async (documento) => {
    const dados = documento.data();
    const dataEvento = new Date(dados.data);

    if (dataEvento <= agora) {
      await deleteDoc(doc(db, "eventos", documento.id));
      console.log(`Evento "${dados.nome}" excluído (prazo expirado).`);
    }
  });
}

// Função para carregar eventos do Firestore
async function carregarEventos() {
  listaEventos.innerHTML = ""; // Limpa antes de carregar

  await excluirEventosPassados(); // Exclui eventos vencidos antes de carregar

  const querySnapshot = await getDocs(collection(db, "eventos"));
  querySnapshot.forEach((documento) => {
  const evento = documento.data();
  const id = documento.id;

  const div = document.createElement("div");
  div.className = "evento";

  div.innerHTML = `
    <h3>${evento.nome}</h3>
    <p><strong>Data:</strong> ${new Date(evento.data).toLocaleString()}</p>
    <p><strong>Local:</strong> ${evento.local}</p>
    <p>${evento.descricao}</p>
    <button class="btn-excluir" data-id="${id}">Excluir</button>
    <hr>
  `;

  listaEventos.appendChild(div);
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
      data: new Date(data),
      local,
      descricao
    });

    eventoForm.reset(); // Limpa os campos
    carregarEventos(); // Recarrega os eventos atualizados

  } catch (error) {
    console.error("Erro ao adicionar evento: ", error);
  }
});

// Carrega eventos ao abrir a página
carregarEventos();
