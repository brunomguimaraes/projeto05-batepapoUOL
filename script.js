const user = prompt ("Qual seu nome?");
let previousMessage = "";
let messageCompleted = '';

function enterChat () {
    const promise = axios.post('https://mock-api.bootcamp.respondeai.com.br/api/v3/uol/participants',
    {
        name: user
    }
    );

    promise.catch (isError);
}
enterChat();

function isError(error) {
    if (error.response.status === 400){
        alert("Já existe um usuário com esse nome ou o campo está vazio, por favor insira um nome válido");
    }
    window.location.reload();
}

function userConnected () {
    const promise = axios.post('https://mock-api.bootcamp.respondeai.com.br/api/v3/uol/status',
    {
        name: user
    }
    );

    promise.catch(errorConnection);
}

function keepConnection () {
    setInterval (userConnected, 5000);
    setInterval (getMessage, 3000);

}
keepConnection();

function errorConnection () {
    alert ("Você perdeu a conexão, a página será atualizada");
    window.location.reload();
}

function getMessage() {
    const promise = axios.get('https://mock-api.bootcamp.respondeai.com.br/api/v3/uol/messages');
    promise.then(formulatingMessages);
}

function formulatingMessages (message) {
    const messageArea = document.querySelector(".containerMessage ul");
    messageArea.innerHTML = '';
    messageCompleted = '';

    for (i= 0; i < message.data.length ; i++) {
        isStatus (message, i);
        isPublic (message, i);
        isPrivate (message, i);
        shouldUserSeeMessage(message, i, messageArea);
    }
    scroll ();
}

function isStatus (message, i) {
    if (message.data[i].type === "status") {
        messageCompleted = `<li class="status"> <span> 
        <span class="time">(${message.data[i].time})</span> 
        <strong>${message.data[i].from}</strong> 
        ${message.data[i].text}
        </span></li> `
    }
}

function isPublic (message, i) {
    if (message.data[i].type === "message") {
        messageCompleted = `<li class="public"> <span> 
        <span class="time">(${message.data[i].time})</span> 
        <strong>${message.data[i].from}</strong> 
        para <strong>${message.data[i].to}:</strong>
        ${message.data[i].text}
        </span></li> `
    }
}

function isPrivate (message, i) {
    if (message.data[i].type === "private_message") {
        messageCompleted = `<li class="private"> <span> 
        <span class="time">(${message.data[i].time})</span> 
        <strong>${message.data[i].from}</strong> 
        reservadamente para <strong>${message.data[i].to}:</strong>
        ${message.data[i].text}
        </span></li> `
    }
}

function shouldUserSeeMessage (message, i, messageArea) {
    if (message.data[i].type === "message" || 
        message.data[i].type === "status" || 
        message.data[i].from === user || 
        message.data[i].to === user) { 
            messageArea.innerHTML += messageCompleted;
    }
}

function scroll () {
    const lastMessage = document.querySelector (".containerMessage li:last-of-type");
    if(lastMessage.innerHTML !== previousMessage.innerHTML) {
        lastMessage.scrollIntoView();

    }
    previousMessage = lastMessage;
}

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

    promise.then (getMessage);
    promise.catch (errorSending);

    resetInput();
}

function clickEnter () {
    let input = document.querySelector("input");
    input.addEventListener ("keyup", function (event) {
        if (event.key === "Enter") {
            event.preventDefault();
            sendMessage();
        }
    }
    );
}
clickEnter();

function resetInput () {
    let input = document.querySelector("input");
    input.value = '';
}

function errorSending (error) {
    alert ('Ocorreu um error no envio, a página será atualizada');
    window.location.reload();
}