let eventos = JSON.parse(localStorage.getItem("eventos")) || [];

function salvarEventos() {
  localStorage.setItem("eventos", JSON.stringify(eventos));
}

function renderEventos() {
  const listaEventos = document.getElementById("lista-eventos");
  listaEventos.innerHTML = "";

  const agora = new Date();

  eventos.forEach((evento, index) => {
    const dataCompleta = new Date(`${evento.data}T${evento.hora}`);
    if (dataCompleta <= agora) return; // Já passou

    const divEvento = document.createElement("div");
    divEvento.classList.add("evento");

    const tempoRestante = document.createElement("p");
    tempoRestante.classList.add("contador");

    function atualizarContagem() {
      const agora = new Date();
      const diferenca = dataCompleta - agora;

      if (diferenca <= 0) {
        eventos.splice(index, 1); // Remove da lista
        salvarEventos();
        renderEventos(); // Re-renderiza
        return;
      }

      const dias = Math.floor(diferenca / (1000 * 60 * 60 * 24));
      const horas = Math.floor((diferenca / (1000 * 60 * 60)) % 24);
      const minutos = Math.floor((diferenca / (1000 * 60)) % 60);
      const segundos = Math.floor((diferenca / 1000) % 60);

      tempoRestante.textContent = `Faltam ${dias}d ${horas}h ${minutos}min ${segundos}s`;
    }

    atualizarContagem();
    setInterval(atualizarContagem, 1000); // Atualiza a cada segundo

    divEvento.innerHTML = `
      <h3>${evento.nome}</h3>
      <p><strong>Data:</strong> ${evento.data}</p>
      <p><strong>Hora:</strong> ${evento.hora}</p>
      <p><strong>Local:</strong> ${evento.local}</p>
      <p>${evento.descricao}</p>
    `;
    divEvento.appendChild(tempoRestante);
    listaEventos.appendChild(divEvento);
  });
}

function adicionarEvento(evento) {
  eventos.push(evento);
  salvarEventos();
  renderEventos();
}

document.getElementById("evento-form").addEventListener("submit", function (event) {
  event.preventDefault();

  const nome = document.getElementById("nome").value;
  const data = document.getElementById("data").value;
  const hora = document.getElementById("hora").value;
  const local = document.getElementById("local").value;
  const descricao = document.getElementById("descricao").value;

  const novoEvento = { nome, data, hora, local, descricao };
  adicionarEvento(novoEvento);
  this.reset();
});

function removerEventosAntigos() {
  const agora = new Date();
  eventos = eventos.filter(e => new Date(`${e.data}T${e.hora}`) > agora);
  salvarEventos();
}

window.onload = function () {
  removerEventosAntigos();
  renderEventos();
};
