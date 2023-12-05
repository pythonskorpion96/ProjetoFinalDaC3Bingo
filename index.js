var intervaloSorteio = 100;

const gerarCartelasButton = document.getElementById("gerarCartelasButton");
gerarCartelasButton.addEventListener("click", () => gerarCartelasJogadores());

const iniciarJogoButton = document.getElementById("iniciarJogoButton");
iniciarJogoButton.addEventListener("click", () => iniciarJogo());

const jogadoresArea = document.getElementById("jogadoresArea");
const divSorteados = document.getElementById("sorteados");
const divMensagem = document.getElementById("mensagem");

const numeroMaximo = 75;
const numerosPorJogador = 24;
var cartelaGerada = false;

var vetorJogadores = [];
var vetorSorteados = [];
var vetorNaoSorteados = Array.from({ length: numeroMaximo }, (_, index) => index + 1);

function gerarNumeroAleatorio(min, max) {
    return Math.floor((max - min) * Math.random()) + min;
}

function gerarFileira(quantidadeNumeros, inicio, fim) {
    let cartela = [];
    for (let i = 0; i < quantidadeNumeros; i++) {
        let numeroCartelaExiste = true;
        while (numeroCartelaExiste) {
            let numeroAleatorio = gerarNumeroAleatorio(inicio, fim);
            if (!cartela.includes(numeroAleatorio)) {
                numeroCartelaExiste = false;
                cartela.push(numeroAleatorio);
            }
        }
    }
    return cartela;
}

function gerarCartelasJogadores() {
    const numeroJogadores = parseInt(prompt("Digite a quantidade de jogadores (2-4):"), 10);

    if (isNaN(numeroJogadores) || numeroJogadores < 2 || numeroJogadores > 4) {
        alert("Digite um número válido de 2 a 4");
        return;
    }

    vetorJogadores = [];

    for (let i = 0; i < numeroJogadores; i++) {
        criarJogador(i + 1);
    }

    renderizarJogadores();
    cartelaGerada = true;
}

function criarJogador(numeroJogador) {
    let nomeJogador = prompt(`Digite o nome do jogador ${numeroJogador}: `);

    if (!nomeJogador || nomeJogador.trim().length === 0) {
        nomeJogador = `Jogador ${numeroJogador}`;
    }

    nomeJogador = limitarNome(nomeJogador, 20);

    let cartela = gerarCartela();
    let novoJogador = {
        nome: nomeJogador,
        cartela: cartela
    };

    vetorJogadores.push(novoJogador);
}

function limitarNome(str, max) {
    return str.length > max ? str.substr(0, max - 1) + '…' : str;
}

function gerarCartela() {
    let cartela = [];

    let coluna1 = gerarFileiraCartela(5, 1, 15);
    let coluna2 = gerarFileiraCartela(5, 16, 30);
    let coluna3 = gerarFileiraCartela(4, 31, 45);
    let coluna4 = gerarFileiraCartela(5, 46, 60);
    let coluna5 = gerarFileiraCartela(5, 61, 75);

    cartela = cartela.concat(coluna1, coluna2, coluna3, coluna4, coluna5);
    return cartela;
}

function gerarFileiraCartela(quantidadeNumeros, numeroMinimo, numeroMaximo) {
    let numerosFileira = Array.from({ length: numeroMaximo - numeroMinimo + 1 }, (_, index) => index + numeroMinimo);
    let fileira = [];

    for (let i = 0; i < quantidadeNumeros; i++) {
        const randomIndex = Math.floor(Math.random() * numerosFileira.length);
        let numero = numerosFileira[randomIndex];
        numerosFileira.splice(randomIndex, 1);
        fileira.push(numero);
    }

    return fileira;
}

function renderizarJogadores() {
    jogadoresArea.innerHTML = "";
    vetorJogadores.forEach((jogador) => {
        const divCartela = document.createElement("div");
        divCartela.classList.add("cartela");

        const divNomeJogador = document.createElement("div");
        divNomeJogador.className = "nomeJogador";
        divNomeJogador.innerHTML = jogador.nome;
        divCartela.appendChild(divNomeJogador);

        const divBingoArea = document.createElement("div");
        divBingoArea.className = "bingoArea";
        divBingoArea.innerHTML = `<div class="letra">B</div>
                                    <div class="letra">I</div>
                                    <div class="letra">N</div>
                                    <div class="letra">G</div>
                                    <div class="letra">O</div>`;
        divCartela.appendChild(divBingoArea);

        const divNumerosArea = document.createElement("div");
        divNumerosArea.className = "numerosArea";
        jogador.cartela.forEach((numero, index) => {
            const numeroDiv = document.createElement("div");
            numeroDiv.className = "numero";
            numeroDiv.innerHTML = numero;
            if (isNumeroSorteado(numero)) {
                numeroDiv.className += " sorteado";
            }
            divNumerosArea.appendChild(numeroDiv);

            if (index === 11) {
                const vazioDiv = document.createElement("div");
                vazioDiv.className = "numero bingo";
                vazioDiv.innerHTML = "B";
                divNumerosArea.appendChild(vazioDiv);
            }
        });

        if (jogadorVenceu(jogador)) {
            divCartela.classList.add("vencedor");
        }
        divCartela.appendChild(divNumerosArea);

        jogadoresArea.appendChild(divCartela);
    });
}

function renderizarSorteados() {
    divSorteados.innerHTML = "";
    vetorSorteados.forEach((numero) => {
        const numeroDiv = document.createElement("div");
        numeroDiv.className = "numero";
        numeroDiv.innerHTML = numero;
        divSorteados.appendChild(numeroDiv);
    });
}

function isNumeroSorteado(numero) {
    return vetorSorteados.includes(numero);
}

function jogadorVenceu(jogador) {
    return jogador.cartela.every((numero) => isNumeroSorteado(numero));
}

function sortearNumero() {
    if (vetorSorteados.length === numeroMaximo) {
        console.log("Sorteio Finalizado!");
        return false;
    }

    const randomIndex = Math.floor(Math.random() * vetorNaoSorteados.length);
    let numeroSorteado = vetorNaoSorteados[randomIndex];
    vetorNaoSorteados.splice(randomIndex, 1);
    vetorSorteados.push(numeroSorteado);

    return true;
}

function iniciarJogo() {
    if (!cartelaGerada) {
        alert("Você precisa gerar as cartelas");
        return;
    }

    iniciarJogoButton.remove();
    gerarCartelasButton.remove();

    let intervalo = setInterval(function () {
        if (sortearNumero()) {
            renderizarSorteados();
            renderizarJogadores();

            vetorJogadores.forEach((jogador) => {
                if (jogadorVenceu(jogador)) {
                    finalizarJogo();
                    clearInterval(intervalo);
                }
            });
        } else {
            console.log("Sorteio Finalizado!");
            clearInterval(intervalo);
        }
    }, intervaloSorteio);
}

function finalizarJogo() {
    divMensagem.className = "vencedor";

    let vencedores = vetorJogadores.filter((jogador) => jogadorVenceu(jogador)).map((vencedor) => vencedor.nome);

    if (vencedores.length > 1) {
        divMensagem.innerHTML = `Os vencedores foram: ${vencedores.join(", ")}`;
    } else {
        divMensagem.innerHTML = `O vencedor foi ${vencedores[0]}`;
    }
}
