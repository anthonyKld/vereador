// Função para converter CSV em JSON
function csvParaJson(csv) {
    const linhas = csv.split('\n');
    const cabecalho = linhas[0].split(',');

    const json = linhas.slice(1).map(linha => {
        const valores = linha.split(',');
        let objeto = {};
        cabecalho.forEach((coluna, index) => {
            objeto[coluna.trim()] = valores[index] ? valores[index].trim() : null;
        });
        return objeto;
    });

    console.log(json);

    return json;
}

// Função para contar quantas pesquisas cada entrevistador fez
function contarPesquisasPorEntrevistador(dados) {
    const contador = {};
    
    dados.forEach((item) => {
        const entrevistador = item["Nome do pesquisador:"];
        if (entrevistador) {
            contador[entrevistador] = (contador[entrevistador] || 0) + 1;
        }
    });
    
    return contador;
}

// Função para gerar o gráfico com Chart.js
function gerarGrafico(pesquisasPorEntrevistador) {
    const nomesEntrevistadores = Object.keys(pesquisasPorEntrevistador);
    const quantidadesPesquisas = Object.values(pesquisasPorEntrevistador);

    const ctx = $('#graficoPesquisas')[0].getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: nomesEntrevistadores,
            datasets: [{
                label: 'Quantidade de Pesquisas',
                data: quantidadesPesquisas,
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// Função para contar as respostas "Sim" e "Não"
function contarRespostas(dados, pergunta) {
    const respostas = { "Sim": 0, "Não": 0 };

    dados.forEach(item => {
        const resposta = item[pergunta];
        if (resposta === "Sim") {
            respostas["Sim"]++;
        } else {
            respostas["Não"]++;
        }
    });

    return respostas;
}

// Função para criar gráficos de pizza para cada pergunta
function criarGraficos(dados, perguntas) {
    perguntas.forEach(pergunta => {
        const respostas = contarRespostas(dados, pergunta);
        const ctx = $('<canvas style="width: 270px; height: 270px;"></canvas>');
        const container = $('<div class="chart-container"></div>').append(ctx);
        $('#chartsContainer').append(container);

        new Chart(ctx[0], {
            type: 'pie',
            data: {
                labels: ['Sim', 'Não'],
                datasets: [{
                    label: 'Quantidade de Respostas',
                    data: [respostas["Sim"], respostas["Não"]],
                    backgroundColor: ['#36A2EB', '#FF6384'],
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    title: {
                        display: true,
                        text: pergunta
                    }
                }
            }
        });
    });
}

// Função para armazenar os dados no localStorage
function armazenarDados(jsonData) {
    localStorage.setItem('dadosPesquisas', JSON.stringify(jsonData));
}

// Função para carregar dados do localStorage
function carregarDados() {
    const dados = localStorage.getItem('dadosPesquisas');
    return dados ? JSON.parse(dados) : [];
}

// Manipulador do evento do botão para gerar o gráfico
$('#generateChartBtn').on('click', function () {
    const inputFile = $('#csvFile')[0].files[0];

    if (inputFile) {
        const reader = new FileReader();
        reader.onload = function (event) {
            const csv = event.target.result;
            const jsonData = csvParaJson(csv);

            // Armazenar dados no localStorage
            armazenarDados(jsonData);

            // Contar a quantidade de pesquisas por entrevistador
            const pesquisasPorEntrevistador = contarPesquisasPorEntrevistador(jsonData);
            gerarGrafico(pesquisasPorEntrevistador);

            // Criar gráficos para perguntas específicas
            const perguntas = [
                "Um colégio mais próximo?",
                "A postos de saúde mais próximo?",
                "O atendimento nos postos de saúde é de qualidade?",
                "Falta médico para atendimento específico?",
                "Você mora em casa própria?",
                "Você possui título definitivo?",
                "Gostaria de reivindicar o título definitivo do seu imóvel?",
                "Você tem acesso a água potável?",
                "Existe redes de esgoto na sua rua?",
                "Há vazamento de esgoto na rua?",
                "A rua onde você mora é asfaltada?",
                "Existe iluminação pública?",
                "Existem calçadas adequadas?",
                "Existe alagamentos quando chove?",
                "Existe ônibus perto da sua residência?",
                "Os horários de frequência dos ônibus atendem a sua necessidade?",
                // Adicione outras perguntas conforme necessário
            ];

            criarGraficos(jsonData, perguntas);
        };
        reader.readAsText(inputFile);
    } else {
        alert('Por favor, selecione um arquivo CSV.');
    }
});

// Carregar dados do localStorage na inicialização da página
$(document).ready(function () {
    const dadosArmazenados = carregarDados();
    if (dadosArmazenados.length > 0) {
        const pesquisasPorEntrevistador = contarPesquisasPorEntrevistador(dadosArmazenados);
        gerarGrafico(pesquisasPorEntrevistador);
        
        const perguntas = [
            "Um colégio mais próximo?",
                "A postos de saúde mais próximo?",
                "O atendimento nos postos de saúde é de qualidade?",
                "Falta médico para atendimento específico?",
                "Você mora em casa própria?",
                "Você possui título definitivo?",
                "Gostaria de reivindicar o título definitivo do seu imóvel?",
                "Você tem acesso a água potável?",
                "Existe redes de esgoto na sua rua?",
                "Há vazamento de esgoto na rua?",
                "A rua onde você mora é asfaltada?",
                "Existe iluminação pública?",
                "Existem calçadas adequadas?",
                "Existe alagamentos quando chove?",
                "Existe ônibus perto da sua residência?",
                "Os horários de frequência dos ônibus atendem a sua necessidade?",
            // Adicione outras perguntas conforme necessário
        ];
        
        criarGraficos(dadosArmazenados, perguntas);
    }
});
