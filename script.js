import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc
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
const editarEventoForm = document.getElementById("editar-evento-form");
const editarFormSection = document.getElementById("editar-form");

let eventoEditandoId = null; // Para controlar qual evento está sendo editado

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
      <button class="excluir-btn" data-id="${documento.id}">Excluir</button>
      <button class="editar-btn" data-id="${documento.id}">Editar</button>
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

  try {
    await addDoc(collection(db, "eventos"), {
      nome,
      data,
      local,
      descricao,
      senha
    });

    eventoForm.reset();
    await carregarEventos();
    listaEventos.style.display = "block";
    mostrarEventosBtn.textContent = "Ocultar Eventos";
  } catch (error) {
    console.error("Erro ao adicionar evento: ", error);
  }
});

// Exclusão manual
listaEventos.addEventListener("click", async (e) => {
  if (e.target.classList.contains("excluir-btn")) {
    const id = e.target.getAttribute("data-id");
    const senha = prompt("Digite a senha para excluir:");

    const eventoDoc = doc(db, "eventos", id);
    const evento = (await getDocs(eventoDoc)).data();

    if (evento.senha === senha) {
      try {
        await deleteDoc(eventoDoc);
        const eventoDiv = e.target.closest(".evento");
        eventoDiv.remove();
      } catch (error) {
        console.error("Erro ao excluir evento: ", error);
      }
    } else {
      alert("Senha incorreta!");
    }
  }
});

// Editar evento
listaEventos.addEventListener("click", async (e) => {
  if (e.target.classList.contains("editar-btn")) {
    eventoEditandoId = e.target.getAttribute("data-id");

    // Carregar dados do evento para edição
    const eventoDoc = doc(db, "eventos", eventoEditandoId);
    const evento = (await getDocs(eventoDoc)).data();

    // Preencher campos do formulário de edição
    document.getElementById("editar-nome").value = evento.nome;
    document.getElementById("editar-data").value = evento.data;
    document.getElementById("editar-local").value = evento.local;
    document.getElementById("editar-descricao").value = evento.descricao;

    editarFormSection.style.display = "block";
  }
});

// Salvar alterações de evento
editarEventoForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const nome = document.getElementById("editar-nome").value;
  const data = document.getElementById("editar-data").value;
  const local = document.getElementById("editar-local").value;
  const descricao = document.getElementById("editar-descricao").value;
  const senha = document.getElementById("editar-senha").value;

  const eventoDoc = doc(db, "eventos", eventoEditandoId);
  const evento = (await getDocs(eventoDoc)).data();

  // Verifica a senha antes de editar
  if (evento.senha === senha) {
    try {
      await updateDoc(eventoDoc, {
        nome,
        data,
        local,
        descricao
      });

      // Limpa o formulário e oculta a seção de edição
      editarFormSection.style.display = "none";
      eventoEditandoId = null;
      await carregarEventos();
    } catch (error) {
      console.error("Erro ao editar evento: ", error);
    }
  } else {
    alert("Senha incorreta!");
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
