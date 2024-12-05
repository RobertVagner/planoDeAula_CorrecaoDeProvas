// Inicializa Firestore
const db = firebase.firestore();
let parsedData = []; // Variável para armazenar os dados convertidos

// Adiciona o evento de change no input de arquivo
document.getElementById('csv-file').addEventListener('change', handleFileSelect, false);

// Captura o ID da disciplina da URL
const disciplinaId = new URLSearchParams(window.location.search).get('id');

// Função para processar o CSV e converter os dados
function handleFileSelect(event) {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = function(event) {
        const csv = event.target.result;
        const rows = csv.split('\n');

        parsedData = [];

        for (let i = 0; i < rows.length; i++) {
            const rowData = rows[i].split(',');

            if (rowData.length >= 3) { // Verifica se há pelo menos 3 colunas (data, nome, email)
                const provaData = {
                    data: new Date(rowData[0]),
                    descricao: `Prova de ${rowData[1]}`,
                    disciplina_id: disciplinaId // Adiciona o ID da disciplina aqui
                };

                const alunoData = {
                    nome: rowData[1],
                    email: rowData[2],
                    senha: 'senha_padrao' // A senha padrão pode ser ajustada conforme necessário
                };

                const questoes = [];
                for (let j = 3; j < rowData.length; j++) {
                    const questaoData = {
                        enunciado: rowData[j]
                    };
                    questoes.push(questaoData);
                }

                parsedData.push({
                    provaData,
                    alunoData,
                    questoes
                });
            }
        }

        displayData(parsedData);
        document.getElementById('upload-button').style.display = 'inline-block'; // Exibir o botão de upload
    };

    reader.onerror = function() {
        alert('Não foi possível ler o arquivo.');
    };

    reader.readAsText(file);
}

// Função para exibir os dados convertidos
function displayData(data) {
    const container = document.getElementById('data-container');
    container.innerHTML = '';

    data.forEach((item, index) => {
        const row = document.createElement('div');
        row.classList.add('row');

        const provaInfo = `
            <div><strong>Prova ${index + 1}:</strong></div>
            <div>Data: ${item.provaData.data.toLocaleDateString()}</div>
            <div>Descrição: ${item.provaData.descricao}</div>
            <div>Aluno: ${item.alunoData.nome} (${item.alunoData.email})</div>
            <div>Questões:</div>
            <ul>
                ${item.questoes.map(q => `<li>${q.enunciado}</li>`).join('')}
            </ul>
        `;

        row.innerHTML = provaInfo;
        container.appendChild(row);
    });
}

// Função para enviar os dados ao Firestore
document.getElementById('upload-button').addEventListener('click', async function() {
    for (const item of parsedData) {
        try {
            // Adicionar prova ao Firestore
            const provaRef = await db.collection('provas').add(item.provaData);
            const provaId = provaRef.id;

            // Adicionar aluno ao Firestore (usando email como ID para evitar duplicatas)
            const alunoRef = db.collection('alunos').doc(item.alunoData.email);
            await alunoRef.set(item.alunoData, { merge: true });

            // Adicionar questões ao Firestore
            for (const questaoData of item.questoes) {
                const questaoRef = await db.collection('questoes').add({ ...questaoData, prova_id: provaId });
                const questaoId = questaoRef.id;

                // Adicionar resposta ao Firestore (relacionando aluno e questão)
                const respostaData = {
                    aluno_id: item.alunoData.email,
                    questao_id: questaoId,
                    resposta: '' // Adicione a resposta do aluno aqui, se disponível
                };

                await db.collection('respostas').add(respostaData);
            }
        } catch (error) {
            console.error('Erro ao adicionar dados ao Firestore:', error);
        }
    }

    alert('Dados adicionados ao banco de dados com sucesso!');
});
