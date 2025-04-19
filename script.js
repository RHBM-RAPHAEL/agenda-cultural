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

const eventoForm = document.getElementById("evento-form");
const listaEventos = document.getElementById("lista-eventos");

// Função para carregar eventos
async function carregarEventos() {
  listaEventos.innerHTML = "";
  const querySnapshot = await getDocs(collection(db, "eventos"));

  const agora = new Date();

  // Usando for...of para garantir execução correta das promessas
  for (const documento of querySnapshot.docs) {
    const evento = documento.data();
    const eventoData = new Date(evento.data);

    // Deleta eventos passados
    if (eventoData < agora) {
      await deleteDoc(doc(db, "eventos", documento.id));
      continue; // Se o evento foi deletado, passa para o próximo
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

// Exclusão manual
listaEventos.addEventListener("click", async (e) => {
  if (e.target.classList.contains("excluir-btn")) {
    const id = e.target.getAttribute("data-id");

    try {
      // Exclui o evento do Firestore
      await deleteDoc(doc(db, "eventos", id));

      // Remove o evento da interface sem recarregar todos
      const eventoDiv = e.target.closest(".evento");
      eventoDiv.remove();
    } catch (error) {
      console.error("Erro ao excluir evento: ", error);
    }
  }
});
// Octokit.js
// https://github.com/octokit/core.js#readme
const octokit = new Octokit({
  auth: 'YOUR-TOKEN'
})

await octokit.request('POST /repos/{owner}/{repo}/pages/deployments/{pages_deployment_id}/cancel', {
  owner: 'OWNER',
  repo: 'REPO',
  pages_deployment_id: 'PAGES_DEPLOYMENT_ID',
  headers: {
    'X-GitHub-Api-Version': '2022-11-28'
  }
})
// Carregar eventos ao inicializar a página
carregarEventos();
