/* CONFIGURAÇÃO DA LOJA */

// Troque pelo WhatsApp comercial da loja.
// Use o código do país + DDD + número, somente números.
const whatsappLoja = "5581992313948";

// Produtos da loja
const produtos = [
  {
    id: 1,
    nome: "Caneca Afeto",
    descricao: "Um carinho em cada gole.",
    preco: 39.90,
    imagem: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 2,
    nome: "Caneca Café com Amor",
    descricao: "Para começar o dia bem.",
    preco: 44.90,
    imagem: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 3,
    nome: "Copo Térmico Elegance",
    descricao: "Sua bebida na temperatura ideal.",
    preco: 69.90,
    imagem: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 4,
    nome: "Caneca Bom Dia",
    descricao: "Pequenos rituais, grandes momentos.",
    preco: 35.90,
    imagem: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 5,
    nome: "Caneca Aconchego",
    descricao: "Perfeita para uma pausa especial.",
    preco: 42.90,
    imagem: "https://images.unsplash.com/photo-1445116572660-236099ec97a0?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 6,
    nome: "Copo Térmico Carinho",
    descricao: "Seu café pertinho de você.",
    preco: 74.90,
    imagem: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=600&q=80"
  }
];

// Guarda os produtos e suas quantidades.
const sacola = {};

const listaProdutos = document.getElementById("lista-produtos");
const campoBusca = document.getElementById("busca");
const mensagemVazia = document.getElementById("mensagem-vazia");

// Formata os preços em reais.
function formatarPreco(valor) {
  return valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  });
}

// Exibe os produtos na vitrine.
function mostrarProdutos(filtro = "") {
  listaProdutos.innerHTML = "";

  const encontrados = produtos.filter(produto =>
    produto.nome.toLowerCase().includes(filtro.toLowerCase())
  );

  mensagemVazia.hidden = encontrados.length > 0;

  encontrados.forEach(produto => {
    const cartao = document.createElement("article");
    cartao.className = "produto";

    const imagem = document.createElement("img");
    imagem.src = produto.imagem;
    imagem.alt = produto.nome;
    imagem.loading = "lazy";

    imagem.onerror = () => {
      imagem.alt = "Imagem indisponível: " + produto.nome;
    };

    const nome = document.createElement("h3");
    nome.textContent = produto.nome;

    const descricao = document.createElement("p");
    descricao.className = "descricao";
    descricao.textContent = produto.descricao;

    const preco = document.createElement("span");
    preco.className = "preco";
    preco.textContent = formatarPreco(produto.preco);

    const botao = document.createElement("button");
    botao.className = "botao";
    botao.type = "button";
    botao.textContent = "Adicionar ao pedido";

    botao.addEventListener("click", () => {
      adicionarProduto(produto.id);
    });

    cartao.append(imagem, nome, descricao, preco, botao);
    listaProdutos.appendChild(cartao);
  });
}

// Adiciona um produto à sacola.
function adicionarProduto(id) {
  sacola[id] = (sacola[id] || 0) + 1;
  atualizarPedido();

  document.getElementById("pedido").scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
}

// Altera a quantidade de um produto.
function alterarQuantidade(id, diferenca) {
  if (!sacola[id]) return;

  sacola[id] += diferenca;

  if (sacola[id] <= 0) {
    delete sacola[id];
  }

  atualizarPedido();
}

// Retira um produto da sacola.
function removerProduto(id) {
  delete sacola[id];
  atualizarPedido();
}

