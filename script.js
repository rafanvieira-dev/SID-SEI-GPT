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

let db = loadDB();
let currentView = "dashboard";

function loadDB() {
  const saved = localStorage.getItem(STORAGE_KEY);

  if (!saved) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seed));
    return structuredClone(seed);
  }

  try {
    return JSON.parse(saved);
  } catch {
    return structuredClone(seed);
  }
}

function saveDB() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
}

function esc(value) {
  return String(value ?? "").replace(
    /[&<>"']/g,
    c => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;"
    }[c])
  );
}

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function nowBR() {
  return new Date().toLocaleString("pt-BR", {
    dateStyle: "short",
    timeStyle: "short"
  });
}

function statusBadge(status) {
  const m = statusMap[status] || ["gray", status];

  return `<span class="badge ${m[0]}">${esc(m[1])}</span>`;
}

function toast(message) {
  const el = document.getElementById("toast");

  if (!el) return;

  el.textContent = message;
  el.classList.add("show");

  clearTimeout(window.__toast);

  window.__toast = setTimeout(() => {
    el.classList.remove("show");
  }, 2500);
}

function addHistory(request, action, user, detail = "") {
  db.history.unshift({
    request,
    date: nowBR(),
    action,
    user,
    detail
  });
}

function getRequest(id) {
  return db.requests.find(r => r.id === id);
}

function nextId() {
  const years = new Date().getFullYear();

  const nums = db.requests
    .map(r => Number(r.id.split("-").pop()))
    .filter(Number.isFinite);

  const n = (Math.max(0, ...nums) + 1)
    .toString()
    .padStart(5, "0");

  return `SID-${years}-${n}`;
}

