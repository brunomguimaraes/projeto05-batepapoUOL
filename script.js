const user = prompt ("qual a vossa graça?");

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

}
manterConexão();

function errorConnection () {
    alert ("Você perdeu a conexão");
    window.location.reload();
}
//termina o manter conexão 
