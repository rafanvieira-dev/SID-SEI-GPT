const STORAGE_KEY = "sid-sei-demo-v1";

const statusMap = {
  "Solicitação": ["blue", "Solicitação"],
  "Recebido": ["orange", "Recebido"],
  "Aguardando digitalização": ["orange", "Aguardando digitalização"],
  "Em digitalização": ["blue", "Em digitalização"],
  "Aguardando conferência": ["purple", "Aguardando conferência"],
  "Reprovado": ["red", "Reprovado"],
  "Aguardando inserção no SEI": ["purple", "Aguardando inserção no SEI"],
  "Pendência SEI": ["red", "Pendência SEI"],
  "Concluído": ["green", "Concluído"]
};

const seed = {
  users: [
    {
      id: 1,
      name: "Gabriela Martins",
      profile: "Gestor",
      unit: "Arquivo Central",
      active: true
    },
    {
      id: 2,
      name: "Carlos Henrique",
      profile: "Operador de digitalização",
      unit: "Arquivo Central",
      active: true
    },
    {
      id: 3,
      name: "Mariana Alves",
      profile: "Conferente",
      unit: "Arquivo Central",
      active: true
    },
    {
      id: 4,
      name: "Paulo Mendes",
      profile: "Responsável pela inserção no SEI",
      unit: "Protocolo",
      active: true
    }
  ],

  requests: [
    {
      id: "SID-2026-00018",
      unit: "Coordenação Administrativa",
      requester: "Ana Paula Costa",
      date: "2026-10-07",
      description: "Processo de contratação de serviço de manutenção",
      documents: 12,
      status: "Aguardando conferência",
      priority: "Normal",
      responsible: "Carlos Henrique",
      sei: "",
      pages: 148,
      file: "contratacao_manutencao.pdf",
      format: "PDF/A"
    },
    {
      id: "SID-2026-00017",
      unit: "Diretoria de Gestão",
      requester: "Marcos Silva",
      date: "2026-10-06",
      description: "Documentação funcional — pasta 2024",
      documents: 8,
      status: "Aguardando inserção no SEI",
      priority: "Alta",
      responsible: "Mariana Alves",
      sei: "23069.123456/2026-11",
      pages: 96,
      file: "pasta_funcional_2024.pdf",
      format: "PDF/A"
    },
    {
      id: "SID-2026-00016",
      unit: "Compras",
      requester: "Juliana Rocha",
      date: "2026-10-03",
      description: "Notas fiscais e documentos de aquisição",
      documents: 21,
      status: "Concluído",
      priority: "Normal",
      responsible: "Paulo Mendes",
      sei: "23069.112233/2026-44",
      pages: 302,
      file: "compras_outubro.pdf",
      format: "PDF/A"
    },
    {
      id: "SID-2026-00015",
      unit: "Recursos Humanos",
      requester: "Felipe Gomes",
      date: "2026-10-02",
      description: "Dossiê de servidor — documentação física",
      documents: 6,
      status: "Recebido",
      priority: "Normal",
      responsible: "Carlos Henrique",
      sei: "",
      pages: 0,
      file: "",
      format: ""
    },
    {
      id: "SID-2026-00014",
      unit: "Patrimônio",
      requester: "Luciana Reis",
      date: "2026-09-30",
      description: "Termos de responsabilidade patrimonial",
      documents: 15,
      status: "Reprovado",
      priority: "Alta",
      responsible: "Mariana Alves",
      sei: "",
      pages: 176,
      file: "patrimonio_termos.pdf",
      format: "PDF/A"
    }
  ],

  history: [
    {
      request: "SID-2026-00018",
      date: "07/10/2026 09:12",
      action: "Solicitação criada",
      user: "Ana Paula Costa",
      detail: "Solicitação encaminhada pela Coordenação Administrativa."
    },
    {
      request: "SID-2026-00018",
      date: "07/10/2026 10:03",
      action: "Recebimento registrado",
      user: "Carlos Henrique",
      detail: "12 documentos físicos recebidos."
    },
    {
      request: "SID-2026-00018",
      date: "07/10/2026 11:25",
      action: "Digitalização realizada",
      user: "Carlos Henrique",
      detail: "148 páginas associadas ao registro."
    },
    {
      request: "SID-2026-00018",
      date: "07/10/2026 13:40",
      action: "Conferência iniciada",
      user: "Mariana Alves",
      detail: "Documento encaminhado para verificação."
    },
    {
      request: "SID-2026-00017",
      date: "06/10/2026 15:10",
      action: "Conferência aprovada",
      user: "Mariana Alves",
      detail: "Documento liberado para inserção no SEI."
    },
    {
      request: "SID-2026-00017",
      date: "06/10/2026 16:02",
      action: "Aguardando inserção no SEI",
      user: "Mariana Alves",
      detail: "Processo SEI informado: 23069.123456/2026-11."
    }
  ]
};

let db = carregarBanco();
let currentView = "dashboard";

function carregarBanco() {
  const dados = localStorage.getItem(STORAGE_KEY);

  if (!dados) {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(seed)
    );

    return JSON.parse(
      JSON.stringify(seed)
    );
  }

  try {
    return JSON.parse(dados);
  } catch (erro) {
    return JSON.parse(
      JSON.stringify(seed)
    );
  }
}

function salvarBanco() {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(db)
  );
}