const views = {
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

function render() {
  document
    .querySelectorAll(".nav-item")
    .forEach(btn => {
      btn.classList.toggle(
        "active",
        btn.dataset.view === currentView
      );
    });

  const breadcrumb = document.getElementById("breadcrumb");

  if (breadcrumb) {
    breadcrumb.textContent = views[currentView];
  }

  const app = document.getElementById("app");

  if (app) {
    app.innerHTML = renderView(currentView);
  }

  bindViewEvents();
}

function renderView(view) {
  if (view === "dashboard") {
    return dashboardView();
  }

  if (view === "solicitacoes") {
    return requestsView();
  }

  /*
   * CORREÇÃO PRINCIPAL:
   *
   * Uma nova solicitação nasce com status "Solicitação".
   * Portanto ela precisa aparecer na fila de Recebimento.
   *
   * Também mantemos "Recebido" para permitir que registros
   * antigos/demonstração continuem funcionando.
   */
  if (view === "recebimento") {
    return stageView(
      "Recebimento",
      ["Solicitação", "Recebido"],
      "Registrar recebimento"
    );
  }

  if (view === "digitalizacao") {
    return stageView(
      "Digitalização",
      [
        "Aguardando digitalização",
        "Em digitalização",
        "Reprovado"
      ],
      "Registrar digitalização"
    );
  }

  if (view === "conferencia") {
    return conferenceView();
  }

  if (view === "sei") {
    return seiView();
  }

  if (view === "historico") {
    return historyView();
  }

  if (view === "relatorios") {
    return reportsView();
  }

  if (view === "usuarios") {
    return usersView();
  }

  return settingsView();
}

function dashboardView() {
  const total = db.requests.length;

  const pending = db.requests.filter(
    r => r.status !== "Concluído"
  ).length;

  const done = db.requests.filter(
    r => r.status === "Concluído"
  ).length;

  const pages = db.requests.reduce(
    (s, r) => s + (Number(r.pages) || 0),
    0
  );

  const recent = db.requests.slice(0, 5);

  const stageCounts = [
    [
      "Solicitação",
      db.requests.filter(
        r => r.status === "Solicitação"
      ).length
    ],

    [
      "Recebimento",
      db.requests.filter(
        r => ["Solicitação", "Recebido"].includes(r.status)
      ).length
    ],

    [
      "Digitalização",
      db.requests.filter(
        r =>
          [
            "Aguardando digitalização",
            "Em digitalização",
            "Reprovado"
          ].includes(r.status)
      ).length
    ],

    [
      "Conferência",
      db.requests.filter(
        r => r.status === "Aguardando conferência"
      ).length
    ],

    [
      "Inserção SEI",
      db.requests.filter(
        r =>
          [
            "Aguardando inserção no SEI",
            "Pendência SEI"
          ].includes(r.status)
      ).length
    ],

    [
      "Conclusão",
      done
    ]
  ];

  return `
    <div class="page-head">

      <div>
        <h1>Visão geral</h1>

        <p>
          Acompanhamento das atividades de digitalização
          e inserção no SEI.
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
        Controle desde o recebimento do documento físico
        até a conclusão da inserção no SEI.
      </p>

      <div class="flow-mini">

        ${
          [
            "Solicitação",
            "Recebimento",
            "Digitalização",
            "Conferência",
            "Liberação",
            "Inserção no SEI",
            "Conclusão"
          ]
            .map(
              (x, i) =>
                `<span class="flow-pill">
                  ${i + 1}. ${x}
                </span>
                ${
                  i < 6
                    ? '<span class="flow-arrow">›</span>'
                    : ""
                }`
            )
            .join("")
        }

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
          ${pending}
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
          ${done}
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
          ${pages.toLocaleString("pt-BR")}
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
                recent
                  .map(
                    r => `
                      <tr>

                        <td>

                          <button
                            class="link"
                            data-detail="${esc(r.id)}">
                            ${esc(r.id)}
                          </button>

                          <br>

                          <span class="muted">
                            ${esc(
                              r.description.slice(0, 45)
                            )}
                            ${
                              r.description.length > 45
                                ? "…"
                                : ""
                            }
                          </span>

                        </td>

                        <td>
                          ${esc(r.unit)}
                        </td>

                        <td>
                          ${statusBadge(r.status)}
                        </td>

                        <td>
                          ${esc(formatDate(r.date))}
                        </td>

                      </tr>
                    `
                  )
                  .join("")
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

          ${
            stageCounts
              .map(
                ([name, count]) => `
                  <div style="margin-bottom:13px">

                    <div
                      style="
                        display:flex;
                        justify-content:space-between;
                        font-size:10px;
                        margin-bottom:5px;
                      "
                    >

                      <span>
                        ${name}
                      </span>

                      <strong>
                        ${count}
                      </strong>

                    </div>

                    <div class="progress">

                      <span
                        style="
                          width:${
                            total
                              ? Math.max(
                                  (count / total) * 100,
                                  count ? 4 : 0
                                )
                              : 0
                          }%
                        "
                      ></span>

                    </div>

                  </div>
                `
              )
              .join("")
          }

        </div>

      </div>

    </div>
  `;
}

function requestsView() {
  return `
    <div class="page-head">

      <div>

        <h1>
          Solicitações de digitalização
        </h1>

        <p>
          Cadastre, acompanhe e consulte as solicitações
          recebidas das unidades.
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
              placeholder="Pesquisar por número, unidade, solicitante ou descrição..."
            >

          </div>

          <select
            class="filter-select"
            id="statusFilter">

            <option value="">
              Todas as situações
            </option>

            ${
              Object.keys(statusMap)
                .map(
                  s =>
                    `<option>${s}</option>`
                )
                .join("")
            }

          </select>

          <select
            class="filter-select"
            id="priorityFilter">

            <option value="">
              Todas prioridades
            </option>

            <option>
              Alta
            </option>

            <option>
              Normal
            </option>

            <option>
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
              ${requestRows(db.requests)}
            </tbody>

          </table>

        </div>

      </div>

    </div>
  `;
}

function requestRows(rows) {
  if (!rows.length) {
    return `
      <tr>

        <td colspan="7">

          <div class="empty">

            <strong>
              Nenhuma solicitação encontrada
            </strong>

            Ajuste os filtros ou cadastre uma nova solicitação.

          </div>

        </td>

      </tr>
    `;
  }

  return rows
    .map(
      r => `
        <tr>

          <td>

            <button
              class="link"
              data-detail="${esc(r.id)}">
              ${esc(r.id)}
            </button>

            <br>

            <span class="muted">
              ${esc(r.description.slice(0, 34))}
              ${
                r.description.length > 34
                  ? "…"
                  : ""
              }
            </span>

          </td>

          <td>

            ${esc(r.unit)}

            <br>

            <span class="muted">
              ${esc(r.requester)}
            </span>

          </td>

          <td>
            ${r.documents}
          </td>

          <td>
            ${statusBadge(r.status)}
          </td>

          <td>

            ${
              r.priority === "Alta"
                ? '<span class="badge red">Alta</span>'
                : r.priority === "Baixa"
                ? '<span class="badge gray">Baixa</span>'
                : '<span class="badge blue">Normal</span>'
            }

          </td>

          <td>
            ${esc(formatDate(r.date))}
          </td>

          <td>

            <button
              class="btn sm"
              data-detail="${esc(r.id)}">
              Abrir
            </button>

          </td>

        </tr>
      `
    )
    .join("");
}

function formatDate(s) {
  if (!s) return "-";

  const [y, m, d] = s.split("-");

  return d && m && y
    ? `${d}/${m}/${y}`
    : s;
}

function stageView(title, statuses, actionLabel) {
  const rows = db.requests.filter(
    r => statuses.includes(r.status)
  );

  return `
    <div class="page-head">

      <div>

        <h1>
          ${title}
        </h1>

        <p>
          Registros que demandam atuação nesta etapa do fluxo.
        </p>

      </div>

    </div>

    <div
      class="notice"
      style="margin-bottom:15px"
    >

      ${
        title === "Recebimento"
          ? "As novas solicitações aparecem aqui. Registre o recebimento do documento físico para encaminhar a demanda para a digitalização."
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
              rows.length
                ? rows
                    .map(
                      r => `
                        <tr>

                          <td>

                            <button
                              class="link"
                              data-detail="${esc(r.id)}">
                              ${esc(r.id)}
                            </button>

                            <br>

                            <span class="muted">
                              ${esc(
                                r.description.slice(0, 40)
                              )}
                            </span>

                          </td>

                          <td>
                            ${esc(r.unit)}
                          </td>

                          <td>
                            ${statusBadge(r.status)}
                          </td>

                          <td>
                            ${esc(
                              r.responsible || "-"
                            )}
                          </td>

                          <td>
                            ${formatDate(r.date)}
                          </td>

                          <td>

                            <button
                              class="btn sm primary"
                              data-stage="${esc(r.id)}">
                              ${actionLabel}
                            </button>

                          </td>

                        </tr>
                      `
                    )
                    .join("")
                : `
                  <tr>

                    <td colspan="6">

                      <div class="empty">

                        <strong>
                          Nenhum item nesta etapa
                        </strong>

                        Não há registros aguardando ação.

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

function conferenceView() {
  const rows = db.requests.filter(
    r =>
      [
        "Aguardando conferência",
        "Reprovado"
      ].includes(r.status)
  );

  return `
    <div class="page-head">

      <div>

        <h1>
          Conferência
        </h1>

        <p>
          Verifique correspondência e completude antes
          da liberação para o SEI.
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
              rows.length
                ? rows
                    .map(
                      r => `
                        <tr>

                          <td>

                            <button
                              class="link"
                              data-detail="${esc(r.id)}">
                              ${esc(r.id)}
                            </button>

                            <br>

                            <span class="muted">
                              ${esc(
                                r.description.slice(0, 35)
                              )}
                            </span>

                          </td>

                          <td>
                            ${esc(
                              r.file ||
                              "Não associado"
                            )}
                          </td>

                          <td>
                            ${r.pages || 0}
                          </td>

                          <td>
                            ${statusBadge(r.status)}
                          </td>

                          <td>
                            ${esc(
                              r.responsible || "-"
                            )}
                          </td>

                          <td>

                            <button
                              class="btn sm primary"
                              data-conference="${esc(r.id)}">
                              Conferir
                            </button>

                          </td>

                        </tr>
                      `
                    )
                    .join("")
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

function seiView() {
  const rows = db.requests.filter(
    r =>
      [
        "Aguardando inserção no SEI",
        "Pendência SEI"
      ].includes(r.status)
  );

  return `
    <div class="page-head">

      <div>

        <h1>
          Inserção no SEI
        </h1>

        <p>
          Registre as informações referentes à
          inserção do documento no SEI.
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
              rows.length
                ? rows
                    .map(
                      r => `
                        <tr>

                          <td>

                            <button
                              class="link"
                              data-detail="${esc(r.id)}">
                              ${esc(r.id)}
                            </button>

                            <br>

                            <span class="muted">
                              ${esc(
                                r.description.slice(0, 38)
                              )}
                            </span>

                          </td>

                          <td>
                            ${esc(r.unit)}
                          </td>

                          <td>
                            ${statusBadge(r.status)}
                          </td>

                          <td>
                            ${esc(r.sei || "—")}
                          </td>

                          <td>
                            ${esc(
                              r.responsible || "-"
                            )}
                          </td>

                          <td>

                            <button
                              class="btn sm primary"
                              data-sei="${esc(r.id)}">
                              Registrar inserção
                            </button>

                          </td>

                        </tr>
                      `
                    )
                    .join("")
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

function historyView() {
  return `
    <div class="page-head">

      <div>

        <h1>
          Histórico e rastreabilidade
        </h1>

        <p>
          Registro das operações realizadas e dos responsáveis.
        </p>

      </div>

    </div>

    <div class="card">

      <div class="card-body">

        <div class="filters">

          <div class="search">

            <input
              id="historySearch"
              placeholder="Pesquisar por solicitação, ação ou usuário..."
            >

          </div>

        </div>

        <div
          class="timeline"
          id="historyList">
          ${historyRows(db.history)}
        </div>

      </div>

    </div>
  `;
}

function historyRows(rows) {
  if (!rows.length) {
    return `
      <div class="empty">

        <strong>
          Nenhum registro encontrado
        </strong>

      </div>
    `;
  }

  return rows
    .map(
      h => `
        <div class="timeline-item">

          <div class="timeline-rail">

            <div class="timeline-dot">
              ✓
            </div>

          </div>

          <div class="timeline-content">

            <strong>

              ${esc(h.action)}

              <span class="muted">
                · ${esc(h.request)}
              </span>

            </strong>

            <p>
              ${esc(h.detail)}
            </p>

            <small>
              ${esc(h.date)}
              · Responsável:
              ${esc(h.user)}
            </small>

          </div>

        </div>
      `
    )
    .join("");
}

function reportsView() {
  const total = db.requests.length;

  const completed = db.requests.filter(
    r => r.status === "Concluído"
  ).length;

  const rejected = db.requests.filter(
    r => r.status === "Reprovado"
  ).length;

  const pendingSEI = db.requests.filter(
    r =>
      [
        "Aguardando inserção no SEI",
        "Pendência SEI"
      ].includes(r.status)
  ).length;

  const pages = db.requests.reduce(
    (s, r) => s + (Number(r.pages) || 0),
    0
  );

  return `
    <div class="page-head">

      <div>

        <h1>
          Relatórios e indicadores
        </h1>

        <p>
          Informações consolidadas sobre as
          atividades de digitalização.
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
        <span>Total de solicitações</span>
        <strong>${total}</strong>
      </div>

      <div class="kpi">
        <span>Taxa de conclusão</span>
        <strong>
          ${
            total
              ? Math.round(
                  (completed / total) * 100
                )
              : 0
          }%
        </strong>
      </div>

      <div class="kpi">
        <span>Páginas digitalizadas</span>
        <strong>
          ${pages.toLocaleString("pt-BR")}
        </strong>
      </div>

      <div class="kpi">
        <span>Reprovações</span>
        <strong>${rejected}</strong>
      </div>

      <div class="kpi">
        <span>Aguardando SEI</span>
        <strong>${pendingSEI}</strong>
      </div>

      <div class="kpi">
        <span>Usuários ativos</span>
        <strong>
          ${db.users.filter(u => u.active).length}
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

          ${
            Object.keys(statusMap)
              .map(s => {
                const n = db.requests.filter(
                  r => r.status === s
                ).length;

                return `
                  <div
                    style="
                      display:flex;
                      justify-content:space-between;
                      padding:9px 0;
                      border-bottom:1px solid #eef1f3;
                      font-size:10px;
                    "
                  >

                    <span>
                      ${statusBadge(s)}
                    </span>

                    <strong>
                      ${n}
                    </strong>

                  </div>
                `;
              })
              .join("")
          }

        </div>

      </div>

      <div class="card">

        <div class="card-head">

          <h2>
            Responsáveis
          </h2>

        </div>

        <div class="card-body">

          ${
            db.users
              .map(u => {

                const n = db.requests.filter(
                  r => r.responsible === u.name
                ).length;

                return `
                  <div
                    style="
                      display:flex;
                      align-items:center;
                      gap:10px;
                      padding:9px 0;
                      border-bottom:1px solid #eef1f3
                    "
                  >

                    <span class="avatar small">
                      ${initials(u.name)}
                    </span>

                    <div style="flex:1">

                      <strong
                        style="
                          font-size:10px;
                          display:block
                        "
                      >
                        ${esc(u.name)}
                      </strong>

                      <span class="muted">
                        ${esc(u.profile)}
                      </span>

                    </div>

                    <strong>
                      ${n}
                    </strong>

                  </div>
                `;
              })
              .join("")
          }

        </div>

      </div>

    </div>
  `;
}

function initials(name) {
  return name
    .split(" ")
    .slice(0, 2)
    .map(x => x[0])
    .join("")
    .toUpperCase();
}

function usersView() {
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

            ${
              db.users
                .map(
                  u => `
                    <tr>

                      <td>

                        <div
                          style="
                            display:flex;
                            align-items:center;
                            gap:8px
                          "
                        >

                          <span class="avatar small">
                            ${initials(u.name)}
                          </span>

                          <strong>
                            ${esc(u.name)}
                          </strong>

                        </div>

                      </td>

                      <td>
                        ${esc(u.profile)}
                      </td>

                      <td>
                        ${esc(u.unit)}
                      </td>

                      <td>

                        ${
                          u.active
                            ? '<span class="badge green">Ativo</span>'
                            : '<span class="badge gray">Inativo</span>'
                        }

                      </td>

                      <td>

                        <button
                          class="btn sm"
                          data-toggle-user="${u.id}">
                          ${
                            u.active
                              ? "Desativar"
                              : "Ativar"
                          }
                        </button>

                      </td>

                    </tr>
                  `
                )
                .join("")
            }

          </tbody>

        </table>

      </div>

    </div>

    <div
      class="notice"
      style="margin-top:15px">

      Os perfis seguem os atores definidos no
      Documento de Visão: Solicitante, Operador
      de digitalização, Conferente, Responsável
      pela inserção no SEI, Gestor e Administrador.

    </div>
  `;
}

function settingsView() {
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

          <p
            style="
              font-size:11px;
              line-height:1.6;
              color:var(--muted)
            "
          >

            Esta primeira versão utiliza o armazenamento
            local do navegador para demonstração.
            Em uma implantação real, os registros,
            arquivos e trilhas de auditoria devem ser
            transferidos para um backend e banco de
            dados apropriados.

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

function openModal(title, body, footer = "") {
  document.getElementById("modal").innerHTML = `
    <div class="modal-head">

      <h2>
        ${title}
      </h2>

      <button
        class="close"
        data-action="close-modal">
        ×
      </button>

    </div>

    <div class="modal-body">

      ${body}

      ${
        footer
          ? `<div class="form-footer">
              ${footer}
             </div>`
          : ""
      }

    </div>
  `;

  document
    .getElementById("modalBackdrop")
    .classList.remove("hidden");
}

function closeModal() {
  document
    .getElementById("modalBackdrop")
    .classList.add("hidden");
}

function newRequestModal() {
  openModal(
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
              value="${todayISO()}">

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
              placeholder="Descreva os documentos encaminhados para digitalização."
            ></textarea>

          </div>

        </div>

        <div class="form-footer">

          <button
            type="button"
            class="btn"
            data-action="close-modal">
            Cancelar
          </button>

          <button
            class="btn primary">
            Cadastrar solicitação
          </button>

        </div>

      </form>
    `
  );
}

function detailModal(id) {
  const r = getRequest(id);

  if (!r) return;

  const hist = db.history
    .filter(h => h.request === id)
    .slice(0, 8);

  openModal(
    `Solicitação ${r.id}`,
    `
      <div class="detail-grid">

        <div>

          <div class="info-list">

            <div class="info">
              <label>Situação</label>
              <strong>
                ${statusBadge(r.status)}
              </strong>
            </div>

            <div class="info">
              <label>Prioridade</label>
              <strong>
                ${esc(r.priority)}
              </strong>
            </div>

            <div class="info">
              <label>Unidade</label>
              <strong>
                ${esc(r.unit)}
              </strong>
            </div>

            <div class="info">
              <label>Solicitante</label>
              <strong>
                ${esc(r.requester)}
              </strong>
            </div>

            <div class="info">
              <label>Data</label>
              <strong>
                ${formatDate(r.date)}
              </strong>
            </div>

            <div class="info">
              <label>Documentos</label>
              <strong>
                ${r.documents}
              </strong>
            </div>

            <div class="info">
              <label>Arquivo digital</label>
              <strong>
                ${esc(r.file || "Não associado")}
              </strong>
            </div>

            <div class="info">
              <label>Formato / páginas</label>
              <strong>
                ${esc(r.format || "—")} /
                ${r.pages || 0}
              </strong>
            </div>

            <div class="info">
              <label>Processo SEI</label>
              <strong>
                ${esc(r.sei || "Não informado")}
              </strong>
            </div>

            <div class="info">
              <label>Responsável atual</label>
              <strong>
                ${esc(
                  r.responsible ||
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
                ${esc(r.description)}
              </strong>

            </div>

          </div>

        </div>

        <div
          class="card"
          style="box-shadow:none">

          <div class="card-head">

            <h2>
              Histórico
            </h2>

          </div>

          <div class="card-body">

            <div class="timeline">

              ${
                hist.length
                  ? historyRows(hist)
                  : '<div class="empty">Sem histórico.</div>'
              }

            </div>

          </div>

        </div>

      </div>
    `
  );
}

function stageModal(id) {
  const r = getRequest(id);

  if (!r) return;

  /*
   * CORREÇÃO:
   *
   * Tanto "Solicitação" quanto "Recebido"
   * pertencem à etapa de Recebimento.
   *
   * Antes o sistema verificava somente "Recebido".
   * Isso fazia uma nova demanda abrir a tela
   * errada de digitalização.
   */
  if (
    r.status === "Solicitação" ||
    r.status === "Recebido"
  ) {
    openModal(
      `Registrar recebimento — ${r.id}`,
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
                value="${todayISO()}">

            </div>

            <div class="field">

              <label>
                Responsável
              </label>

              <select name="responsible">

                ${
                  db.users
                    .filter(
                      u =>
                        u.profile ===
                          "Operador de digitalização" ||
                        u.profile === "Gestor"
                    )
                    .map(
                      u =>
                        `<option>
                          ${esc(u.name)}
                        </option>`
                    )
                    .join("")
                }

              </select>

            </div>

            <div class="field full">

              <label>
                Observações
              </label>

              <textarea
                name="notes"
                placeholder="Condições do material, conferência inicial, ocorrências..."
              ></textarea>

            </div>

          </div>

          <div class="form-footer">

            <button
              type="button"
              class="btn"
              data-action="close-modal">
              Cancelar
            </button>

            <button
              class="btn primary">
              Registrar recebimento
            </button>

          </div>

        </form>
      `
    );

  } else {

    openModal(
      `Registrar digitalização — ${r.id}`,
      `
        <form id="digitizeForm">

          <div class="form-grid">

            <div class="field">

              <label>
                Responsável
              </label>

              <select name="responsible">

                ${
                  db.users
                    .filter(
                      u =>
                        u.profile ===
                          "Operador de digitalização" ||
                        u.profile === "Gestor"
                    )
                    .map(
                      u =>
                        `<option>
                          ${esc(u.name)}
                        </option>`
                    )
                    .join("")
                }

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
                value="${r.pages || 1}"
                required>

            </div>

            <div class="field">

              <label>
                Formato
              </label>

              <select name="format">

                <option>
                  PDF/A
                </option>

                <option>
                  PDF
                </option>

                <option>
                  TIFF
                </option>

                <option>
                  JPEG
                </option>

              </select>

            </div>

            <div class="field">

              <label>
                Arquivo produzido
              </label>

              <input
                name="file"
                value="${esc(r.file)}"
                placeholder="nome-do-arquivo.pdf">

            </div>

            <div class="field full">

              <label>
                Ocorrência / observações
              </label>

              <textarea
                name="notes"
                placeholder="Registre problemas, danos, ausência de páginas etc."
              ></textarea>

            </div>

          </div>

          <div class="form-footer">

            <button
              type="button"
              class="btn"
              data-action="close-modal">
              Cancelar
            </button>

            <button
              class="btn primary">
              Concluir digitalização
            </button>

          </div>

        </form>
      `
    );
  }
}

function conferenceModal(id) {
  const r = getRequest(id);

  if (!r) return;

  openModal(
    `Conferência — ${r.id}`,
    `
      <div class="file-box">

        <strong>
          ${esc(
            r.file ||
            "Arquivo não associado"
          )}
        </strong>

        <div
          class="muted"
          style="margin-top:5px">

          ${r.pages || 0}
          páginas ·
          ${esc(
            r.format ||
            "Formato não informado"
          )}

        </div>

        <div
          class="muted"
          style="margin-top:10px">

          Protótipo: aqui seria disponibilizada
          a visualização do representante digital.

        </div>

      </div>

      <div
        style="margin-top:15px"
        class="notice">

        A conferência deve verificar correspondência
        e completude. Em caso de reprovação, registre
        o motivo e encaminhe para correção/nova
        digitalização.

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

              ${
                db.users
                  .filter(
                    u =>
                      u.profile === "Conferente" ||
                      u.profile === "Gestor"
                  )
                  .map(
                    u =>
                      `<option>
                        ${esc(u.name)}
                      </option>`
                  )
                  .join("")
              }

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
              placeholder="Registre a justificativa ou observações da conferência."
            ></textarea>

          </div>

        </div>

        <div class="form-footer">

          <button
            type="button"
            class="btn"
            data-action="close-modal">
            Cancelar
          </button>

          <button
            class="btn primary">
            Registrar conferência
          </button>

        </div>

      </form>
    `
  );
}

function seiModal(id) {
  const r = getRequest(id);

  if (!r) return;

  openModal(
    `Registrar inserção no SEI — ${r.id}`,
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
              value="${esc(r.sei)}"
              required
              placeholder="00000.000000/0000-00">

          </div>

          <div class="field">

            <label>
              Responsável
            </label>

            <select name="responsible">

              ${
                db.users
                  .filter(
                    u =>
                      u.profile ===
                        "Responsável pela inserção no SEI" ||
                      u.profile === "Gestor"
                  )
                  .map(
                    u =>
                      `<option>
                        ${esc(u.name)}
                      </option>`
                  )
                  .join("")
              }

            </select>

          </div>

          <div class="field">

            <label>
              Data da inserção
            </label>

            <input
              type="date"
              name="date"
              value="${todayISO()}">

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

          <button
            class="btn primary">
            Concluir solicitação
          </button>

        </div>

      </form>
    `
  );
}

function userModal() {
  openModal(
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

          <button
            class="btn primary">
            Cadastrar usuário
          </button>

        </div>

      </form>
    `
  );
}

function bindViewEvents() {

  document
    .querySelectorAll("[data-view]")
    .forEach(btn => {

      btn.onclick = () => {

        currentView = btn.dataset.view;

        render();

        const sidebar =
          document.getElementById("sidebar");

        if (sidebar) {
          sidebar.classList.remove("open");
        }

      };

    });

  document
    .querySelectorAll("[data-view-link]")
    .forEach(btn => {

      btn.onclick = () => {

        currentView =
          btn.dataset.viewLink;

        render();

      };

    });

  document
    .querySelectorAll("[data-detail]")
    .forEach(btn => {

      btn.onclick = () =>
        detailModal(
          btn.dataset.detail
        );

    });

  document
    .querySelectorAll(
      "[data-action='new-request']"
    )
    .forEach(btn => {

      btn.onclick = newRequestModal;

    });

  document
    .querySelectorAll(
      "[data-action='new-user']"
    )
    .forEach(btn => {

      btn.onclick = userModal;

    });

  document
    .querySelectorAll(
      "[data-action='close-modal']"
    )
    .forEach(btn => {

      btn.onclick = closeModal;

    });

  document
    .querySelectorAll("[data-stage]")
    .forEach(btn => {

      btn.onclick = () =>
        stageModal(
          btn.dataset.stage
        );

    });

  document
    .querySelectorAll("[data-conference]")
    .forEach(btn => {

      btn.onclick = () =>
        conferenceModal(
          btn.dataset.conference
        );

    });

  document
    .querySelectorAll("[data-sei]")
    .forEach(btn => {

      btn.onclick = () =>
        seiModal(
          btn.dataset.sei
        );

    });

  document
    .querySelectorAll("[data-toggle-user]")
    .forEach(btn => {

      btn.onclick = () => {

        const u = db.users.find(
          x =>
            x.id ==
            btn.dataset.toggleUser
        );

        if (!u) return;

        u.active = !u.active;

        saveDB();

        render();

        toast(
          "Situação do usuário atualizada."
        );

      };

    });

  document
    .querySelectorAll(
      "[data-action='export']"
    )
    .forEach(btn => {

      btn.onclick = exportCSV;

    });

  document
    .querySelectorAll(
      "[data-action='reset']"
    )
    .forEach(btn => {

      btn.onclick = () => {

        if (
          confirm(
            "Restaurar os dados de demonstração? As alterações locais serão perdidas."
          )
        ) {

          db = structuredClone(seed);

          saveDB();

          render();

          toast(
            "Dados de demonstração restaurados."
          );

        }

      };

    });

  const search =
    document.getElementById(
      "requestSearch"
    );

  const sf =
    document.getElementById(
      "statusFilter"
    );

  const pf =
    document.getElementById(
      "priorityFilter"
    );

  function filterRequests() {

    if (!search) return;

    const q =
      search.value.toLowerCase();

    const s =
      sf.value;

    const p =
      pf.value;

    const rows =
      db.requests.filter(
        r =>
          (
            !q ||
            [
              r.id,
              r.unit,
              r.requester,
              r.description
            ]
              .join(" ")
              .toLowerCase()
              .includes(q)
          ) &&
          (!s || r.status === s) &&
          (!p || r.priority === p)
      );

    const body =
      document.getElementById(
        "requestsBody"
      );

    if (body) {
      body.innerHTML =
        requestRows(rows);
    }

    document
      .querySelectorAll("[data-detail]")
      .forEach(btn => {

        btn.onclick = () =>
          detailModal(
            btn.dataset.detail
          );

      });

  }

  [search, sf, pf].forEach(
    x => {

      if (x) {
        x.addEventListener(
          "input",
          filterRequests
        );
      }

    }
  );

  const hs =
    document.getElementById(
      "historySearch"
    );

  if (hs) {

    hs.addEventListener(
      "input",
      () => {

        const q =
          hs.value.toLowerCase();

        const historyList =
          document.getElementById(
            "historyList"
          );

        if (historyList) {

          historyList.innerHTML =
            historyRows(
              db.history.filter(
                h =>
                  [
                    h.request,
                    h.action,
                    h.user,
                    h.detail
                  ]
                    .join(" ")
                    .toLowerCase()
                    .includes(q)
              )
            );

        }

      }
    );

  }

  /*
   * NOVA SOLICITAÇÃO
   *
   * A demanda é criada com status "Solicitação".
   * Ela aparecerá automaticamente na etapa
   * "Recebimento".
   */

  const requestForm =
    document.getElementById(
      "requestForm"
    );

  if (requestForm) {

    requestForm.addEventListener(
      "submit",
      e => {

        e.preventDefault();

        const f =
          new FormData(
            e.target
          );

        const id =
          nextId();

        const r = {
          id,

          unit:
            f.get("unit"),

          requester:
            f.get("requester"),

          date:
            f.get("date") ||
            todayISO(),

          description:
            f.get("description"),

          documents:
            Number(
              f.get("documents")
            ),

          /*
           * A nova demanda começa aqui.
           */
          status:
            "Solicitação",

          priority:
            f.get("priority"),

          responsible:
            f.get("requester"),

          sei: "",

          pages: 0,

          file: "",

          format: ""
        };

        db.requests.unshift(r);

        addHistory(
          id,
          "Solicitação criada",
          r.requester,
          `Solicitação encaminhada pela unidade ${r.unit}.`
        );

        saveDB();

        closeModal();

        /*
         * Após cadastrar, continua mostrando
         * a lista de solicitações.
         */
        currentView =
          "solicitacoes";

        render();

        toast(
          `Solicitação ${id} criada e encaminhada para Recebimento.`
        );

      }
    );

  }

  /*
   * RECEBIMENTO
   *
   * Solicitação:
   * Solicitação
   *      ↓
   * Recebimento registrado
   *      ↓
   * Aguardando digitalização
   */

  const receiveForm =
    document.getElementById(
      "receiveForm"
    );

  if (receiveForm) {

    receiveForm.addEventListener(
      "submit",
      e => {

        e.preventDefault();

        const f =
          new FormData(
            e.target
          );

        const title =
          document.querySelector(
            "#modal h2"
          );

        if (!title) return;

        const parts =
          title.textContent.split("—");

        const id =
          parts[1]
            ? parts[1].trim()
            : "";

        const r =
          getRequest(id);

        if (!r) return;

        /*
         * Depois do recebimento,
         * a demanda vai para Digitalização.
         */
        r.status =
          "Aguardando digitalização";

        r.responsible =
          f.get("responsible");

        addHistory(
          id,
          "Recebimento registrado",
          r.responsible,
          f.get("notes") ||
            "Documento físico recebido."
        );

        saveDB();

        closeModal();

        /*
         * Vai diretamente para a próxima etapa
         * para facilitar o acompanhamento.
         */
        currentView =
          "digitalizacao";

        render();

        toast(
          "Recebimento registrado. A demanda foi encaminhada para Digitalização."
        );

      }
    );

  }

  /*
   * DIGITALIZAÇÃO
   *
   * Aguardando digitalização
   *      ↓
   * Digitalização realizada
   *      ↓
   * Aguardando conferência
   */

  const digitizeForm =
    document.getElementById(
      "digitizeForm"
    );

  if (digitizeForm) {

    digitizeForm.addEventListener(
      "submit",
      e => {

        e.preventDefault();

        const f =
          new FormData(
            e.target
          );

        const title =
          document.querySelector(
            "#modal h2"
          );

        if (!title) return;

        const parts =
          title.textContent.split("—");

        const id =
          parts[1]
            ? parts[1].trim()
            : "";

        const r =
          getRequest(id);

        if (!r) return;

        r.status =
          "Aguardando conferência";

        r.responsible =
          f.get("responsible");

        r.pages =
          Number(
            f.get("pages")
          );

        r.file =
          f.get("file") ||
          `${id.toLowerCase()}.pdf`;

        r.format =
          f.get("format");

        addHistory(
          id,
          "Digitalização realizada",
          r.responsible,
          `${r.pages} páginas associadas ao registro. ${
            f.get("notes") || ""
          }`
        );

        saveDB();

        closeModal();

        currentView =
          "conferencia";

        render();

        toast(
          "Digitalização registrada. A demanda foi encaminhada para Conferência."
        );

      }
    );

  }

  /*
   * CONFERÊNCIA
   *
   * Aprovado:
   * Conferência
   *      ↓
   * Aguardando inserção no SEI
   *
   * Reprovado:
   * Conferência
   *      ↓
   * Reprovado
   *      ↓
   * Digitalização novamente
   */

  const conferenceForm =
    document.getElementById(
      "conferenceForm"
    );

  if (conferenceForm) {

    conferenceForm.addEventListener(
      "submit",
      e => {

        e.preventDefault();

        const f =
          new FormData(
            e.target
          );

        const title =
          document.querySelector(
            "#modal h2"
          );

        if (!title) return;

        const parts =
          title.textContent.split("—");

        const id =
          parts[1]
            ? parts[1].trim()
            : "";

        const r =
          getRequest(id);

        if (!r) return;

        r.responsible =
          f.get("responsible");

        if (
          f.get("result") ===
          "approved"
        ) {

          r.status =
            "Aguardando inserção no SEI";

          addHistory(
            id,
            "Conferência aprovada",
            r.responsible,
            `Documento liberado para inserção no SEI. ${
              f.get("notes") || ""
            }`
          );

          saveDB();

          closeModal();

          currentView =
            "sei";

          render();

          toast(
            "Conferência aprovada. A demanda foi encaminhada para Inserção no SEI."
          );

        } else {

          r.status =
            "Reprovado";

          addHistory(
            id,
            "Conferência reprovada",
            r.responsible,
            `Correção/nova digitalização necessária. ${
              f.get("notes") || ""
            }`
          );

          saveDB();

          closeModal();

          currentView =
            "digitalizacao";

          render();

          toast(
            "Conferência reprovada. A demanda retornou para Digitalização."
          );

        }

      }
    );

  }

  /*
   * INSERÇÃO NO SEI
   *
   * Aguardando inserção no SEI
   *      ↓
   * Inserção registrada
   *      ↓
   * Concluído
   */

  const seiForm =
    document.getElementById(
      "seiForm"
    );

  if (seiForm) {

    seiForm.addEventListener(
      "submit",
      e => {

        e.preventDefault();

        const f =
          new FormData(
            e.target
          );

        const title =
          document.querySelector(
            "#modal h2"
          );

        if (!title) return;

        const parts =
          title.textContent.split("—");

        const id =
          parts[1]
            ? parts[1].trim()
            : "";

        const r =
          getRequest(id);

        if (!r) return;

        r.status =
          "Concluído";

        r.sei =
          f.get("sei");

        r.responsible =
          f.get("responsible");

        addHistory(
          id,
          "Inserção no SEI registrada",
          r.responsible,
          `Processo SEI: ${r.sei}. Documento: ${
            f.get("seiDoc") ||
            "não informado"
          }. ${
            f.get("notes") || ""
          }`
        );

        addHistory(
          id,
          "Solicitação concluída",
          r.responsible,
          "Fluxo concluído e registro disponível para consulta."
        );

        saveDB();

        closeModal();

        currentView =
          "solicitacoes";

        render();

        toast(
          "Inserção no SEI registrada. Solicitação concluída."
        );

      }
    );

  }

  /*
   * USUÁRIO
   */

  const userForm =
    document.getElementById(
      "userForm"
    );

  if (userForm) {

    userForm.addEventListener(
      "submit",
      e => {

        e.preventDefault();

        const f =
          new FormData(
            e.target
          );

        const id =
          Math.max(
            0,
            ...db.users.map(
              u => u.id
            )
          ) + 1;

        db.users.push({
          id,

          name:
            f.get("name"),

          profile:
            f.get("profile"),

          unit:
            f.get("unit"),

          active:
            true
        });

        saveDB();

        closeModal();

        render();

        toast(
          "Usuário cadastrado."
        );

      }
    );

  }
}

function exportCSV() {

  const headers = [
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

  const lines = [
    headers,

    ...db.requests.map(
      r => [
        r.id,
        r.unit,
        r.requester,
        r.date,
        r.documents,
        r.status,
        r.priority,
        r.responsible,
        r.pages,
        r.format,
        r.file,
        r.sei
      ]
    )
  ];

  const csv =
    "\uFEFF" +
    lines
      .map(
        row =>
          row
            .map(
              v =>
                `"${String(
                  v ?? ""
                ).replace(
                  /"/g,
                  '""'
                )}"`
            )
            .join(";")
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

  const a =
    document.createElement(
      "a"
    );

  a.href =
    URL.createObjectURL(
      blob
    );

  a.download =
    "sid-sei-solicitacoes.csv";

  a.click();

  URL.revokeObjectURL(
    a.href
  );

  toast(
    "Relatório CSV exportado."
  );
}

const mobileMenu =
  document.getElementById(
    "mobileMenu"
  );

if (mobileMenu) {

  mobileMenu.onclick = () => {

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

const modalBackdrop =
  document.getElementById(
    "modalBackdrop"
  );

if (modalBackdrop) {

  modalBackdrop.addEventListener(
    "click",
    e => {

      if (
        e.target.id ===
        "modalBackdrop"
      ) {
        closeModal();
      }

    }
  );

}

const notificationsBtn =
  document.getElementById(
    "notificationsBtn"
  );

if (notificationsBtn) {

  notificationsBtn.onclick =
    () =>
      toast(
        "Não há novas notificações críticas."
      );

}

render();
