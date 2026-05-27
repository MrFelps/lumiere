const http = require("http");

const BASE = "http://localhost:3000";
let token = "";
let resultados = { passou: 0, falhou: 0 };

function requisicao(method, path, body = null, authToken = null) {
  return new Promise((resolve, reject) => {
    const dados = body ? JSON.stringify(body) : null;
    const headers = { "Content-Type": "application/json" };
    if (authToken) headers["Authorization"] = `Bearer ${authToken}`;
    if (dados) headers["Content-Length"] = Buffer.byteLength(dados);

    const req = http.request(`${BASE}${path}`, { method, headers }, (res) => {
      let resposta = "";
      res.on("data", chunk => resposta += chunk);
      res.on("end", () => {
        try { resolve({ status: res.statusCode, body: JSON.parse(resposta) }); }
        catch { resolve({ status: res.statusCode, body: resposta }); }
      });
    });
    req.on("error", reject);
    if (dados) req.write(dados);
    req.end();
  });
}

function checar(descricao, condicao) {
  if (condicao) { console.log(`  PASSOU: ${descricao}`); resultados.passou++; }
  else { console.log(`  FALHOU: ${descricao}`); resultados.falhou++; }
}

async function rodarTestes() {
  console.log("Iniciando testes...\n");
  try {
    console.log("Health Check");
    const r = await requisicao("GET", "/");
    checar("GET / retorna 200", r.status === 200);

    console.log("\nCadastro e Login");
    const cadastro = await requisicao("POST", "/usuarios/cadastrar", { nome: "Teste", email: "teste@email.com", senha: "123456" });
    checar("Cadastro retorna 201", cadastro.status === 201);
    const loginOk = await requisicao("POST", "/usuarios/login", { email: "teste@email.com", senha: "123456" });
    checar("Login retorna token", !!loginOk.body.token);
    token = loginOk.body.token;

    console.log("\nOpinioes");
    const lista = await requisicao("GET", "/feed/opinioes", null, token);
    checar("Listar opinioes retorna 200", lista.status === 200);
    const nova = await requisicao("POST", "/feed/opinioes", { filme: "Interstellar", nota: 5, opiniao: "Incrivel!" }, token);
    checar("Criar opiniao retorna 201", nova.status === 201);

    console.log("\nWatchlist");
    const wl = await requisicao("GET", "/feed/watchlist", null, token);
    checar("Listar watchlist retorna 200", wl.status === 200);
    const add = await requisicao("POST", "/feed/watchlist", { filmeId: 550, titulo: "Clube da Luta" }, token);
    checar("Adicionar watchlist retorna 201", add.status === 201);

    console.log("\n---------------------");
    console.log("Passou: " + resultados.passou);
    console.log("Falhou: " + resultados.falhou);
  } catch (err) {
    console.error("Erro: " + err.message);
    console.error("Certifique-se que o servidor esta rodando com: npm run dev");
  }
}

rodarTestes();
