// Inicializar ícones
if (typeof lucide !== 'undefined') {
    lucide.createIcons();
}

// Variável global com persistência usando localStorage
let denunciasSalvas = JSON.parse(localStorage.getItem('denuncias')) || [
    {
        protocolo: 'DEN-123456',
        categoria: 'Infraestrutura urbana',
        bairro: 'Centro',
        rua: 'Rua Principal',
        data: '01/04/2026',
        status: 3 
    }
];

// Alternar vistas
function mudarVista(vistaId) {
    document.querySelectorAll('.view-section').forEach(el => {
        el.classList.remove('active');
    });
    
    const targetView = document.getElementById('view-' + vistaId);
    if (targetView) targetView.classList.add('active');
    
    if(vistaId === 'form') {
        const denunciaForm = document.getElementById('denunciaForm');
        if(denunciaForm) denunciaForm.reset();
    } else if (vistaId === 'track') {
        const trackForm = document.getElementById('trackForm');
        if(trackForm) trackForm.reset();
        
        document.getElementById('track-result')?.classList.add('hidden');
        document.getElementById('track-error')?.classList.add('hidden');
    }
}

// Gerar protocolo
function gerarNumeroProtocolo() {
    const numero = Math.floor(100000 + Math.random() * 900000);
    return `DEN-${numero}`;
}

// Enviar formulário
function enviarDenuncia(event) {
    event.preventDefault();

    const categoria = document.getElementById('categoria').value;
    const bairro = document.getElementById('bairro').value;
    const rua = document.getElementById('rua').value;

    const protocolo = gerarNumeroProtocolo();
    const hoje = new Date();
    const dataFormatada = hoje.toLocaleDateString('pt-BR');

    const novaDenuncia = {
        protocolo: protocolo,
        categoria: categoria,
        bairro: bairro,
        rua: rua,
        data: dataFormatada,
        status: 1 
    };

    // Salvar no array e no localStorage
    denunciasSalvas.push(novaDenuncia);
    localStorage.setItem('denuncias', JSON.stringify(denunciasSalvas));

    document.getElementById('protocolo-display').textContent = protocolo;
    mudarVista('success');
}

// Buscar status
function buscarDenuncia(event) {
    event.preventDefault();
    
    const inputProto = document.getElementById('inputProtocolo').value.trim().toUpperCase();
    const resultDiv = document.getElementById('track-result');
    const errorDiv = document.getElementById('track-error');

    const denunciaEncontrada = denunciasSalvas.find(d => d.protocolo === inputProto);

    if (denunciaEncontrada) {
        errorDiv.classList.add('hidden');
        resultDiv.classList.remove('hidden');

        document.getElementById('res-categoria').textContent = denunciaEncontrada.categoria;
        document.getElementById('res-data').textContent = denunciaEncontrada.data;

        atualizarTimeline(denunciaEncontrada.status);
    } else {
        resultDiv.classList.add('hidden');
        errorDiv.classList.remove('hidden');
    }
}

// Atualizar Timeline
function atualizarTimeline(nivelStatus) {
    const statusIds = ['dot-recebida', 'dot-analise', 'dot-encaminhada', 'dot-concluida'];
    
    statusIds.forEach((id, index) => {
        const el = document.getElementById(id);
        if (el) {
            if (index < nivelStatus) {
                el.classList.add('active', 'bg-indigo-600');
            } else {
                el.classList.remove('active', 'bg-indigo-600');
            }
        }
    });
}