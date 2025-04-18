// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDHGwiT-bxFTKSa1LUJ6c0icxg1Ss_kyOY",
  authDomain: "agenda-ccb-c82a6.firebaseapp.com",
  projectId: "agenda-ccb-c82a6",
  storageBucket: "agenda-ccb-c82a6.firebasestorage.app",
  messagingSenderId: "126594979891",
  appId: "1:126594979891:web:2c5451282d55b91dc52b46",
  measurementId: "G-1091ND1DJ2"
};

// Inicializar Firebase
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();  // Inicializar Firestore

// Carregar eventos do localStorage (se existirem)
let eventos = JSON.parse(localStorage.getItem("eventos")) || [];

// Garantir que 'eventos' seja sempre um array
if (!Array.isArray(eventos)) {
  eventos = [];
}

// Função para remover eventos passados
function removerEventosPassados() {
  const agora = new Date();

  // Verifica se 'eventos' é um array antes de filtrar
  eventos = eventos.filter(evento => new Date(evento.data) > agora);

  // Atualiza o localStorage com os eventos futuros
  localStorage.setItem("eventos", JSON.stringify(eventos));
}

// Função para renderizar os eventos na página
function renderEventos() {
  const listaEventos = document.getElementById("lista-eventos");
  listaEventos.innerHTML = ""; // Limpar a lista antes de adicionar novos eventos

  removerEventosPassados(); // Remove eventos passados

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

// Função para calcular o tempo restante
function calcularTempoRestante(dataEvento) {
  const agora = new Date();
  const tempo = dataEvento - agora;

  if (tempo <= 0) {
    return "Evento já passou!";
  }

  const dias = Math.floor(tempo / (1000 * 60 * 60 * 24));
  const horas = Math.floor((tempo % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutos = Math.floor((tempo % (1000 * 60 * 60)) / (1000 * 60));

  return `${dias} dias, ${horas} horas e ${minutos} minutos`;
}

// Função para formatar a data e hora para exibição
function formatarDataHora(data) {
  const dia = data.getDate().toString().padStart(2, '0');
  const mes = (data.getMonth() + 1).toString().padStart(2, '0');
  const ano = data.getFullYear();
  const hora = data.getHours().toString().padStart(2, '0');
  const minuto = data.getMinutes().toString().padStart(2, '0');

  return `${dia}/${mes}/${ano} ${hora}:${minuto}`;
}

// Função para adicionar novo evento
function adicionarEvento(evento) {
  // Adicionar evento no Firestore
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

  // Adicionar evento também no localStorage
  eventos.push(evento);
  localStorage.setItem("eventos", JSON.stringify(eventos));
}

// Manipulador de evento do formulário
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

// Inicializa os eventos na página
renderEventos();

// Função para atualizar o tempo real a cada 60 segundos
setInterval(renderEventos, 60000);
