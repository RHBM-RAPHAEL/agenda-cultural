// Carregar eventos do localStorage (se existirem)
let eventos = JSON.parse(localStorage.getItem("eventos")) || [];

// Função para renderizar os eventos na página
function renderEventos() {
  const listaEventos = document.getElementById("lista-eventos");
  listaEventos.innerHTML = ""; // Limpar lista antes de adicionar

  eventos.forEach(evento => {
    const divEvento = document.createElement("div");
    divEvento.classList.add("evento");
    divEvento.innerHTML = `
      <h3>${evento.nome}</h3>
      <p><strong>Data:</strong> ${evento.data}</p>
      <p><strong>Local:</strong> ${evento.local}</p>
      <p>${evento.descricao}</p>
    `;
    listaEventos.appendChild(divEvento);
  });
}

// Função para adicionar novo evento
function adicionarEvento(evento) {
  eventos.push(evento);
  localStorage.setItem("eventos", JSON.stringify(eventos)); // Salvar eventos no localStorage
  renderEventos();
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

  // Limpar formulário após envio
  this.reset();
});

// Inicializa os eventos na página
renderEventos();

// Função para remover eventos com data anterior a hoje
function removerEventosAntigos() {
  const eventos = document.querySelectorAll('.evento');
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0); // Zera hora para comparar apenas a data

  eventos.forEach(evento => {
    const dataStr = evento.getAttribute('data-data');
    const dataEvento = new Date(dataStr);

    if (dataEvento < hoje) {
      evento.remove(); // Remove o evento da tela
    }
  });
}

// Executa a função ao carregar a página
window.onload = function () {
  removerEventosAntigos();
};