// Atualiza os itens, as quantidades e o valor total.
function atualizarPedido() {
  const areaItens = document.getElementById("itens-pedido");
  areaItens.innerHTML = "";

  let total = 0;
  let quantidadeTotal = 0;

  produtos.forEach(produto => {
    const quantidade = sacola[produto.id] || 0;

    if (quantidade === 0) return;

    total += produto.preco * quantidade;
    quantidadeTotal += quantidade;

    const linha = document.createElement("div");
    linha.className = "item-pedido";

    const detalhes = document.createElement("div");

    const nome = document.createElement("span");
    nome.textContent = produto.nome;

    const controles = document.createElement("div");
    controles.className = "controles";

    const menos = document.createElement("button");
    menos.type = "button";
    menos.textContent = "−";
    menos.setAttribute("aria-label", "Diminuir quantidade");
    menos.addEventListener("click", () =>
      alterarQuantidade(produto.id, -1)
    );

    const numero = document.createElement("span");
    numero.textContent = quantidade;

    const mais = document.createElement("button");
    mais.type = "button";
    mais.textContent = "+";
    mais.setAttribute("aria-label", "Aumentar quantidade");
    mais.addEventListener("click", () =>
      alterarQuantidade(produto.id, 1)
    );

    const remover = document.createElement("button");
    remover.type = "button";
    remover.className = "remover";
    remover.textContent = "Remover";
    remover.addEventListener("click", () =>
      removerProduto(produto.id)
    );

    controles.append(menos, numero, mais, remover);
    detalhes.append(nome, controles);

    const subtotal = document.createElement("strong");
    subtotal.textContent = formatarPreco(
      produto.preco * quantidade
    );

    linha.append(detalhes, subtotal);
    areaItens.appendChild(linha);
  });

  if (quantidadeTotal === 0) {
    const vazio = document.createElement("p");
    vazio.className = "sacola-vazia";
    vazio.textContent =
      "Sua sacola está esperando um carinho!";
    areaItens.appendChild(vazio);
  }

  document.getElementById("valor-total").textContent =
    formatarPreco(total);

  document.getElementById("total-itens").textContent =
    quantidadeTotal;
}

// Busca pelo nome do produto.
campoBusca.addEventListener("input", () => {
  mostrarProdutos(campoBusca.value);
});

// Limpa a pesquisa.
document.getElementById("limpar-busca")
  .addEventListener("click", () => {
    campoBusca.value = "";
    mostrarProdutos();
    campoBusca.focus();
  });

// Prepara e envia o pedido pelo WhatsApp.
document.getElementById("form-pedido")
  .addEventListener("submit", event => {
    event.preventDefault();

    const aviso = document.getElementById("aviso-form");
    const itens = produtos.filter(p => sacola[p.id] > 0);

    if (itens.length === 0) {
      aviso.textContent =
        "Adicione pelo menos um produto antes de enviar.";
      return;
    }

    const nome = document.getElementById("nome").value.trim();
    const telefone =
      document.getElementById("telefone").value.trim();
    const entrega = document.getElementById("entrega").value;
    const endereco =
      document.getElementById("endereco").value.trim();

    const total = itens.reduce(
      (soma, produto) =>
        soma + produto.preco * sacola[produto.id],
      0
    );

    let mensagem =
      "*COM CARINHO — AFETO E CAFÉ*\n\n" +
      "*Novo pedido!*\n\n" +
      "Cliente: " + nome + "\n" +
      "Telefone: " + telefone + "\n" +
      "Recebimento: " + entrega + "\n\n" +
      "*Produtos:*\n";

    itens.forEach(produto => {
      mensagem +=
        "- " + produto.nome +
        " | Qtd.: " + sacola[produto.id] +
        " | " + formatarPreco(
          produto.preco * sacola[produto.id]
        ) + "\n";
    });

    mensagem +=
      "\n*Total dos produtos: " + formatarPreco(total) + "*";

    if (endereco) {
      mensagem += "\nObservações: " + endereco;
    }

    mensagem +=
      "\n\nGostaria de confirmar este pedido, por favor!";

    const url =
      "https://wa.me/" + whatsappLoja +
      "?text=" + encodeURIComponent(mensagem);

    aviso.textContent =
      "Abrindo o WhatsApp para você revisar e enviar o pedido.";

    window.open(url, "_blank", "noopener,noreferrer");
  });

// Inicializa a loja.
mostrarProdutos();
atualizarPedido();
