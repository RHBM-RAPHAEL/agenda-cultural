// Carregar eventos do localStorage (se existirem)
let eventos = JSON.parse(localStorage.getItem("eventos")) || [];

// Se estiver vazio, adiciona eventos de exemplo com datas futuras
if (eventos.length === 0) {
  eventos = [
    {
      nome: "Feira de Artesanato",
      data: "2025-04-25",
      local: "Praça Central",
      descricao: "Feira com produtos feitos à mão pelos artesãos locais.",
    },
    {
      nome: "Apresentação Musical",
      data: "2025-04-28",
      local: "Centro Cultural",
      descricao: "Show de bandas da cidade.",
    }
  ];
  localStorage.setItem("eventos", JSON.stringify(eventos));
}

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
  localStorage.setItem("eventos", JSON.stringify(eventos)); // Salvar no localStorage
  renderEventos();
}

// Manipulador de envio do formulário
document.getElementById("evento-form").addEventListener("submit", function(event) {
  event.preventDefault();

  const nome = document.getElementById("nome").value;
  const data = document.getElementById("data").value;
  const local = document.getElementById("local").value;
  const descricao = document.getElementById("descricao").value;

  const novoEvento = { nome, data, local, descricao };
  adicionarEvento(novoEvento);
  this.reset(); // Limpa o formulário
});

// Função para remover eventos com data anterior a hoje
function removerEventosAntigos() {
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0); // Zera hora para comparar datas

  eventos = eventos.filter(evento => {
    const dataEvento = new Date(evento.data);
    return dataEvento >= hoje;
  });

  localStorage.setItem("eventos", JSON.stringify(eventos)); // Atualiza storage
}

// Quando a página carregar
window.onload = function () {
  removerEventosAntigos();
  renderEventos();
};
