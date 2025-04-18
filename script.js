// Configuração do Firebase
const firebaseConfig = {
  apiKey: "SUA_API_KEY",
  authDomain: "SEU_AUTH_DOMAIN",
  projectId: "SEU_PROJECT_ID",
  storageBucket: "SEU_STORAGE_BUCKET",
  messagingSenderId: "SEU_MESSAGING_SENDER_ID",
  appId: "SEU_APP_ID"
};

// Inicializar Firebase
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();  // Inicializar Firestore

// Carregar eventos do localStorage (se existirem)
let eventos = JSON.parse(localStorage.getItem("eventos")) || [];

// Função para remover eventos passados
function removerEventosPassados() {
  const agora = new Date();
  eventos = eventos.filter(evento => new Date(evento.data) > agora);
  localStorage.setItem("eventos", JSON.stringify(eventos));
}

// Função para renderizar os eventos na página
function renderEventos() {
  const listaEventos = document.getElementById("lista-eventos");
  listaEventos.innerHTML = "";

  removerEventosPassados();

  eventos.forEach(evento => {
    const divEvento = document.createElement("div");
    divEvento.classList.add("evento");

    const dataEvento = new Date(evento.data);
    const tempoRestante = calcularTempoRestante(dataEvento);

    divEvento.innerHTML = `
      <h3>${evento.nome}</h3>
      <p><strong>Data e Hora:</strong> ${formatarDataHora(dataEvento)}</p>
      <p><strong>Local:</strong> ${evento.local}</p>
      <p>${evento.descricao}</p>
      <p><strong>Faltam:</strong> ${tempoRestante}</p>
    `;
    listaEventos.appendChild(divEvento);
  });
}

function adicionarEvento(evento) {
  db.collection("eventos").add({
    nome: evento.nome,
    data: evento.data,
    local: evento.local,
    descricao: evento.descricao,
  })
  .then(() => {
    console.log("Evento adicionado com sucesso!");
    renderEventos(); // Atualiza a lista de eventos
  })
  .catch((error) => {
    console.error("Erro ao adicionar evento: ", error);
  });
}

document.getElementById("evento-form").addEventListener("submit", function(event) {
  event.preventDefault();

  const nome = document.getElementById("nome").value;
  const data = document.getElementById("data").value;
  const local = document.getElementById("local").value;
  const descricao = document.getElementById("descricao").value;

  const novoEvento = {
    nome,
    data,
    local,
    descricao,
  };

  adicionarEvento(novoEvento);
  this.reset();
});

renderEventos();
setInterval(renderEventos, 60000);
