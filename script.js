const user = prompt ("qual a vossa graça?");
let mensagemQueTavaAntes = "";

function entrarNaSala () {
    const promise = axios.post('https://mock-api.bootcamp.respondeai.com.br/api/v3/uol/participants',
    {
        name: user
    }
    );
    promise.catch (quandoErro);

}
entrarNaSala();

function quandoErro(erro) {
    if (erro.response.status === 400){
        alert("já existe um usuário com esse nome ou o campo está vazio, por favor insira um nome válido");
    }
    window.location.reload();

}
//termina meu entrar na sala 

//começa manter conexão
function userConnected () {
    const promise = axios.post('https://mock-api.bootcamp.respondeai.com.br/api/v3/uol/status',
    {
        name: user
    }
    );
    promise.catch(errorConnection);

}

function manterConexão () {
    setInterval (userConnected, 5000);
    setInterval (buscarMensagem, 3000);

}
manterConexão();

function errorConnection () {
    alert ("Você perdeu a conexão");
    window.location.reload();
}
//termina o manter conexão 

//começa receber mensagem 

function buscarMensagem() {
    const promise = axios.get('https://mock-api.bootcamp.respondeai.com.br/api/v3/uol/messages');
    promise.then(pegarMensagem);
}

function pegarMensagem (mensagem) {
    const messageArea = document.querySelector(".container-message ul");
    messageArea.innerHTML = '';
    let messageCompleted = '';

    for (i= 0; i < mensagem.data.length ; i++) {
        if (mensagem.data[i].type === "status") {
            messageCompleted = `<li class="status"> <span> 
            <span class="time">(${mensagem.data[i].time})</span> 
            <strong>${mensagem.data[i].from}</strong> 
            ${mensagem.data[i].text}
            </span></li> `

        }
        if (mensagem.data[i].type === "message"){
            messageCompleted = `<li class="normal"> <span> 
            <span class="time">(${mensagem.data[i].time})</span> 
            <strong>${mensagem.data[i].from}</strong> 
            para <strong>${mensagem.data[i].to}:</strong>
            ${mensagem.data[i].text}
            </span></li> `

        }
        if (mensagem.data[i].type === "private_message"){
            messageCompleted = `<li class="reservado"> <span> 
            <span class="time">(${mensagem.data[i].time})</span> 
            <strong>${mensagem.data[i].from}</strong> 
            reservadamente para <strong>${mensagem.data[i].to}:</strong>
            ${mensagem.data[i].text}
            </span></li> `

        }
        if (mensagem.data[i].type === "message" || 
            mensagem.data[i].type === "status" || 
            mensagem.data[i].from === user || 
            mensagem.data[i].to === user){ 
                messageArea.innerHTML += messageCompleted;

        }
      
    }
    const ultimoElemento = document.querySelector (".container-message li:last-of-type");
    if(ultimoElemento.innerHTML !== mensagemQueTavaAntes.innerHTML) {
        ultimoElemento.scrollIntoView();

    }
    mensagemQueTavaAntes = ultimoElemento;
    
}

//aqui começa enviar menssagem
function sendMessage () {
    let text = document.querySelector("input").value;
    const promise = axios.post ('https://mock-api.bootcamp.respondeai.com.br/api/v3/uol/messages',
    {
    from: user,
	to: "todos",
	text: text,
	type: "message"
    }
    ); 
    promise.then (buscarMensagem);
    promise.catch (errorSending);
    
}
let input = document.querySelector("input");
input.addEventListener ("keyup", function (event){
    if (event.key === "Enter") {
        event.preventDefault();
        sendMessage();
    }
}
); 

function errorSending (error) {
    alert ('Ocorreu um erro no envio, a página será atualizada')
    window.location.reload();
}