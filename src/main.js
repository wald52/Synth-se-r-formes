import "./styles.css";
import { select, format } from "d3";
import { sankey, sankeyLinkHorizontal, sankeyJustify } from "d3-sankey";
import {
  meta,
  families,
  recettes,
  depenses,
  central,
} from "./data/scenario.js";

// ---------------------------------------------------------------------------
// État
// ---------------------------------------------------------------------------
let scenario = "avant"; // "avant" | "apres"

const fmt = (v) => format(",.1f")(v).replace(/,/g, " ");
const fmtSigned = (v) => (v >= 0 ? "+" : "") + fmt(v);
const colorOf = (famKey) => families[famKey]?.color ?? "#94a3b8";
const valueOf = (n) => (scenario === "avant" ? n.avant : n.apres);
const labelOf = (n) =>
  scenario === "apres" && n.apresLabel ? n.apresLabel : n.label;

// ---------------------------------------------------------------------------
// Construction du graphe pour le scénario courant
// ---------------------------------------------------------------------------
function buildGraph() {
  const totalRec = recettes.reduce((s, n) => s + valueOf(n), 0);
  const totalDep = depenses.reduce((s, n) => s + valueOf(n), 0);
  const deficit = Math.max(0, totalDep - totalRec);

  const nodes = [];
  const links = [];

  // recettes -> apu
  recettes.forEach((n) => {
    const v = valueOf(n);
    if (v <= 0) return;
    nodes.push({ ...n, side: "in", value: v });
    links.push({
      source: n.id,
      target: central.id,
      value: v,
      color: colorOf(n.family),
      ref: n,
    });
  });

  // besoin de financement (déficit) -> apu
  if (deficit > 0) {
    const dnode = {
      id: "r-deficit",
      label: "Besoin de financement (déficit)",
      family: "deficit",
      side: "in",
      value: deficit,
      doctrine: "—",
      avant: Math.max(0, totalDep - totalRec),
      apres: Math.max(0, totalDep - totalRec),
      description:
        "Solde public = recettes − dépenses. Le déficit est financé par l'emprunt. " +
        "Il apparaît ici comme une ressource d'équilibrage du diagramme.",
    };
    nodes.push(dnode);
    links.push({
      source: "r-deficit",
      target: central.id,
      value: deficit,
      color: colorOf("deficit"),
      ref: dnode,
    });
  }

  // apu central
  nodes.push({ ...central, side: "mid", value: totalDep });

  // apu -> dépenses
  depenses.forEach((n) => {
    const v = valueOf(n);
    if (v <= 0) return;
    nodes.push({ ...n, side: "out", value: v });
    links.push({
      source: central.id,
      target: n.id,
      value: v,
      color: colorOf(n.family),
      ref: n,
    });
  });

  return { nodes, links, totalRec, totalDep, deficit };
}

// ---------------------------------------------------------------------------
// KPIs (synthèse chiffrée + delta entre scénarios)
// ---------------------------------------------------------------------------
function renderKpis() {
  const recA = recettes.reduce((s, n) => s + n.avant, 0);
  const depA = depenses.reduce((s, n) => s + n.avant, 0);
  const recP = recettes.reduce((s, n) => s + n.apres, 0);
  const depP = depenses.reduce((s, n) => s + n.apres, 0);
  const soldeA = recA - depA;
  const soldeP = recP - depP;

  const cur = {
    rec: scenario === "avant" ? recA : recP,
    dep: scenario === "avant" ? depA : depP,
    solde: scenario === "avant" ? soldeA : soldeP,
  };

  const cards = [
    {
      k: "Recettes",
      v: fmt(cur.rec),
      d: fmtSigned(recP - recA),
      cls: "neutral",
    },
    {
      k: "Dépenses",
      v: fmt(cur.dep),
      d: fmtSigned(depP - depA),
      cls: "neutral",
    },
    {
      k: "Solde public",
      v: fmtSigned(cur.solde),
      d: fmtSigned(soldeP - soldeA) + " vs avant",
      cls: cur.solde >= 0 ? "good" : "bad",
    },
  ];

  select("#kpis")
    .html("")
    .selectAll("div.kpi")
    .data(cards)
    .join("div")
    .attr("class", (d) => `kpi ${d.cls}`)
    .html(
      (d) =>
        `<span class="kpi-k">${d.k}</span>` +
        `<span class="kpi-v">${d.v} <small>Md€</small></span>` +
        `<span class="kpi-d">${d.d}</span>`,
    );
}

