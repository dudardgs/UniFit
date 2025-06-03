// Chama a função quando o botão é clicado - Função para validação de Formulario
var formulario = document.getElementById('cadastroUnifit');
        

formulario.addEventListener('submit', function(event){
    event.preventDefault(); // Evita o envio do formulário

    // Declarações de Variaveis
    let nome = document.getElementById('nome').value.trim();
    let cpf = document.getElementById('cpf').value.trim();
    let email = document.getElementById('email').value.trim();
    let sexo = document.getElementById('sexo').value.trim();
    let data_nascimento = document.getElementById('data_nascimento').value.trim();
    let telefone = document.getElementById('telefone').value.trim();
    let celular = document.getElementById('celular').value.trim();
    let cep = document.getElementById('cep').value.trim();
    let endereco = document.getElementById('endereco').value.trim();
    let login = document.getElementById('login').value.trim();
    let senha = document.getElementById('idSenha').value.trim();
    let confirmarSenha = document.getElementById('idconfirmarSenha').value.trim(); 

    
    // Variável que armazena as mensagens do modal
    let mensagem_de_erro = "";

    // Verifica se todos os campos estão preenchidos - Item 1
    if (!nome || !cpf || !email || !sexo || !data_nascimento|| !telefone || !celular || !cep || !endereco || !login || !senha || !confirmarSenha)
    {
        mensagem_de_erro = ('Todos os campos devem ser preenchidos!');
    }

    // Verifica se o nome tem pelo menos 15 caracteres - Item 2
    else if (nome.length < 15 || nome.length > 80)
    {
            mensagem_de_erro = ('O nome deve ter entre 15 e 80 caracteres!');
    }

    // Verifica se o CPF é válido - Item 3
    else if (!validaCPF(cpf)) {
        mensagem_de_erro = ('CPF inválido! Por favor, insira um CPF válido.');
    }
    
    // Valida se o campo sexo foi preenchido corretamente (Necessário!)
    else if (sexo === 'Selecione uma opção')
    {
        mensagem_de_erro = ('O campo sexo precisa ser preenchido!')
    }

    //Verifica se o usuário tem idade mínima
    else if (!validaIdade()){
        mensagem_de_erro = ('Usuário menor de 16 anos. Não pode seguir com o cadastro!');
    }

    // Verifica se o campo de contato foram digitados corretamente
    else if(telefone.length < 17 || celular.length < 18 ){
        mensagem_de_erro =('Campo de telefone ou celular incorretos!')
    }
   
    // Verifica se o login tem exatamente 6 caracteres - Item 6
    else if (login.length !== 6){
        mensagem_de_erro = ('Login deve ter exatemente 6 caracteres');
    }

    // Verifica se a senha tem exatamente 8 caracteres - Item 7
    else if (senha.length !== 8) {
        mensagem_de_erro = ('A senha deve ter exatamente 8 caracteres.');
    }

    // Verifica se as senhas são iguais - Item 8
    else if (senha !== confirmarSenha) {
        mensagem_de_erro = ('As senhas não coincidem.');
    }

    // Chama o modal
    if (mensagem_de_erro) {
        showModal(mensagem_de_erro);
        return;
    }
    
    // Objeto para armazenar os dados no localstorage
    let usuario = {
        nome: nome,
        cpf: cpf,
        email: email,
        sexo: sexo,
        data_nascimento: data_nascimento,
        telefone: telefone,
        celular: celular,
        cep: cep,
        endereco: endereco,
        login: login,
        senha: senha,
        confirmarSenha: confirmarSenha,
        logado: false // Indica estado de login
    };

    //Armazena os dados no localStorage
    localStorage.setItem('usuario', JSON.stringify(usuario))

    // Se todos os campos estiverem corretos, o formulário será enviado.
    alert('Formulário enviado com sucesso!');
    formulario.submit();
    window.location.href = 'login.html'; 
    
});

// Formatos com Jquery - Item 5
$(document).ready(function(){
    //Telefone
    $('#telefone').mask('55 (00) 0000-0000');
    //Celular
    $('#celular').mask('55 (00) 00000-0000');
    //Cep
    $('#cep').mask('00000-000');
});

//Implementação do Modal
function showModal(mensagem) {
    let mensagem_erro = document.getElementById('MensagemDeErro');
    mensagem_erro.textContent = mensagem;
    let erroModal = new bootstrap.Modal(document.getElementById('erroModal'));
    erroModal.show();
}

// Verifica a idade minima do usuário, 16 anos. (Regra de Negócios)
function validaIdade(){
    // Puxa a data de nascimento
    let nascimento = document.getElementById('data_nascimento').value.trim();
    
    // Puxa a data de hoje e extrai o ano vigente
    let hoje = new Date();
    let anoAtual = hoje.getFullYear();

    //Extrai o ano de nascimento do usuário
    let anoNascimento = new Date(nascimento).getFullYear();
    
    // Calcula a idade do usuário
    let idade = anoAtual - anoNascimento;
    // Retornar se o usuário é menor de 16 anos
    return idade >= 16;
}

// Função de validação do digito verificador do CPF - item 3
// Mascara do CPF e só permite a entrada de números
$(document).ready(function(){
    $('#cpf').mask('000.000.000-00');
});

function validaCPF(cpf){
    
    //Remove os caracteres não númericos
    cpf = cpf.replace(/\D/g, '');

    // Verifica se o CPF tem 11 dígitos ou se é uma sequência repetida
    if(cpf.length!== 11 || /^(\d)\1+$/.test(cpf)){
        return false;
    }

    // Função que calcula o digito verificador
    function calculaDigito(base){
        let soma = 0;
        let peso = base + 1;

        for (let i = 0; i < base; i++){
            soma += parseInt(cpf[i]) * (peso--);
        }

        let resto = soma % 11;
        return resto < 2 ? 0 : 11 - resto;
    }

    // Verifica o 1º digito verificador
    let primeiroDigito = calculaDigito(9);
    if(primeiroDigito !== parseInt(cpf[9])){
        return false;
    }

    // Verifica o 2º digito verificador
    let segundoDigito = calculaDigito(10);
    if(segundoDigito !== parseInt(cpf[10])){
        return false;
    }

    return true;
}

//Validação do CEP com API - Item 4
// Evento 'blur' para buscar o CEP
cep.addEventListener('blur', () => {
// Atualiza o valor do CEP removendo caracteres não numéricos
const cepValue = cep.value.replace(/\D/g, '');

// Verifica se o CEP tem 8 dígitos
if (cepValue.length !== 8) {
    showModal("CEP inválido! O CEP deve ter 8 dígitos.");
    endereco.disabled = false;
    return;
}

// URL da API com o CEP
let viaCep = (`https://viacep.com.br/ws/${cepValue}/json/`);

// Requisição para a API
fetch(viaCep)
    .then(response => {
        if (!response.ok) throw new Error("Erro na requisição");
        return response.json();
    })
    .then(data => {
        if (data.erro) {
            showModal("CEP não encontrado! Preencha o endereço manualmente.");
            endereco.value = "";
            endereco.disabled = false;
        } else {
            endereco.value = `${data.logradouro}, ${data.bairro}, ${data.uf}`;
        }
    })
    .catch(() => {
        showModal("Erro ao buscar o CEP! Preencha o endereço manualmente.");
        endereco.value = "";
        endereco.disabled = false;
    });
});

