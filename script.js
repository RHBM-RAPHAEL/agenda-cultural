import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

// Configuração Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDHGwiT-bxFTKSa1LUJ6c0icxg1Ss_kyOY",
  authDomain: "agenda-ccb-c82a6.firebaseapp.com",
  projectId: "agenda-ccb-c82a6",
  storageBucket: "agenda-ccb-c82a6.appspot.com",
  messagingSenderId: "126594979891",
  appId: "1:126594979891:web:a20398cf3b66abe6c52b46",
  measurementId: "G-GSYZRK4MHD"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const eventoForm = document.getElementById("evento-form");
const listaEventos = document.getElementById("lista-eventos");

async function carregarEventos() {
  listaEventos.innerHTML = "";

  const querySnapshot = await getDocs(collection(db, "eventos"));
  const agora = new Date();

  for (const docSnap of querySnapshot.docs) {
    const evento = docSnap.data();
    const id = docSnap.id;
    const dataEvento = new Date(evento.data);

    // Se o evento já passou, apaga do Firebase
    if (dataEvento < agora) {
      await deleteDoc(doc(db, "eventos", id));
      continue; // Pula para o próximo evento
    }

    // Se o evento ainda não passou, exibe na tela
    const div = document.createElement("div");
    div.className = "evento";

    div.innerHTML = `
      <h3>${evento.nome}</h3>
      <p><strong>Data:</strong> ${dataEvento.toLocaleString()}</p>
      <p><strong>Local:</strong> ${evento.local}</p>
      <p>${evento.descricao}</p>
      <button class="excluir-btn" data-id="${id}">Excluir</button>
      <hr>
    `;

    listaEventos.appendChild(div);
  }

  // Adiciona ação para botões de exclusão manual
  const botoesExcluir = document.querySelectorAll(".excluir-btn");
  botoesExcluir.forEach((btn) => {
    btn.addEventListener("click", async () => {
      const id = btn.getAttribute("data-id");
      await deleteDoc(doc(db, "eventos", id));
      carregarEventos(); // Atualiza após excluir
    });
  });
}

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

carregarEventos();