// ---------------------------------------------------------------------------
// Sankey
// ---------------------------------------------------------------------------
function render() {
  renderKpis();

  const chart = select("#chart");
  chart.html("");
  const width = chart.node().clientWidth || 900;
  const height = Math.max(640, (recettes.length + depenses.length) * 17);

  const { nodes, links } = buildGraph();

  const sankeyGen = sankey()
    .nodeId((d) => d.id)
    .nodeAlign(sankeyJustify)
    .nodeWidth(20)
    .nodePadding(11)
    .extent([
      [4, 12],
      [width - 4, height - 12],
    ]);

  const graph = sankeyGen({
    nodes: nodes.map((d) => ({ ...d })),
    links: links.map((d) => ({ ...d })),
  });

  const svg = chart
    .append("svg")
    .attr("viewBox", `0 0 ${width} ${height}`)
    .attr("width", "100%")
    .attr("height", height);

  // gradients par lien
  const defs = svg.append("defs");
  graph.links.forEach((l, i) => {
    const g = defs
      .append("linearGradient")
      .attr("id", `grad-${i}`)
      .attr("gradientUnits", "userSpaceOnUse")
      .attr("x1", l.source.x1)
      .attr("x2", l.target.x0);
    const c = l.color;
    g.append("stop").attr("offset", "0%").attr("stop-color", c).attr("stop-opacity", 0.55);
    g.append("stop").attr("offset", "100%").attr("stop-color", c).attr("stop-opacity", 0.3);
  });

  // liens
  svg
    .append("g")
    .attr("fill", "none")
    .selectAll("path")
    .data(graph.links)
    .join("path")
    .attr("class", "link")
    .attr("d", sankeyLinkHorizontal())
    .attr("stroke", (d, i) => `url(#grad-${i})`)
    .attr("stroke-width", (d) => Math.max(1, d.width))
    .on("click", (e, d) => showDetail(d.ref))
    .append("title")
    .text((d) => `${labelOf(d.ref)} : ${fmt(d.value)} Md€`);

  // nœuds
  const node = svg
    .append("g")
    .selectAll("g")
    .data(graph.nodes)
    .join("g")
    .attr("class", "node")
    .attr("tabindex", 0)
    .on("click", (e, d) => showDetail(d))
    .on("keydown", (e, d) => {
      if (e.key === "Enter" || e.key === " ") showDetail(d);
    });

  node
    .append("rect")
    .attr("x", (d) => d.x0)
    .attr("y", (d) => d.y0)
    .attr("height", (d) => Math.max(1, d.y1 - d.y0))
    .attr("width", (d) => d.x1 - d.x0)
    .attr("fill", (d) =>
      d.id === central.id ? "#0f172a" : colorOf(d.family),
    )
    .attr("rx", 2);

  node
    .append("text")
    .attr("class", "node-label")
    .attr("x", (d) => (d.side === "in" ? d.x1 + 6 : d.x0 - 6))
    .attr("y", (d) => (d.y0 + d.y1) / 2)
    .attr("dy", "0.35em")
    .attr("text-anchor", (d) => (d.side === "in" ? "start" : "end"))
    .each(function (d) {
      const t = select(this);
      if (d.id === central.id) {
        t.attr("text-anchor", "middle")
          .attr("x", (d.x0 + d.x1) / 2)
          .attr("y", d.y0 - 6)
          .attr("class", "node-label central")
          .text(`${central.label} · ${fmt(d.value)} Md€`);
        return;
      }
      const v = valueOf(d);
      t.append("tspan").attr("font-weight", 600).text(labelOf(d));
      t.append("tspan")
        .attr("class", "node-val")
        .text(`  ${fmt(v)}`);
      // marqueur de variation
      const delta = (d.apres ?? 0) - (d.avant ?? 0);
      if (Math.abs(delta) >= 0.5) {
        t.append("tspan")
          .attr("class", delta > 0 ? "up" : "down")
          .text(`  ${delta > 0 ? "▲" : "▼"}${fmt(Math.abs(delta))}`);
      } else if ((d.avant ?? 0) === 0 && (d.apres ?? 0) > 0) {
        t.append("tspan").attr("class", "new").text("  ✦ nouveau");
      }
    });

  renderLegend();
}

// ---------------------------------------------------------------------------
// Légende
// ---------------------------------------------------------------------------
function renderLegend() {
  const used = new Set([
    ...recettes.map((n) => n.family),
    ...depenses.map((n) => n.family),
    "deficit",
  ]);
  select("#legend")
    .html("")
    .selectAll("span.lg")
    .data([...used].filter((f) => families[f]))
    .join("span")
    .attr("class", "lg")
    .html(
      (f) =>
        `<i style="background:${families[f].color}"></i>${families[f].label}`,
    );
}

// ---------------------------------------------------------------------------
// Panneau de détail
// ---------------------------------------------------------------------------
function showDetail(ref) {
  if (!ref) return;
  const avant = ref.avant ?? 0;
  const apres = ref.apres ?? 0;
  const delta = apres - avant;
  const pct = avant > 0 ? (delta / avant) * 100 : apres > 0 ? 100 : 0;
  const deltaCls = delta > 0 ? "up" : delta < 0 ? "down" : "flat";

  const html = `
    <button class="close" id="detclose" aria-label="Fermer">×</button>
    <span class="det-fam" style="color:${colorOf(ref.family)}">
      ${families[ref.family]?.label ?? ""}
    </span>
    <h2>${(scenario === "apres" && ref.apresLabel) || ref.label}</h2>
    <table class="det-tab">
      <tr><th>Avant</th><td>${fmt(avant)} Md€</td></tr>
      <tr><th>Après</th><td>${fmt(apres)} Md€</td></tr>
      <tr class="${deltaCls}">
        <th>Variation</th>
        <td>${fmtSigned(delta)} Md€ ${
          avant > 0 ? `(${fmtSigned(pct).replace(".0", "")} %)` : ""
        }</td>
      </tr>
    </table>
    ${
      ref.doctrine && ref.doctrine !== "—"
        ? `<p class="det-ref">📑 Référence : <strong>${ref.doctrine}</strong></p>`
        : ""
    }
    <p class="det-desc">${ref.description ?? ""}</p>
  `;
  select("#detail").html(html);
  select("#detclose").on("click", () => {
    select("#detail").html(
      `<p class="hint">Cliquez sur un flux ou un poste pour afficher le détail des changements et la référence doctrinale.</p>`,
    );
  });
}

// ---------------------------------------------------------------------------
// Bascule de scénario
// ---------------------------------------------------------------------------
function setScenario(s) {
  scenario = s;
  select("#btn-avant")
    .classed("active", s === "avant")
    .attr("aria-selected", s === "avant");
  select("#btn-apres")
    .classed("active", s === "apres")
    .attr("aria-selected", s === "apres");
  render();
}

select("#btn-avant").on("click", () => setScenario("avant"));
select("#btn-apres").on("click", () => setScenario("apres"));
window.addEventListener("resize", () => render());

document.title = meta.title;
setScenario("avant");
