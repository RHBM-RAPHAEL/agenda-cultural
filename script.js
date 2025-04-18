// Importando as funções necessárias do Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

// Configuração do Firebase
const firebaseConfig = {
  apiKey: "SUA_API_KEY",
  authDomain: "SEU_AUTH_DOMAIN",
  projectId: "SEU_PROJECT_ID",
  storageBucket: "SEU_STORAGE_BUCKET",
  messagingSenderId: "SEU_MESSAGING_SENDER_ID",
  appId: "SEU_APP_ID",
  measurementId: "SEU_MEASUREMENT_ID"
};

// Inicializando o Firebase
const app = initializeApp(firebaseConfig);

// Inicializando o Firestore
const db = getFirestore(app);

// Função para remover eventos passados
function removerEventosPassados(eventos) {
  const agora = new Date();
  return eventos.filter(evento => new Date(evento.data) > agora);
}

// Função para renderizar os eventos na página
function renderEventos(eventos) {
  const listaEventos = document.getElementById("lista-eventos");
  listaEventos.innerHTML = ""; // Limpar a lista antes de adicionar novos eventos

  const eventosFuturos = removerEventosPassados(eventos); // Filtra os eventos futuros

  eventosFuturos.forEach(evento => {
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

// Função para adicionar novo evento no Firestore
async function adicionarEvento(evento) {
  try {
    // Adicionar evento no Firestore
    await addDoc(collection(db, "eventos"), {
      nome: evento.nome,
      data: evento.data,
      local: evento.local,
      descricao: evento.descricao,
    });

    console.log("Evento adicionado com sucesso!");
    renderEventos(await buscarEventos()); // Atualiza a lista de eventos
  } catch (e) {
    console.error("Erro ao adicionar evento: ", e);
  }
}

// Função para buscar eventos do Firestore
async function buscarEventos() {
  const querySnapshot = await getDocs(collection(db, "eventos"));
  const eventos = [];
  querySnapshot.forEach((doc) => {
    eventos.push(doc.data());
  });

  return eventos;
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
async function inicializarEventos() {
  const eventos = await buscarEventos();
  renderEventos(eventos);
}

// Chama a função para inicializar os eventos
inicializarEventos();

// Função para atualizar o tempo real a cada 60 segundos
setInterval(async () => {
  const eventos = await buscarEventos();
  renderEventos(eventos);
}, 60000);
