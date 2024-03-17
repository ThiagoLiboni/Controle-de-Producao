import * as functions from "./function.js"


let producao = {
    tempo: [],
    und: []
}
let t = 0
let fullTime = 0
let un = 0
let mediaTempo;
let sobraPct;
let pct;


var options = {
    chart: {
        type: 'line',
        width: '100%',
        height: '100%'
    },
    series: [{
        name: 'Tempo',
        data: []
    }],
    xaxis: {
        categories: []
    },

    yaxis: {
        labels: {
            formatter: function (value) {
                // Função para formatar os rótulos do eixo y
                if (value % 1 == 0) {
                    // Se o valor não for um número inteiro, retorna o valor original
                    return value;
                }
                return ''; // Retorna uma string vazia para ocultar rótulos de valores inteiros
            }
        }
    },
    tooltip: {
        y: {
            formatter: function (value) {
                return value;
            }
        }
    }


}

var chart = new ApexCharts(document.querySelector("#mychart"), options);

chart.render();
let count = 1
let iniciado = 0
const materia = document.getElementById('controle-Peso');
const materiaSobra = document.getElementById('controle-Desperd');
const clear = document.getElementById('clearAll');

function rendimento() {
    const Chart = document.querySelector('.chart')
    const progresso = document.createElement('div')
    progresso.className = "box"
    progresso.innerHTML = ` 
    <div class="box-circle">
    <svg>
    <circle cx="70" cy="70" r="70"></circle>
    <circle id="progress" cx="70" cy="70" r="70"></circle>
                </svg>
                <div  class="number">
                    <h2 id="numberProgress">75%</h2>
                </div>
                </div>
                <div id=avaliacao>Bom</div>`
    Chart.appendChild(progresso)

    let materiaValor = materia.value
    let sobraValor = materiaSobra.value
    chart.updateOptions({
        series: [{
            name: 'Tempo',
            data: producao.tempo
        }],
        xaxis: {
            categories: producao.und
        },
    });
    mediaTempo = t / un

    sobraPct = ((sobraValor * 100) / materiaValor).toFixed(2) + "%"


    const info = document.getElementById('info')
    info.style.padding = "30px"
    info.innerHTML = `Produtos fabricados: <b>${un}und</b>.<br>
    Média de produção: <b>${parseInt(mediaTempo)}s/und</b>.<br>
    Desperdício: <b>${sobraValor}g</b>(<b>${sobraPct})</b><br><br>
    O tempo total do processo foi de <b>${fullTime}s.</b>`
    Progress()
    count = 1;
}

let start = document.getElementById('btn-start');
start.addEventListener('click', () => {

    let materiaValor = materia.value
    let sobraValor = materiaSobra.value

    if (materiaValor != "") {
        let status = start.textContent;
        console.log(status)

        if (status == "START" && iniciado == 0) {
            start.innerText = "STOP"
            start.style.backgroundColor = "rgb(223, 59, 59)"
            functions.startTimer();

            const info = document.createElement('div')
            info.id = "info";
            info.innerHTML = "A cada item produzido, clique em 'CONTAR'";


            const Chart = document.querySelector('.chart')
            Chart.appendChild(info)

            materia.style.display = "none"
            materiaSobra.style.display = "flex"

            setTimeout(() => { iniciado = 1 }, 1000)

        }
        if (status == "STOP" && iniciado == 1) {

            if (sobraValor != "") {
                functions.stopTimer();
                start.innerText = "START";
                start.style.backgroundColor = "rgb(48, 177, 48)"
                iniciado = 0
                rendimento()
                start.innerText = "RESET";

            } else if (status == "STOP" && producao.und.length === 0) {
                functions.stopTimer();
                // console.log("parei")
                reset()
            } else {

                alert("Por favor, insira o valor do desperdício para avaliarmos a produção");
                start.innerText = "SEND";
                start.style.backgroundColor = "rgb(211, 208, 57)"
                iniciado = 2
                console.log(iniciado)
                console.log(status)

            }
        }
        if (status == "SEND" && iniciado == 2) {
            if (sobraValor != "") {
                const tempoAtual = functions.time()
                let seconds = tempoAtual.seconds
                fullTime += seconds
                functions.stopTimer();
                rendimento()
                start.innerText = "RESET";
                materiaSobra.style.display = "none"
            } else (alert("Por favor, forneça o valor do desperdício"))


        }


        if (producao.und.length === 0 && iniciado != 0) {
            const Chart = document.querySelector('.chart')
            Chart.removeChild(info)
            materiaValor = ""
            materia.style.display = "flex"
            materiaSobra.style.display = "none"
        }

        if (status == "RESET") { reset() }


    } else (alert('Insira o valor do peso inicial para começar'))


});
function Progress() {
    let circle = document.getElementById('progress')
    let number_progress = document.getElementById('numberProgress');
    let status = document.getElementById('avaliacao');

    let materiaValor = materia.value
    let sobraValor = materiaSobra.value

    pct = (100 - ((sobraValor * 100) / materiaValor)).toFixed(2) + "%"
    if (parseInt(pct) > 80) { status.innerText = "Ótimo" }
    else if (parseInt(pct) < 80 && parseInt(pct) > 70) { status.innerText = "Bom" }
    else if (parseInt(pct) < 70 && parseInt(pct) > 60) { status.innerText = "Regular" }
    else (status.innerText = "Ruim")

    number_progress.innerText = pct
    circle.style.strokeDashoffset = 440 - (440 * parseInt(pct)) / 100

}

function reset() {
    t = 0;
    un = 0;
    materia.value = "";
    materiaSobra.value = "";
    iniciado = 0;
    producao = { tempo: [], und: [] };

    chart.updateOptions({
        series: [{
            name: 'Tempo',
            data: producao.tempo
        }],
        xaxis: {
            categories: producao.und
        },
    });


    const info = document.getElementById('info');
    if (info) {
        info.remove();
    }
    const box = document.querySelector(".box")
    if (box) {
        box.remove();
    }

    materia.style.display = "flex";
    materiaSobra.style.display = "none";

    start.innerText = "START"
    start.style.backgroundColor = "rgb(48, 177, 48)"

}

document.getElementById('btn-count').addEventListener('click', () => {
    if (iniciado == 1) {
        const tempoAtual = functions.time()
        let seconds = tempoAtual.seconds
        producao.tempo.push(seconds)
        producao.und.push(count)

        t += seconds
        fullTime += seconds
        un = count
        console.log(producao)
        console.log(seconds)
        console.log(count)
        // if (un !== 0 && !isNaN(t) && !isNaN(un)) {
        //     mediaTempo = t / un;
        // } else {
        //     console.log("Não é possível calcular a média. Divisão por zero ou valores inválidos.");
        // }
        const inf = document.getElementById('info')
        inf.innerText = count + " - " + seconds + "s"
        functions.resetTimer();
        count++
    } else (alert('Para iniciar pressione "START"'))

})