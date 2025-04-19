import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  getDoc
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

const eventoForm = document.getElementById("evento-form");
const listaEventos = document.getElementById("lista-eventos");
const mostrarEventosBtn = document.getElementById("mostrar-eventos-btn");
let eventoIdEdicao = null;  // Variável para armazenar o ID do evento sendo editado

// Função para carregar eventos
async function carregarEventos() {
  listaEventos.innerHTML = "";
  const querySnapshot = await getDocs(collection(db, "eventos"));
  const agora = new Date();

  for (const documento of querySnapshot.docs) {
    const evento = documento.data();
    const eventoData = new Date(evento.data);

    // Deleta eventos passados
    if (eventoData < agora) {
      await deleteDoc(doc(db, "eventos", documento.id));
      continue;
    }

    // Mostra eventos futuros
    const div = document.createElement("div");
    div.className = "evento";

    div.innerHTML = `
      <h3>${evento.nome}</h3>
      <p><strong>Data:</strong> ${eventoData.toLocaleString()}</p>
      <p><strong>Local:</strong> ${evento.local}</p>
      <p>${evento.descricao}</p>
      <button class="btn-editar" data-id="${documento.id}">Editar</button>
      <button class="btn-excluir" data-id="${documento.id}">Excluir</button>
    `;

    listaEventos.appendChild(div);
  }
}

// Adicionar evento
eventoForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const nome = document.getElementById("nome").value;
  const data = document.getElementById("data").value;
  const local = document.getElementById("local").value;
  const descricao = document.getElementById("descricao").value;
  const senha = document.getElementById("senha").value;

  if (!senha || senha !== "1234") {  // A senha para criar/editar evento
    alert("Senha incorreta!");
    return;
  }

  try {
    if (eventoIdEdicao) {
      // Atualizar evento
      const eventoRef = doc(db, "eventos", eventoIdEdicao);
      await updateDoc(eventoRef, {
        nome,
        data,
        local,
        descricao
      });
      eventoIdEdicao = null; // Limpa a variável após edição
    } else {
      // Criar novo evento
      await addDoc(collection(db, "eventos"), {
        nome,
        data,
        local,
        descricao
      });
    }

    eventoForm.reset();
    await carregarEventos();
    listaEventos.style.display = "block";
    mostrarEventosBtn.textContent = "Ocultar Eventos";
  } catch (error) {
    console.error("Erro ao adicionar ou editar evento: ", error);
  }
});

// Exclusão manual
listaEventos.addEventListener("click", async (e) => {
  if (e.target.classList.contains("btn-excluir")) {
    const id = e.target.getAttribute("data-id");
    const senha = prompt("Digite a senha para excluir o evento:");

    if (!senha || senha !== "1234") {  // Verifica se a senha é correta
      alert("Senha incorreta!");
      return;
    }

    try {
      await deleteDoc(doc(db, "eventos", id));
      const eventoDiv = e.target.closest(".evento");
      eventoDiv.remove();
    } catch (error) {
      console.error("Erro ao excluir evento: ", error);
    }
  }
});

// Editar evento
listaEventos.addEventListener("click", async (e) => {
  if (e.target.classList.contains("btn-editar")) {
    const id = e.target.getAttribute("data-id");
    const eventoRef = doc(db, "eventos", id);
    const eventoDoc = await getDoc(eventoRef);
    const evento = eventoDoc.data();

    // Preenche o formulário com os dados do evento
    document.getElementById("nome").value = evento.nome;
    document.getElementById("data").value = evento.data;
    document.getElementById("local").value = evento.local;
    document.getElementById("descricao").value = evento.descricao;
    eventoIdEdicao = id;  // Armazena o ID do evento que está sendo editado

    // Mudando o título do botão para "Editar evento"
    document.getElementById("evento-form").querySelector("button").textContent = "Editar Evento";
  }
});

// Mostrar/Ocultar eventos
mostrarEventosBtn.addEventListener("click", async () => {
  if (listaEventos.style.display === "block") {
    listaEventos.style.display = "none";
    mostrarEventosBtn.textContent = "Mostrar Eventos";
  } else {
    listaEventos.style.display = "block";
    mostrarEventosBtn.textContent = "Ocultar Eventos";
    await carregarEventos();
  }
});