function escapeHTML(valor) {
  return String(valor ?? "").replace(
    /[&<>"']/g,
    function(c) {
      return {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
      }[c];
    }
  );
}

function dataAtual() {
  return new Date()
    .toISOString()
    .slice(0, 10);
}

function dataHoraAtual() {
  return new Date().toLocaleString(
    "pt-BR",
    {
      dateStyle: "short",
      timeStyle: "short"
    }
  );
}

function formatarData(data) {
  if (!data) return "-";

  const partes = data.split("-");

  if (partes.length !== 3) {
    return data;
  }

  return `${partes[2]}/${partes[1]}/${partes[0]}`;
}

function badgeStatus(status) {
  const info =
    statusMap[status] ||
    ["gray", status];

  return `
    <span class="badge ${info[0]}">
      ${escapeHTML(info[1])}
    </span>
  `;
}

function mostrarMensagem(texto) {
  const toast =
    document.getElementById("toast");

  if (!toast) return;

  toast.textContent = texto;
  toast.classList.add("show");

  clearTimeout(window.toastTimer);

  window.toastTimer =
    setTimeout(function() {
      toast.classList.remove("show");
    }, 2500);
}

function adicionarHistorico(
  solicitacao,
  acao,
  usuario,
  detalhe
) {
  db.history.unshift({
    request: solicitacao,
    date: dataHoraAtual(),
    action: acao,
    user: usuario,
    detail: detalhe || ""
  });
}

function buscarSolicitacao(id) {
  return db.requests.find(
    function(item) {
      return item.id === id;
    }
  );
}

function gerarNumeroSolicitacao() {
  const ano =
    new Date().getFullYear();

  const numeros =
    db.requests
      .map(function(item) {
        return Number(
          item.id.split("-").pop()
        );
      })
      .filter(function(numero) {
        return Number.isFinite(numero);
      });

  const maior =
    Math.max(0, ...numeros);

  const proximo =
    String(maior + 1)
      .padStart(5, "0");

  return `SID-${ano}-${proximo}`;
}

const nomesViews = {
  dashboard: "Dashboard",
  solicitacoes: "Solicitações",
  recebimento: "Recebimento",
  digitalizacao: "Digitalização",
  conferencia: "Conferência",
  sei: "Inserção no SEI",
  historico: "Histórico",
  relatorios: "Relatórios",
  usuarios: "Usuários",
  configuracoes: "Configurações"
};

function renderizar() {
  document
    .querySelectorAll(".nav-item")
    .forEach(function(botao) {
      botao.classList.toggle(
        "active",
        botao.dataset.view ===
          currentView
      );
    });

  const breadcrumb =
    document.getElementById(
      "breadcrumb"
    );

  if (breadcrumb) {
    breadcrumb.textContent =
      nomesViews[currentView];
  }

  const app =
    document.getElementById("app");

  if (app) {
    app.innerHTML =
      renderizarView(currentView);
  }

  configurarEventos();
}

function renderizarView(view) {
  switch (view) {
    case "dashboard":
      return dashboard();

    case "solicitacoes":
      return solicitacoes();

    case "recebimento":
      return etapa(
        "Recebimento",
        ["Recebido"],
        "Registrar recebimento"
      );

    case "digitalizacao":
      return etapa(
        "Digitalização",
        [
          "Aguardando digitalização",
          "Em digitalização",
          "Reprovado"
        ],
        "Registrar digitalização"
      );

    case "conferencia":
      return conferencia();

    case "sei":
      return insercaoSEI();

    case "historico":
      return historico();

    case "relatorios":
      return relatorios();

    case "usuarios":
      return usuarios();

    case "configuracoes":
      return configuracoes();

    default:
      return dashboard();
  }
}

function dashboard() {
  const total =
    db.requests.length;

  const andamento =
    db.requests.filter(
      function(item) {
        return item.status !==
          "Concluído";
      }
    ).length;

  const concluidas =
    db.requests.filter(
      function(item) {
        return item.status ===
          "Concluído";
      }
    ).length;

  const paginas =
    db.requests.reduce(
      function(total, item) {
        return total +
          Number(item.pages || 0);
      },
      0
    );

  const recentes =
    db.requests.slice(0, 5);

  return `
    <div class="page-head">

      <div>
        <h1>Visão geral</h1>

        <p>
          Acompanhamento das atividades
          de digitalização e inserção no SEI.
        </p>
      </div>

      <div class="actions">

        <button
          class="btn"
          data-action="export">
          ⇩ Exportar
        </button>

        <button
          class="btn primary"
          data-action="new-request">
          ＋ Nova solicitação
        </button>

      </div>
    </div>

    <div class="hero-flow">

      <h2>Fluxo do processo</h2>

      <p>
        Controle desde o recebimento
        do documento físico até a conclusão
        da inserção no SEI.
      </p>

      <div class="flow-mini">

        ${[
          "Solicitação",
          "Recebimento",
          "Digitalização",
          "Conferência",
          "Liberação",
          "Inserção no SEI",
          "Conclusão"
        ].map(function(nome, indice) {

          return `
            <span class="flow-pill">
              ${indice + 1}. ${nome}
            </span>

            ${
              indice < 6
                ? '<span class="flow-arrow">›</span>'
                : ""
            }
          `;

        }).join("")}

      </div>
    </div>

    <div class="stats">

      <div class="stat">
        <div class="stat-top">
          <span class="stat-label">
            Solicitações no período
          </span>

          <span class="stat-icon icon-blue">
            #
          </span>
        </div>

        <div class="stat-value">
          ${total}
        </div>

        <div class="stat-note">
          Registros controlados pelo SID-SEI
        </div>
      </div>

      <div class="stat">
        <div class="stat-top">
          <span class="stat-label">
            Em andamento
          </span>

          <span class="stat-icon icon-orange">
            !
          </span>
        </div>

        <div class="stat-value">
          ${andamento}
        </div>

        <div class="stat-note">
          Necessitam de alguma ação
        </div>
      </div>

      <div class="stat">
        <div class="stat-top">
          <span class="stat-label">
            Concluídas
          </span>

          <span class="stat-icon icon-green">
            ✓
          </span>
        </div>

        <div class="stat-value">
          ${concluidas}
        </div>

        <div class="stat-note">
          Inserção no SEI registrada
        </div>
      </div>

      <div class="stat">
        <div class="stat-top">
          <span class="stat-label">
            Páginas digitalizadas
          </span>

          <span class="stat-icon icon-purple">
            ▤
          </span>
        </div>

        <div class="stat-value">
          ${paginas.toLocaleString("pt-BR")}
        </div>

        <div class="stat-note">
          Total registrado nos documentos
        </div>
      </div>

    </div>

    <div class="grid-2">

      <div class="card">

        <div class="card-head">

          <h2>
            Solicitações recentes
          </h2>

          <button
            class="link"
            data-view-link="solicitacoes">
            Ver todas
          </button>

        </div>

        <div class="table-wrap">

          <table>

            <thead>
              <tr>
                <th>Solicitação</th>
                <th>Unidade</th>
                <th>Situação</th>
                <th>Data</th>
              </tr>
            </thead>

            <tbody>

              ${
                recentes.map(
                  function(item) {

                    return `
                      <tr>

                        <td>

                          <button
                            class="link"
                            data-detail="${escapeHTML(item.id)}">
                            ${escapeHTML(item.id)}
                          </button>

                          <br>

                          <span class="muted">
                            ${escapeHTML(
                              item.description
                                .slice(0, 45)
                            )}
                          </span>

                        </td>

                        <td>
                          ${escapeHTML(item.unit)}
                        </td>

                        <td>
                          ${badgeStatus(item.status)}
                        </td>

                        <td>
                          ${formatarData(item.date)}
                        </td>

                      </tr>
                    `;

                  }
                ).join("")
              }

            </tbody>

          </table>

        </div>
      </div>

      <div class="card">

        <div class="card-head">

          <h2>
            Distribuição por etapa
          </h2>

          <span class="muted">
            Atual
          </span>

        </div>

        <div class="card-body">

          ${criarIndicadoresEtapas(total)}

        </div>

      </div>

    </div>
  `;
}

function criarIndicadoresEtapas(total) {

  const etapas = [
    ["Solicitação", ["Solicitação"]],
    ["Recebimento", ["Recebido"]],
    [
      "Digitalização",
      [
        "Aguardando digitalização",
        "Em digitalização",
        "Reprovado"
      ]
    ],
    [
      "Conferência",
      ["Aguardando conferência"]
    ],
    [
      "Inserção SEI",
      [
        "Aguardando inserção no SEI",
        "Pendência SEI"
      ]
    ],
    ["Conclusão", ["Concluído"]]
  ];

  return etapas.map(
    function(etapa) {

      const quantidade =
        db.requests.filter(
          function(item) {
            return etapa[1].includes(
              item.status
            );
          }
        ).length;

      const percentual =
        total > 0
          ? Math.max(
              (quantidade / total) * 100,
              quantidade > 0 ? 4 : 0
            )
          : 0;

      return `
        <div style="margin-bottom:13px">

          <div style="
            display:flex;
            justify-content:space-between;
            font-size:10px;
            margin-bottom:5px
          ">

            <span>
              ${etapa[0]}
            </span>

            <strong>
              ${quantidade}
            </strong>

          </div>

          <div class="progress">

            <span style="
              width:${percentual}%
            "></span>

          </div>

        </div>
      `;

    }
  ).join("");
}

function solicitacoes() {

  return `
    <div class="page-head">

      <div>

        <h1>
          Solicitações de digitalização
        </h1>

        <p>
          Cadastre, acompanhe e consulte
          as solicitações recebidas das unidades.
        </p>

      </div>

      <button
        class="btn primary"
        data-action="new-request">
        ＋ Nova solicitação
      </button>

    </div>

    <div class="card">

      <div class="card-body">

        <div class="filters">

          <div class="search">

            <input
              id="requestSearch"
              placeholder="Pesquisar por número, unidade, solicitante ou descrição...">

          </div>

          <select
            class="filter-select"
            id="statusFilter">

            <option value="">
              Todas as situações
            </option>

            ${Object.keys(statusMap).map(
              function(status) {
                return `
                  <option value="${escapeHTML(status)}">
                    ${escapeHTML(status)}
                  </option>
                `;
              }
            ).join("")}

          </select>

          <select
            class="filter-select"
            id="priorityFilter">

            <option value="">
              Todas prioridades
            </option>

            <option value="Alta">
              Alta
            </option>

            <option value="Normal">
              Normal
            </option>

            <option value="Baixa">
              Baixa
            </option>

          </select>

        </div>

        <div class="table-wrap">

          <table>

            <thead>

              <tr>
                <th>Número</th>
                <th>Unidade / solicitante</th>
                <th>Documentos</th>
                <th>Situação</th>
                <th>Prioridade</th>
                <th>Data</th>
                <th></th>
              </tr>

            </thead>

            <tbody id="requestsBody">

              ${linhasSolicitacoes(db.requests)}

            </tbody>

          </table>

        </div>

      </div>
    </div>
  `;
}

function linhasSolicitacoes(lista) {

  if (!lista.length) {

    return `
      <tr>

        <td colspan="7">

          <div class="empty">

            <strong>
              Nenhuma solicitação encontrada
            </strong>

            Ajuste os filtros ou cadastre
            uma nova solicitação.

          </div>

        </td>

      </tr>
    `;
  }

  return lista.map(
    function(item) {

      let prioridade;

      if (item.priority === "Alta") {
        prioridade =
          '<span class="badge red">Alta</span>';
      } else if (
        item.priority === "Baixa"
      ) {
        prioridade =
          '<span class="badge gray">Baixa</span>';
      } else {
        prioridade =
          '<span class="badge blue">Normal</span>';
      }

      return `
        <tr>

          <td>

            <button
              class="link"
              data-detail="${escapeHTML(item.id)}">
              ${escapeHTML(item.id)}
            </button>

            <br>

            <span class="muted">
              ${escapeHTML(
                item.description.slice(0, 34)
              )}
            </span>

          </td>

          <td>

            ${escapeHTML(item.unit)}

            <br>

            <span class="muted">
              ${escapeHTML(item.requester)}
            </span>

          </td>

          <td>
            ${item.documents}
          </td>

          <td>
            ${badgeStatus(item.status)}
          </td>

          <td>
            ${prioridade}
          </td>

          <td>
            ${formatarData(item.date)}
          </td>

          <td>

            <button
              class="btn sm"
              data-detail="${escapeHTML(item.id)}">
              Abrir
            </button>

          </td>

        </tr>
      `;
    }
  ).join("");
}

function etapa(
  titulo,
  statusPermitidos,
  textoBotao
) {

  const lista =
    db.requests.filter(
      function(item) {
        return statusPermitidos.includes(
          item.status
        );
      }
    );

  return `
    <div class="page-head">

      <div>

        <h1>
          ${titulo}
        </h1>

        <p>
          Registros que demandam atuação
          nesta etapa do fluxo.
        </p>

      </div>

    </div>

    <div
      class="notice"
      style="margin-bottom:15px">

      ${
        titulo === "Recebimento"
          ? "Registre o recebimento do documento físico para iniciar o controle operacional."
          : "A situação do documento deve ser atualizada conforme a operação realizada e suas ocorrências."
      }

    </div>

    <div class="card">

      <div class="table-wrap">

        <table>

          <thead>

            <tr>
              <th>Solicitação</th>
              <th>Unidade</th>
              <th>Situação</th>
              <th>Responsável</th>
              <th>Data</th>
              <th>Ação</th>
            </tr>

          </thead>

          <tbody>

            ${
              lista.length
                ? lista.map(
                    function(item) {

                      return `
                        <tr>

                          <td>

                            <button
                              class="link"
                              data-detail="${escapeHTML(item.id)}">
                              ${escapeHTML(item.id)}
                            </button>

                            <br>

                            <span class="muted">
                              ${escapeHTML(
                                item.description
                                  .slice(0, 40)
                              )}
                            </span>

                          </td>

                          <td>
                            ${escapeHTML(item.unit)}
                          </td>

                          <td>
                            ${badgeStatus(item.status)}
                          </td>

                          <td>
                            ${escapeHTML(
                              item.responsible || "-"
                            )}
                          </td>

                          <td>
                            ${formatarData(item.date)}
                          </td>

                          <td>

                            <button
                              class="btn sm primary"
                              data-stage="${escapeHTML(item.id)}">
                              ${textoBotao}
                            </button>

                          </td>

                        </tr>
                      `;
                    }
                  ).join("")
                : `
                  <tr>

                    <td colspan="6">

                      <div class="empty">

                        <strong>
                          Nenhum item nesta etapa
                        </strong>

                        Não há registros
                        aguardando ação.

                      </div>

                    </td>

                  </tr>
                `
            }

          </tbody>

        </table>

      </div>
    </div>
  `;
}

function conferencia() {

  const lista =
    db.requests.filter(
      function(item) {
        return [
          "Aguardando conferência",
          "Reprovado"
        ].includes(item.status);
      }
    );

  return `
    <div class="page-head">

      <div>

        <h1>
          Conferência
        </h1>

        <p>
          Verifique correspondência e completude
          antes da liberação para o SEI.
        </p>

      </div>

    </div>

    <div class="card">

      <div class="table-wrap">

        <table>

          <thead>

            <tr>
              <th>Solicitação</th>
              <th>Arquivo</th>
              <th>Páginas</th>
              <th>Situação</th>
              <th>Conferente</th>
              <th>Ação</th>
            </tr>

          </thead>

          <tbody>

            ${
              lista.length
                ? lista.map(
                    function(item) {

                      return `
                        <tr>

                          <td>

                            <button
                              class="link"
                              data-detail="${escapeHTML(item.id)}">
                              ${escapeHTML(item.id)}
                            </button>

                            <br>

                            <span class="muted">
                              ${escapeHTML(
                                item.description.slice(0, 35)
                              )}
                            </span>

                          </td>

                          <td>
                            ${escapeHTML(
                              item.file ||
                              "Não associado"
                            )}
                          </td>

                          <td>
                            ${item.pages || 0}
                          </td>

                          <td>
                            ${badgeStatus(item.status)}
                          </td>

                          <td>
                            ${escapeHTML(
                              item.responsible || "-"
                            )}
                          </td>

                          <td>

                            <button
                              class="btn sm primary"
                              data-conference="${escapeHTML(item.id)}">
                              Conferir
                            </button>

                          </td>

                        </tr>
                      `;
                    }
                  ).join("")
                : `
                  <tr>

                    <td colspan="6">

                      <div class="empty">

                        <strong>
                          Fila de conferência vazia
                        </strong>

                      </div>

                    </td>

                  </tr>
                `
            }

          </tbody>

        </table>

      </div>
    </div>
  `;
}

function insercaoSEI() {

  const lista =
    db.requests.filter(
      function(item) {
        return [
          "Aguardando inserção no SEI",
          "Pendência SEI"
        ].includes(item.status);
      }
    );

  return `
    <div class="page-head">

      <div>

        <h1>
          Inserção no SEI
        </h1>

        <p>
          Registre as informações referentes
          à inserção do documento no SEI.
        </p>

      </div>

    </div>

    <div class="card">

      <div class="table-wrap">

        <table>

          <thead>

            <tr>
              <th>Solicitação</th>
              <th>Unidade</th>
              <th>Situação</th>
              <th>Processo SEI</th>
              <th>Responsável</th>
              <th>Ação</th>
            </tr>

          </thead>

          <tbody>

            ${
              lista.length
                ? lista.map(
                    function(item) {

                      return `
                        <tr>

                          <td>

                            <button
                              class="link"
                              data-detail="${escapeHTML(item.id)}">
                              ${escapeHTML(item.id)}
                            </button>

                            <br>

                            <span class="muted">
                              ${escapeHTML(
                                item.description.slice(0, 38)
                              )}
                            </span>

                          </td>

                          <td>
                            ${escapeHTML(item.unit)}
                          </td>

                          <td>
                            ${badgeStatus(item.status)}
                          </td>

                          <td>
                            ${escapeHTML(
                              item.sei || "—"
                            )}
                          </td>

                          <td>
                            ${escapeHTML(
                              item.responsible || "-"
                            )}
                          </td>

                          <td>

                            <button
                              class="btn sm primary"
                              data-sei="${escapeHTML(item.id)}">
                              Registrar inserção
                            </button>

                          </td>

                        </tr>
                      `;
                    }
                  ).join("")
                : `
                  <tr>

                    <td colspan="6">

                      <div class="empty">

                        <strong>
                          Nenhum documento liberado para inserção
                        </strong>

                      </div>

                    </td>

                  </tr>
                `
            }

          </tbody>

        </table>

      </div>
    </div>
  `;
}

function historico() {

  return `
    <div class="page-head">

      <div>

        <h1>
          Histórico e rastreabilidade
        </h1>

        <p>
          Registro das operações realizadas
          e dos responsáveis.
        </p>

      </div>

    </div>

    <div class="card">

      <div class="card-body">

        <div class="filters">

          <div class="search">

            <input
              id="historySearch"
              placeholder="Pesquisar por solicitação, ação ou usuário...">

          </div>

        </div>

        <div
          class="timeline"
          id="historyList">

          ${linhasHistorico(db.history)}

        </div>

      </div>
    </div>
  `;
}

function linhasHistorico(lista) {

  if (!lista.length) {

    return `
      <div class="empty">

        <strong>
          Nenhum registro encontrado
        </strong>

      </div>
    `;
  }

  return lista.map(
    function(item) {

      return `
        <div class="timeline-item">

          <div class="timeline-rail">

            <div class="timeline-dot">
              ✓
            </div>

          </div>

          <div class="timeline-content">

            <strong>

              ${escapeHTML(item.action)}

              <span class="muted">
                · ${escapeHTML(item.request)}
              </span>

            </strong>

            <p>
              ${escapeHTML(item.detail)}
            </p>

            <small>
              ${escapeHTML(item.date)}
              · Responsável:
              ${escapeHTML(item.user)}
            </small>

          </div>

        </div>
      `;
    }
  ).join("");
}

function relatorios() {

  const total =
    db.requests.length;

  const concluidas =
    db.requests.filter(
      function(item) {
        return item.status ===
          "Concluído";
      }
    ).length;

  const reprovadas =
    db.requests.filter(
      function(item) {
        return item.status ===
          "Reprovado";
      }
    ).length;

  const aguardandoSEI =
    db.requests.filter(
      function(item) {
        return [
          "Aguardando inserção no SEI",
          "Pendência SEI"
        ].includes(item.status);
      }
    ).length;

  const paginas =
    db.requests.reduce(
      function(total, item) {
        return total +
          Number(item.pages || 0);
      },
      0
    );

  const taxa =
    total
      ? Math.round(
          concluidas /
          total *
          100
        )
      : 0;

  return `
    <div class="page-head">

      <div>

        <h1>
          Relatórios e indicadores
        </h1>

        <p>
          Informações consolidadas sobre
          as atividades de digitalização.
        </p>

      </div>

      <button
        class="btn"
        data-action="export">
        ⇩ Exportar CSV
      </button>

    </div>

    <div
      class="kpi-grid"
      style="margin-bottom:18px">

      <div class="kpi">
        <span>
          Total de solicitações
        </span>
        <strong>
          ${total}
        </strong>
      </div>

      <div class="kpi">
        <span>
          Taxa de conclusão
        </span>
        <strong>
          ${taxa}%
        </strong>
      </div>

      <div class="kpi">
        <span>
          Páginas digitalizadas
        </span>
        <strong>
          ${paginas.toLocaleString("pt-BR")}
        </strong>
      </div>

      <div class="kpi">
        <span>
          Reprovações
        </span>
        <strong>
          ${reprovadas}
        </strong>
      </div>

      <div class="kpi">
        <span>
          Aguardando SEI
        </span>
        <strong>
          ${aguardandoSEI}
        </strong>
      </div>

      <div class="kpi">
        <span>
          Usuários ativos
        </span>
        <strong>
          ${
            db.users.filter(
              function(user) {
                return user.active;
              }
            ).length
          }
        </strong>
      </div>

    </div>

    <div class="grid-2 equal">

      <div class="card">

        <div class="card-head">
          <h2>
            Situação das solicitações
          </h2>
        </div>

        <div class="card-body">

          ${Object.keys(statusMap).map(
            function(status) {

              const quantidade =
                db.requests.filter(
                  function(item) {
                    return item.status ===
                      status;
                  }
                ).length;

              return `
                <div style="
                  display:flex;
                  justify-content:space-between;
                  padding:9px 0;
                  border-bottom:1px solid #eef1f3;
                  font-size:10px
                ">

                  <span>
                    ${badgeStatus(status)}
                  </span>

                  <strong>
                    ${quantidade}
                  </strong>

                </div>
              `;
            }
          ).join("")}

        </div>
      </div>

      <div class="card">

        <div class="card-head">

          <h2>
            Responsáveis
          </h2>

        </div>

        <div class="card-body">

          ${db.users.map(
            function(user) {

              const quantidade =
                db.requests.filter(
                  function(item) {
                    return item.responsible ===
                      user.name;
                  }
                ).length;

              return `
                <div style="
                  display:flex;
                  align-items:center;
                  gap:10px;
                  padding:9px 0;
                  border-bottom:1px solid #eef1f3
                ">

                  <span class="avatar small">
                    ${iniciais(user.name)}
                  </span>

                  <div style="flex:1">

                    <strong style="
                      font-size:10px;
                      display:block
                    ">
                      ${escapeHTML(user.name)}
                    </strong>

                    <span class="muted">
                      ${escapeHTML(user.profile)}
                    </span>

                  </div>

                  <strong>
                    ${quantidade}
                  </strong>

                </div>
              `;
            }
          ).join("")}

        </div>
      </div>

    </div>
  `;
}

function iniciais(nome) {

  return nome
    .split(" ")
    .slice(0, 2)
    .map(function(parte) {
      return parte[0];
    })
    .join("")
    .toUpperCase();
}

function usuarios() {

  return `
    <div class="page-head">

      <div>

        <h1>
          Usuários e perfis
        </h1>

        <p>
          Administração de usuários e controle
          de acesso às funcionalidades.
        </p>

      </div>

      <button
        class="btn primary"
        data-action="new-user">
        ＋ Novo usuário
      </button>

    </div>

    <div class="card">

      <div class="table-wrap">

        <table>

          <thead>

            <tr>
              <th>Usuário</th>
              <th>Perfil</th>
              <th>Unidade</th>
              <th>Situação</th>
              <th>Ações</th>
            </tr>

          </thead>

          <tbody>

            ${db.users.map(
              function(user) {

                return `
                  <tr>

                    <td>

                      <div style="
                        display:flex;
                        align-items:center;
                        gap:8px
                      ">

                        <span class="avatar small">
                          ${iniciais(user.name)}
                        </span>

                        <strong>
                          ${escapeHTML(user.name)}
                        </strong>

                      </div>

                    </td>

                    <td>
                      ${escapeHTML(user.profile)}
                    </td>

                    <td>
                      ${escapeHTML(user.unit)}
                    </td>

                    <td>

                      ${
                        user.active
                          ? '<span class="badge green">Ativo</span>'
                          : '<span class="badge gray">Inativo</span>'
                      }

                    </td>

                    <td>

                      <button
                        class="btn sm"
                        data-toggle-user="${user.id}">

                        ${
                          user.active
                            ? "Desativar"
                            : "Ativar"
                        }

                      </button>

                    </td>

                  </tr>
                `;
              }
            ).join("")}

          </tbody>

        </table>

      </div>
    </div>

    <div
      class="notice"
      style="margin-top:15px">

      Os perfis seguem os atores definidos
      no Documento de Visão:
      Solicitante, Operador de digitalização,
      Conferente, Responsável pela inserção
      no SEI, Gestor e Administrador.

    </div>
  `;
}

function configuracoes() {

  return `
    <div class="page-head">

      <div>

        <h1>
          Configurações
        </h1>

        <p>
          Parâmetros básicos do protótipo SID-SEI.
        </p>

      </div>

    </div>

    <div class="grid-2 equal">

      <div class="card">

        <div class="card-head">

          <h2>
            Configurações do sistema
          </h2>

        </div>

        <div class="card-body">

          <div class="form-grid">

            <div class="field">

              <label>
                Nome do sistema
              </label>

              <input
                value="SID-SEI"
                disabled>

            </div>

            <div class="field">

              <label>
                Ambiente
              </label>

              <select>

                <option>
                  Protótipo
                </option>

                <option>
                  Homologação
                </option>

                <option>
                  Produção
                </option>

              </select>

            </div>

            <div class="field">

              <label>
                Formato preferencial
              </label>

              <select>

                <option>
                  PDF/A
                </option>

                <option>
                  PDF
                </option>

              </select>

            </div>

            <div class="field">

              <label>
                Fuso horário
              </label>

              <select>

                <option>
                  America/Sao_Paulo
                </option>

              </select>

            </div>

          </div>

        </div>

      </div>

      <div class="card">

        <div class="card-head">

          <h2>
            Dados locais
          </h2>

        </div>

        <div class="card-body">

          <p style="
            font-size:11px;
            line-height:1.6;
            color:var(--muted)
          ">

            Esta primeira versão utiliza
            o armazenamento local do navegador
            para demonstração.

            Em uma implantação real,
            os registros, arquivos e trilhas
            de auditoria devem ser transferidos
            para um backend e banco de dados
            apropriados.

          </p>

          <div class="actions">

            <button
              class="btn danger"
              data-action="reset">

              Restaurar dados de demonstração

            </button>

          </div>

        </div>

      </div>

    </div>
  `;
}

function abrirModal(
  titulo,
  conteudo
) {

  const modal =
    document.getElementById("modal");

  const fundo =
    document.getElementById(
      "modalBackdrop"
    );

  if (!modal || !fundo) return;

  modal.innerHTML = `
    <div class="modal-head">

      <h2>
        ${titulo}
      </h2>

      <button
        class="close"
        data-action="close-modal">
        ×
      </button>

    </div>

    <div class="modal-body">

      ${conteudo}

    </div>
  `;

  fundo.classList.remove("hidden");

  configurarEventosModal();
}

function fecharModal() {

  const fundo =
    document.getElementById(
      "modalBackdrop"
    );

  if (fundo) {
    fundo.classList.add("hidden");
  }
}

function novaSolicitacaoModal() {

  abrirModal(
    "Nova solicitação de digitalização",

    `
      <form id="requestForm">

        <div class="form-grid">

          <div class="field">

            <label>
              Unidade solicitante
              <span class="required">*</span>
            </label>

            <input
              name="unit"
              required
              placeholder="Ex.: Coordenação Administrativa">

          </div>

          <div class="field">

            <label>
              Solicitante
              <span class="required">*</span>
            </label>

            <input
              name="requester"
              required
              placeholder="Nome do solicitante">

          </div>

          <div class="field">

            <label>
              Data da solicitação
            </label>

            <input
              type="date"
              name="date"
              value="${dataAtual()}">

          </div>

          <div class="field">

            <label>
              Quantidade de documentos
              <span class="required">*</span>
            </label>

            <input
              type="number"
              name="documents"
              min="1"
              value="1"
              required>

          </div>

          <div class="field">

            <label>
              Prioridade
            </label>

            <select name="priority">

              <option>
                Normal
              </option>

              <option>
                Alta
              </option>

              <option>
                Baixa
              </option>

            </select>

          </div>

          <div class="field full">

            <label>
              Identificação / descrição dos documentos
              <span class="required">*</span>
            </label>

            <textarea
              name="description"
              required
              placeholder="Descreva os documentos encaminhados para digitalização."></textarea>

          </div>

        </div>

        <div class="form-footer">

          <button
            type="button"
            class="btn"
            data-action="close-modal">

            Cancelar

          </button>

          <button class="btn primary">

            Cadastrar solicitação

          </button>

        </div>

      </form>
    `
  );
}

function detalheSolicitacao(id) {

  const item =
    buscarSolicitacao(id);

  if (!item) return;

  const historico =
    db.history
      .filter(function(registro) {
        return registro.request === id;
      })
      .slice(0, 8);

  abrirModal(
    `Solicitação ${item.id}`,

    `
      <div class="detail-grid">

        <div>

          <div class="info-list">

            <div class="info">
              <label>Situação</label>
              <strong>
                ${badgeStatus(item.status)}
              </strong>
            </div>

            <div class="info">
              <label>Prioridade</label>
              <strong>
                ${escapeHTML(item.priority)}
              </strong>
            </div>

            <div class="info">
              <label>Unidade</label>
              <strong>
                ${escapeHTML(item.unit)}
              </strong>
            </div>

            <div class="info">
              <label>Solicitante</label>
              <strong>
                ${escapeHTML(item.requester)}
              </strong>
            </div>

            <div class="info">
              <label>Data</label>
              <strong>
                ${formatarData(item.date)}
              </strong>
            </div>

            <div class="info">
              <label>Documentos</label>
              <strong>
                ${item.documents}
              </strong>
            </div>

            <div class="info">
              <label>Arquivo digital</label>
              <strong>
                ${escapeHTML(
                  item.file ||
                  "Não associado"
                )}
              </strong>
            </div>

            <div class="info">
              <label>Formato / páginas</label>
              <strong>
                ${escapeHTML(
                  item.format || "—"
                )}
                /
                ${item.pages || 0}
              </strong>
            </div>

            <div class="info">
              <label>Processo SEI</label>
              <strong>
                ${escapeHTML(
                  item.sei ||
                  "Não informado"
                )}
              </strong>
            </div>

            <div class="info">
              <label>Responsável atual</label>
              <strong>
                ${escapeHTML(
                  item.responsible ||
                  "Não definido"
                )}
              </strong>
            </div>

            <div
              class="info"
              style="grid-column:1/-1">

              <label>
                Descrição
              </label>

              <strong>
                ${escapeHTML(
                  item.description
                )}
              </strong>

            </div>

          </div>

        </div>

        <div class="card"
             style="box-shadow:none">

          <div class="card-head">

            <h2>
              Histórico
            </h2>

          </div>

          <div class="card-body">

            <div class="timeline">

              ${
                historico.length
                  ? linhasHistorico(historico)
                  : '<div class="empty">Sem histórico.</div>'
              }

            </div>

          </div>

        </div>

      </div>
    `
  );
}

function abrirEtapa(id) {

  const item =
    buscarSolicitacao(id);

  if (!item) return;

  if (item.status === "Recebido") {

    abrirModal(
      `Registrar recebimento — ${item.id}`,

      `
        <form id="receiveForm">

          <div class="form-grid">

            <div class="field">

              <label>
                Data do recebimento
              </label>

              <input
                type="date"
                name="date"
                value="${dataAtual()}">

            </div>

            <div class="field">

              <label>
                Responsável
              </label>

              <select name="responsible">

                ${db.users
                  .filter(function(user) {
                    return (
                      user.profile ===
                        "Operador de digitalização" ||
                      user.profile === "Gestor"
                    );
                  })
                  .map(function(user) {
                    return `
                      <option>
                        ${escapeHTML(
                          user.name
                        )}
                      </option>
                    `;
                  })
                  .join("")}

              </select>

            </div>

            <div class="field full">

              <label>
                Observações
              </label>

              <textarea
                name="notes"
                placeholder="Condições do material, conferência inicial, ocorrências..."></textarea>

            </div>

          </div>

          <div class="form-footer">

            <button
              type="button"
              class="btn"
              data-action="close-modal">

              Cancelar

            </button>

            <button class="btn primary">

              Registrar recebimento

            </button>

          </div>

        </form>
      `
    );

    return;
  }

  abrirModal(
    `Registrar digitalização — ${item.id}`,

    `
      <form id="digitizeForm">

        <div class="form-grid">

          <div class="field">

            <label>
              Responsável
            </label>

            <select name="responsible">

              ${db.users
                .filter(function(user) {
                  return (
                    user.profile ===
                      "Operador de digitalização" ||
                    user.profile === "Gestor"
                  );
                })
                .map(function(user) {
                  return `
                    <option>
                      ${escapeHTML(
                        user.name
                      )}
                    </option>
                  `;
                })
                .join("")}

            </select>

          </div>

          <div class="field">

            <label>
              Quantidade de páginas
              <span class="required">*</span>
            </label>

            <input
              type="number"
              min="1"
              name="pages"
              value="${item.pages || 1}"
              required>

          </div>

          <div class="field">

            <label>
              Formato
            </label>

            <select name="format">

              <option>PDF/A</option>
              <option>PDF</option>
              <option>TIFF</option>
              <option>JPEG</option>

            </select>

          </div>

          <div class="field">

            <label>
              Arquivo produzido
            </label>

            <input
              name="file"
              value="${escapeHTML(item.file)}"
              placeholder="nome-do-arquivo.pdf">

          </div>

          <div class="field full">

            <label>
              Ocorrência / observações
            </label>

            <textarea
              name="notes"
              placeholder="Registre problemas, danos, ausência de páginas etc."></textarea>

          </div>

        </div>

        <div class="form-footer">

          <button
            type="button"
            class="btn"
            data-action="close-modal">

            Cancelar

          </button>

          <button class="btn primary">

            Concluir digitalização

          </button>

        </div>

      </form>
    `
  );
}

function abrirConferencia(id) {

  const item =
    buscarSolicitacao(id);

  if (!item) return;

  abrirModal(
    `Conferência — ${item.id}`,

    `
      <div class="file-box">

        <strong>
          ${escapeHTML(
            item.file ||
            "Arquivo não associado"
          )}
        </strong>

        <div
          class="muted"
          style="margin-top:5px">

          ${item.pages || 0}
          páginas ·
          ${escapeHTML(
            item.format ||
            "Formato não informado"
          )}

        </div>

        <div
          class="muted"
          style="margin-top:10px">

          Protótipo:
          aqui será disponibilizada
          a visualização do representante digital.

        </div>

      </div>

      <div
        class="notice"
        style="margin-top:15px">

        A conferência deve verificar
        correspondência e completude.

        Em caso de reprovação,
        registre o motivo e encaminhe
        para correção ou nova digitalização.

      </div>

      <form id="conferenceForm">

        <div
          class="form-grid"
          style="margin-top:15px">

          <div class="field">

            <label>
              Conferente
            </label>

            <select name="responsible">

              ${db.users
                .filter(function(user) {
                  return (
                    user.profile ===
                      "Conferente" ||
                    user.profile === "Gestor"
                  );
                })
                .map(function(user) {
                  return `
                    <option>
                      ${escapeHTML(
                        user.name
                      )}
                    </option>
                  `;
                })
                .join("")}

            </select>

          </div>

          <div class="field">

            <label>
              Resultado
            </label>

            <select name="result">

              <option value="approved">
                Aprovado — liberar para SEI
              </option>

              <option value="rejected">
                Reprovado — nova digitalização
              </option>

            </select>

          </div>

          <div class="field full">

            <label>
              Observação / motivo
            </label>

            <textarea
              name="notes"
              placeholder="Registre a justificativa ou observações da conferência."></textarea>

          </div>

        </div>

        <div class="form-footer">

          <button
            type="button"
            class="btn"
            data-action="close-modal">

            Cancelar

          </button>

          <button class="btn primary">

            Registrar conferência

          </button>

        </div>

      </form>
    `
  );
}

function abrirSEI(id) {

  const item =
    buscarSolicitacao(id);

  if (!item) return;

  abrirModal(
    `Registrar inserção no SEI — ${item.id}`,

    `
      <form id="seiForm">

        <div class="form-grid">

          <div class="field">

            <label>
              Número do processo SEI
              <span class="required">*</span>
            </label>

            <input
              name="sei"
              value="${escapeHTML(item.sei)}"
              required
              placeholder="00000.000000/0000-00">

          </div>

          <div class="field">

            <label>
              Responsável
            </label>

            <select name="responsible">

              ${db.users
                .filter(function(user) {
                  return (
                    user.profile ===
                      "Responsável pela inserção no SEI" ||
                    user.profile === "Gestor"
                  );
                })
                .map(function(user) {
                  return `
                    <option>
                      ${escapeHTML(
                        user.name
                      )}
                    </option>
                  `;
                })
                .join("")}

            </select>

          </div>

          <div class="field">

            <label>
              Data da inserção
            </label>

            <input
              type="date"
              name="date"
              value="${dataAtual()}">

          </div>

          <div class="field">

            <label>
              Documento no SEI
            </label>

            <input
              name="seiDoc"
              placeholder="Ex.: Documento 12345">

          </div>

          <div class="field full">

            <label>
              Observações
            </label>

            <textarea
              name="notes"></textarea>

          </div>

        </div>

        <div class="form-footer">

          <button
            type="button"
            class="btn"
            data-action="close-modal">

            Cancelar

          </button>

          <button class="btn primary">

            Concluir solicitação

          </button>

        </div>

      </form>
    `
  );
}

function novoUsuarioModal() {

  abrirModal(
    "Novo usuário",

    `
      <form id="userForm">

        <div class="form-grid">

          <div class="field">

            <label>
              Nome
              <span class="required">*</span>
            </label>

            <input
              name="name"
              required>

          </div>

          <div class="field">

            <label>
              Unidade
              <span class="required">*</span>
            </label>

            <input
              name="unit"
              required
              value="Arquivo Central">

          </div>

          <div class="field full">

            <label>
              Perfil
              <span class="required">*</span>
            </label>

            <select name="profile">

              <option>
                Solicitante
              </option>

              <option>
                Operador de digitalização
              </option>

              <option>
                Conferente
              </option>

              <option>
                Responsável pela inserção no SEI
              </option>

              <option>
                Gestor
              </option>

              <option>
                Administrador do sistema
              </option>

            </select>

          </div>

        </div>

        <div class="form-footer">

          <button
            type="button"
            class="btn"
            data-action="close-modal">

            Cancelar

          </button>

          <button class="btn primary">

            Cadastrar usuário

          </button>

        </div>

      </form>
    `
  );
}

function configurarEventosModal() {

  document
    .querySelectorAll(
      "#modal [data-action='close-modal']"
    )
    .forEach(function(botao) {

      botao.onclick =
        fecharModal;

    });

  const formularioSolicitacao =
    document.getElementById(
      "requestForm"
    );

  if (formularioSolicitacao) {

    formularioSolicitacao.addEventListener(
      "submit",
      function(evento) {

        evento.preventDefault();

        const dados =
          new FormData(
            formularioSolicitacao
          );

        const id =
          gerarNumeroSolicitacao();

        const item = {
          id: id,
          unit:
            dados.get("unit"),
          requester:
            dados.get("requester"),
          date:
            dados.get("date") ||
            dataAtual(),
          description:
            dados.get("description"),
          documents:
            Number(
              dados.get("documents")
            ),
          status:
            "Solicitação",
          priority:
            dados.get("priority"),
          responsible:
            dados.get("requester"),
          sei: "",
          pages: 0,
          file: "",
          format: ""
        };

        db.requests.unshift(item);

        adicionarHistorico(
          id,
          "Solicitação criada",
          item.requester,
          `Solicitação encaminhada pela unidade ${item.unit}.`
        );

        salvarBanco();
        fecharModal();

        currentView =
          "solicitacoes";

        renderizar();

        mostrarMensagem(
          `Solicitação ${id} criada.`
        );
      }
    );
  }

  const formularioRecebimento =
    document.getElementById(
      "receiveForm"
    );

  if (formularioRecebimento) {

    formularioRecebimento.addEventListener(
      "submit",
      function(evento) {

        evento.preventDefault();

        const dados =
          new FormData(
            formularioRecebimento
          );

        const titulo =
          document.querySelector(
            "#modal h2"
          );

        const id =
          titulo.textContent
            .split("—")[1]
            .trim();

        const item =
          buscarSolicitacao(id);

        item.status =
          "Aguardando digitalização";

        item.responsible =
          dados.get("responsible");

        adicionarHistorico(
          id,
          "Recebimento registrado",
          item.responsible,
          dados.get("notes") ||
            "Documento físico recebido."
        );

        salvarBanco();
        fecharModal();
        renderizar();

        mostrarMensagem(
          "Recebimento registrado."
        );
      }
    );
  }

  const formularioDigitalizacao =
    document.getElementById(
      "digitizeForm"
    );

  if (formularioDigitalizacao) {

    formularioDigitalizacao.addEventListener(
      "submit",
      function(evento) {

        evento.preventDefault();

        const dados =
          new FormData(
            formularioDigitalizacao
          );

        const titulo =
          document.querySelector(
            "#modal h2"
          );

        const id =
          titulo.textContent
            .split("—")[1]
            .trim();

        const item =
          buscarSolicitacao(id);

        item.status =
          "Aguardando conferência";

        item.responsible =
          dados.get("responsible");

        item.pages =
          Number(
            dados.get("pages")
          );

        item.file =
          dados.get("file") ||
          `${id.toLowerCase()}.pdf`;

        item.format =
          dados.get("format");

        adicionarHistorico(
          id,
          "Digitalização realizada",
          item.responsible,
          `${item.pages} páginas associadas ao registro. ${
            dados.get("notes") || ""
          }`
        );

        salvarBanco();
        fecharModal();
        renderizar();

        mostrarMensagem(
          "Digitalização registrada e enviada para conferência."
        );
      }
    );
  }

  const formularioConferencia =
    document.getElementById(
      "conferenceForm"
    );

  if (formularioConferencia) {

    formularioConferencia.addEventListener(
      "submit",
      function(evento) {

        evento.preventDefault();

        const dados =
          new FormData(
            formularioConferencia
          );

        const titulo =
          document.querySelector(
            "#modal h2"
          );

        const id =
          titulo.textContent
            .split("—")[1]
            .trim();

        const item =
          buscarSolicitacao(id);

        item.responsible =
          dados.get("responsible");

        if (
          dados.get("result") ===
          "approved"
        ) {

          item.status =
            "Aguardando inserção no SEI";

          adicionarHistorico(
            id,
            "Conferência aprovada",
            item.responsible,
            `Documento liberado para inserção no SEI. ${
              dados.get("notes") || ""
            }`
          );

        } else {

          item.status =
            "Reprovado";

          adicionarHistorico(
            id,
            "Conferência reprovada",
            item.responsible,
            `Correção/nova digitalização necessária. ${
              dados.get("notes") || ""
            }`
          );
        }

        salvarBanco();
        fecharModal();
        renderizar();

        mostrarMensagem(
          "Conferência registrada."
        );
      }
    );
  }

  const formularioSEI =
    document.getElementById(
      "seiForm"
    );

  if (formularioSEI) {

    formularioSEI.addEventListener(
      "submit",
      function(evento) {

        evento.preventDefault();

        const dados =
          new FormData(
            formularioSEI
          );

        const titulo =
          document.querySelector(
            "#modal h2"
          );

        const id =
          titulo.textContent
            .split("—")[1]
            .trim();

        const item =
          buscarSolicitacao(id);

        item.status =
          "Concluído";

        item.sei =
          dados.get("sei");

        item.responsible =
          dados.get("responsible");

        adicionarHistorico(
          id,
          "Inserção no SEI registrada",
          item.responsible,
          `Processo SEI: ${item.sei}. Documento: ${
            dados.get("seiDoc") ||
            "não informado"
          }. ${dados.get("notes") || ""}`
        );

        adicionarHistorico(
          id,
          "Solicitação concluída",
          item.responsible,
          "Fluxo concluído e registro disponível para consulta."
        );

        salvarBanco();
        fecharModal();
        renderizar();

        mostrarMensagem(
          "Inserção no SEI registrada. Solicitação concluída."
        );
      }
    );
  }

  const formularioUsuario =
    document.getElementById(
      "userForm"
    );

  if (formularioUsuario) {

    formularioUsuario.addEventListener(
      "submit",
      function(evento) {

        evento.preventDefault();

        const dados =
          new FormData(
            formularioUsuario
          );

        const maiorId =
          Math.max(
            0,
            ...db.users.map(
              function(user) {
                return user.id;
              }
            )
          );

        db.users.push({
          id: maiorId + 1,
          name:
            dados.get("name"),
          profile:
            dados.get("profile"),
          unit:
            dados.get("unit"),
          active: true
        });

        salvarBanco();
        fecharModal();
        renderizar();

        mostrarMensagem(
          "Usuário cadastrado."
        );
      }
    );
  }
}

function configurarEventos() {

  document
    .querySelectorAll("[data-view]")
    .forEach(function(botao) {

      botao.onclick =
        function() {

          currentView =
            botao.dataset.view;

          renderizar();

          const sidebar =
            document.getElementById(
              "sidebar"
            );

          if (sidebar) {
            sidebar.classList.remove(
              "open"
            );
          }
        };

    });

  document
    .querySelectorAll("[data-view-link]")
    .forEach(function(botao) {

      botao.onclick =
        function() {

          currentView =
            botao.dataset.viewLink;

          renderizar();

        };

    });

  document
    .querySelectorAll("[data-detail]")
    .forEach(function(botao) {

      botao.onclick =
        function() {

          detalheSolicitacao(
            botao.dataset.detail
          );

        };

    });

  document
    .querySelectorAll(
      "[data-action='new-request']"
    )
    .forEach(function(botao) {

      botao.onclick =
        novaSolicitacaoModal;

    });

  document
    .querySelectorAll(
      "[data-action='new-user']"
    )
    .forEach(function(botao) {

      botao.onclick =
        novoUsuarioModal;

    });

  document
    .querySelectorAll("[data-stage]")
    .forEach(function(botao) {

      botao.onclick =
        function() {

          abrirEtapa(
            botao.dataset.stage
          );

        };

    });

  document
    .querySelectorAll("[data-conference]")
    .forEach(function(botao) {

      botao.onclick =
        function() {

          abrirConferencia(
            botao.dataset.conference
          );

        };

    });

  document
    .querySelectorAll("[data-sei]")
    .forEach(function(botao) {

      botao.onclick =
        function() {

          abrirSEI(
            botao.dataset.sei
          );

        };

    });

  document
    .querySelectorAll("[data-toggle-user]")
    .forEach(function(botao) {

      botao.onclick =
        function() {

          const usuario =
            db.users.find(
              function(user) {
                return user.id ==
                  botao.dataset.toggleUser;
              }
            );

          if (!usuario) return;

          usuario.active =
            !usuario.active;

          salvarBanco();
          renderizar();

          mostrarMensagem(
            "Situação do usuário atualizada."
          );
        };

    });

  document
    .querySelectorAll(
      "[data-action='export']"
    )
    .forEach(function(botao) {

      botao.onclick =
        exportarCSV;

    });

  document
    .querySelectorAll(
      "[data-action='reset']"
    )
    .forEach(function(botao) {

      botao.onclick =
        function() {

          const confirmar =
            confirm(
              "Restaurar os dados de demonstração? As alterações locais serão perdidas."
            );

          if (!confirmar) return;

          db =
            JSON.parse(
              JSON.stringify(seed)
            );

          salvarBanco();
          renderizar();

          mostrarMensagem(
            "Dados de demonstração restaurados."
          );
        };

    });

  configurarFiltros();
}

function configurarFiltros() {

  const busca =
    document.getElementById(
      "requestSearch"
    );

  const filtroStatus =
    document.getElementById(
      "statusFilter"
    );

  const filtroPrioridade =
    document.getElementById(
      "priorityFilter"
    );

  function filtrar() {

    if (!busca) return;

    const texto =
      busca.value
        .toLowerCase()
        .trim();

    const status =
      filtroStatus
        ? filtroStatus.value
        : "";

    const prioridade =
      filtroPrioridade
        ? filtroPrioridade.value
        : "";

    const resultado =
      db.requests.filter(
        function(item) {

          const textoItem =
            [
              item.id,
              item.unit,
              item.requester,
              item.description
            ]
              .join(" ")
              .toLowerCase();

          const passouTexto =
            !texto ||
            textoItem.includes(texto);

          const passouStatus =
            !status ||
            item.status === status;

          const passouPrioridade =
            !prioridade ||
            item.priority === prioridade;

          return (
            passouTexto &&
            passouStatus &&
            passouPrioridade
          );
        }
      );

    const corpo =
      document.getElementById(
        "requestsBody"
      );

    if (!corpo) return;

    corpo.innerHTML =
      linhasSolicitacoes(
        resultado
      );

    corpo
      .querySelectorAll(
        "[data-detail]"
      )
      .forEach(function(botao) {

        botao.onclick =
          function() {

            detalheSolicitacao(
              botao.dataset.detail
            );

          };

      });
  }

  if (busca) {
    busca.addEventListener(
      "input",
      filtrar
    );
  }

  if (filtroStatus) {
    filtroStatus.addEventListener(
      "change",
      filtrar
    );
  }

  if (filtroPrioridade) {
    filtroPrioridade.addEventListener(
      "change",
      filtrar
    );
  }

  const buscaHistorico =
    document.getElementById(
      "historySearch"
    );

  if (buscaHistorico) {

    buscaHistorico.addEventListener(
      "input",
      function() {

        const texto =
          buscaHistorico.value
            .toLowerCase()
            .trim();

        const resultado =
          db.history.filter(
            function(item) {

              return [
                item.request,
                item.action,
                item.user,
                item.detail
              ]
                .join(" ")
                .toLowerCase()
                .includes(texto);

            }
          );

        const lista =
          document.getElementById(
            "historyList"
          );

        if (lista) {
          lista.innerHTML =
            linhasHistorico(
              resultado
            );
        }

      }
    );
  }
}

function exportarCSV() {

  const cabecalho = [
    "Solicitação",
    "Unidade",
    "Solicitante",
    "Data",
    "Documentos",
    "Situação",
    "Prioridade",
    "Responsável",
    "Páginas",
    "Formato",
    "Arquivo",
    "Processo SEI"
  ];

  const linhas = [
    cabecalho
  ];

  db.requests.forEach(
    function(item) {

      linhas.push([
        item.id,
        item.unit,
        item.requester,
        item.date,
        item.documents,
        item.status,
        item.priority,
        item.responsible,
        item.pages,
        item.format,
        item.file,
        item.sei
      ]);

    }
  );

  const csv =
    "\uFEFF" +
    linhas
      .map(
        function(linha) {

          return linha
            .map(
              function(valor) {

                return `"${String(
                  valor ?? ""
                ).replace(
                  /"/g,
                  '""'
                )}"`;

              }
            )
            .join(";");

        }
      )
      .join("\n");

  const blob =
    new Blob(
      [csv],
      {
        type:
          "text/csv;charset=utf-8"
      }
    );

  const url =
    URL.createObjectURL(
      blob
    );

  const link =
    document.createElement(
      "a"
    );

  link.href = url;
  link.download =
    "sid-sei-solicitacoes.csv";

  document.body.appendChild(
    link
  );

  link.click();

  link.remove();

  URL.revokeObjectURL(url);

  mostrarMensagem(
    "Relatório CSV exportado."
  );
}

const menuMobile =
  document.getElementById(
    "mobileMenu"
  );

if (menuMobile) {

  menuMobile.onclick =
    function() {

      const sidebar =
        document.getElementById(
          "sidebar"
        );

      if (sidebar) {
        sidebar.classList.toggle(
          "open"
        );
      }

    };
}

const fundoModal =
  document.getElementById(
    "modalBackdrop"
  );

if (fundoModal) {

  fundoModal.addEventListener(
    "click",
    function(evento) {

      if (
        evento.target.id ===
        "modalBackdrop"
      ) {
        fecharModal();
      }

    }
  );
}

const notificacoes =
  document.getElementById(
    "notificationsBtn"
  );

if (notificacoes) {

  notificacoes.onclick =
    function() {

      mostrarMensagem(
        "Não há novas notificações críticas."
      );

    };
}

renderizar();