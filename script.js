let numerosDisponiveis = [];
let vozesDisponiveis = [];
let vozSelecionada = null;

let intervaloId = null;
let modoAutomatico = false;

const numeroAtualEl = document.getElementById("numeroAtual");
const vozSelect = document.getElementById("vozSelect");
const rateInput = document.getElementById("rate");
const pitchInput = document.getElementById("pitch");
const intervaloInput = document.getElementById("intervalo");
const btnAuto = document.getElementById("btnAuto");

/* ---------- INIT ---------- */

inicializar();
inicializarVozes();

function inicializar() {
    numerosDisponiveis = [];
    for (let i = 1; i <= 75; i++) numerosDisponiveis.push(i);

    numeroAtualEl.innerText = "PRONTO PARA SORTEAR";

    ["B","I","N","G","O"].forEach(l => {
        document.getElementById(`col${l}`).innerHTML = "";
    });

    pararAutomatico();
}

/* ---------- BINGO ---------- */

function sortear() {
    if (numerosDisponiveis.length === 0) {
        falar("Fim de jogo! Todos os números foram sorteados!");
        pararAutomatico();
        return;
    }

    const index = Math.floor(Math.random() * numerosDisponiveis.length);
    const numero = numerosDisponiveis.splice(index, 1)[0];
    const letra = letraDoBingo(numero);

    numeroAtualEl.innerText = `${letra} - ${numero}`;

    const frases = [
        `${letra} de bola, número ${numero}!`,
        `Atenção pessoal, saiu ${letra} ${numero}!`,
        `Olha ele aí! ${letra}, número ${numero}!`,
        `Preparem as cartelas! ${letra} ${numero}!`
    ];

    falar(frases[Math.floor(Math.random() * frases.length)]);
    adicionarNaTabela(letra, numero);
}

function reiniciar() {
    falar("Bingo reiniciado! Vamos começar!");
    inicializar();
}

function adicionarNaTabela(letra, numero) {
    const coluna = document.getElementById(`col${letra}`);

    let div = coluna.querySelector(".coluna");
    if (!div) {
        div = document.createElement("div");
        div.className = "coluna";
        coluna.appendChild(div);
    }

    const span = document.createElement("span");
    span.innerText = numero;
    div.appendChild(span);
}

function letraDoBingo(numero) {
    if (numero <= 15) return "B";
    if (numero <= 30) return "I";
    if (numero <= 45) return "N";
    if (numero <= 60) return "G";
    return "O";
}

/* ---------- VOZ ---------- */

function inicializarVozes() {
    speechSynthesis.onvoiceschanged = () => {
        vozesDisponiveis = speechSynthesis.getVoices()
            .filter(v => v.lang.startsWith("pt"));

        vozSelect.innerHTML = "";

        vozesDisponiveis.forEach((voz, index) => {
            const option = document.createElement("option");
            option.value = index;
            option.textContent = `${voz.name} (${voz.lang})`;
            vozSelect.appendChild(option);
        });

        if (vozesDisponiveis.length > 0) {
            vozSelecionada = vozesDisponiveis[0];
            vozSelect.value = 0;
        }
    };

    vozSelect.addEventListener("change", () => {
        vozSelecionada = vozesDisponiveis[vozSelect.value];
    });
}

function falar(texto) {
    const msg = new SpeechSynthesisUtterance(texto);

    if (vozSelecionada) {
        msg.voice = vozSelecionada;
        msg.lang = vozSelecionada.lang;
    } else {
        msg.lang = "pt-BR";
    }

    msg.rate = parseFloat(rateInput.value);
    msg.pitch = parseFloat(pitchInput.value);

    speechSynthesis.cancel();
    speechSynthesis.speak(msg);
}

/* ---------- PREVIEW ---------- */

function previewVoz() {
    falar("Olá pessoal! Esta é a voz do bingo. Boa sorte a todos!");
}

/* ---------- AUTOMÁTICO ---------- */

function toggleAutomatico() {
    if (modoAutomatico) {
        pararAutomatico();
    } else {
        iniciarAutomatico();
    }
}

function iniciarAutomatico() {
    const intervaloSegundos = parseInt(intervaloInput.value);

    if (intervaloSegundos < 3) return;

    modoAutomatico = true;
    btnAuto.innerText = "⏸️ Parar automático";

    sortear();

    intervaloId = setInterval(() => {
        sortear();
    }, intervaloSegundos * 1000);
}

function pararAutomatico() {
    modoAutomatico = false;
    btnAuto.innerText = "▶️ Iniciar automático";

    if (intervaloId) {
        clearInterval(intervaloId);
        intervaloId = null;
    }
}
