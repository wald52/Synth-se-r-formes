// ---------------------------------------------------------------------------
// Synthèse des réformes — données de simulation budgétaire (AVANT / APRÈS)
// ---------------------------------------------------------------------------
//
// AVANT  = sphère publique française actuelle (administrations publiques S13),
//          ordres de grandeur INSEE 2024-2025, en Md€.
// APRÈS  = régime CIBLE des trois notes de doctrine fournies :
//            • Doctrine retraites (réforme systémique type suédois)
//            • Revenu universel et refonte des prestations sociales
//            • Chapitre fiscalité (remise à plat du système fiscal)
//
// Les montants APRÈS sont des ordres de grandeur PROGRAMMATIQUES (régime
// stabilisé / horizon ~10-15 ans), pas une micro-simulation actuarielle.
// Chaque poste porte la référence doctrinale qui justifie sa variation.
// ---------------------------------------------------------------------------

export const meta = {
  title: "Sphère publique française — simulation des doctrines",
  perimeter: "Administrations publiques (S13)",
  unit: "Md€",
  avantLabel: "Avant (système actuel)",
  apresLabel: "Après (doctrines simulées)",
  avantYear: "2025",
  apresYear: "régime cible",
};

// Familles (couleurs) ------------------------------------------------------
export const families = {
  // recettes
  cotisations: { label: "Cotisations contributives", color: "#2563eb" },
  impotRevenu: { label: "Impôt sur les revenus", color: "#1d4ed8" },
  consommation: { label: "Consommation", color: "#0891b2" },
  foncier: { label: "Foncier / patrimoine", color: "#7c3aed" },
  production: { label: "Production / entreprises", color: "#0d9488" },
  carbone: { label: "Carbone / énergie", color: "#65a30d" },
  autresRec: { label: "Autres recettes", color: "#64748b" },
  deficit: { label: "Besoin de financement", color: "#b91c1c" },
  // dépenses
  fonctionnement: { label: "Fonctionnement", color: "#475569" },
  retraites: { label: "Retraites", color: "#c026d3" },
  universel: { label: "Revenu universel", color: "#db2777" },
  prestations: { label: "Autres prestations", color: "#e11d48" },
  sante: { label: "Santé / nature", color: "#ea580c" },
  redistribution: { label: "Subventions / transferts", color: "#d97706" },
  investissement: { label: "Investissement", color: "#16a34a" },
  charge: { label: "Charge de la dette", color: "#92400e" },
};

// ---------------------------------------------------------------------------
// RECETTES (side: "in")
// ---------------------------------------------------------------------------
export const recettes = [
  {
    id: "r-cotisations",
    label: "Cotisations sociales",
    apresLabel: "Cotisations contributives",
    family: "cotisations",
    avant: 498.7,
    apres: 470.0,
    doctrine: "Retraites §4.2 / Fiscalité §2.1",
    description:
      "Le cœur contributif public (compte notionnel à 18 %) et l'assurance chômage restent financés par cotisations. " +
      "Mais les cotisations non contributives basculent vers l'impôt général, et la capitalisation obligatoire (5 % à terme) " +
      "sort de la répartition vers des comptes individuels (hors budget public). D'où une légère baisse des cotisations publiques.",
  },
  {
    id: "r-impot-prop",
    label: "IRPP + CSG + CRDS",
    apresLabel: "Impôt proportionnel unique (+ contribution de solidarité)",
    family: "impotRevenu",
    // AVANT = somme IRPP 94.3 + CSG 156.6 + CRDS 9.3
    avant: 260.2,
    apres: 475.0,
    doctrine: "Fiscalité §4.1-4.2 / Revenu universel §18",
    description:
      "Fusion de l'IR, de la CSG et de la CRDS en un impôt proportionnel unique (cible < 30 %), assiette large sur tous les revenus, " +
      "individualisé (suppression du foyer fiscal). Il intègre la « contribution de solidarité » qui finance le revenu universel : " +
      "la hausse brute du poste correspond mécaniquement au RU reversé à tous (le coût NET pour les ménages est très inférieur).",
  },
  {
    id: "r-tva",
    label: "TVA",
    apresLabel: "TVA à taux unique 25 %",
    family: "consommation",
    avant: 208.8,
    apres: 265.0,
    doctrine: "Fiscalité §6",
    description:
      "Passage à un taux unique cible de 25 %, suppression progressive des taux réduits. La justice sociale n'est plus assurée par " +
      "des taux réduits invisibles mais par le revenu universel et le dividende carbone. Élargissement de l'assiette → rendement accru.",
  },
  {
    id: "r-lvt",
    label: "(Taxe foncière + DMTO + IFI)",
    apresLabel: "Land Value Tax (2 % du foncier nu)",
    family: "foncier",
    // AVANT = taxe foncière 44.2 + DMTO 20.2 + IFI (~1.8, dans 'autres')
    avant: 64.4,
    apres: 120.0,
    doctrine: "Fiscalité §7",
    description:
      "Création d'une taxe nationale sur la valeur du terrain nu (2 %, rendement cible ~120 Md€). Elle remplace taxe foncière, DMTO, IFI, " +
      "taxe sur les logements vacants, surtaxes résidences secondaires et taxation des plus-values immobilières. Elle taxe la rente " +
      "d'emplacement, pas la construction ni la rénovation. Report de paiement pour les propriétaires modestes.",
  },
  {
    id: "r-is",
    label: "IS net",
    apresLabel: "IS (cible 15-20 %)",
    family: "production",
    avant: 68.0,
    apres: 62.0,
    doctrine: "Fiscalité §9",
    description:
      "Maintien initial à ~25 % puis convergence vers 15-20 %. La baisse de taux est financée par la suppression des niches et " +
      "l'extinction du CIR (assiette élargie) : le rendement net reste proche, légèrement abaissé, au profit de l'investissement productif.",
  },
  {
    id: "r-production",
    label: "Impôts de production (C3S, CVAE, CFE…)",
    apresLabel: "Impôts de production résiduels",
    family: "production",
    // AVANT = impôts salaires/main d'œuvre 60.1 + autres impôts production 28.5
    avant: 88.6,
    apres: 18.0,
    doctrine: "Fiscalité §8",
    description:
      "Suppression immédiate de la C3S et de la CVAE résiduelle (taxes sur le chiffre d'affaires / la valeur ajoutée, nocives avant " +
      "même le bénéfice). La CFE bascule dans la LVT professionnelle. Ne subsiste qu'un résidu (taxe sur les salaires fortement réduite).",
  },
  {
    id: "r-carbone",
    label: "TICPE + accises énergie",
    apresLabel: "Fiscalité carbone (prix plancher 200 €/t)",
    family: "carbone",
    // AVANT = TICPE 30.5 + accises élec/gaz 11.7
    avant: 42.2,
    apres: 55.0,
    doctrine: "Fiscalité §10-11",
    description:
      "Signal-prix carbone lisible (cible 200 €/tCO₂) remplaçant la logique de normes et subventions. L'électricité bas-carbone N'EST PLUS " +
      "taxée spécifiquement (suppression de l'accise sur l'électricité). La totalité de la recette est reversée en dividende carbone " +
      "(voir côté dépenses) : effet net nul sur le solde, gain pour les ménages modestes.",
  },
  {
    id: "r-dmtg",
    label: "DMTG (successions/donations)",
    apresLabel: "Successions (receveur, abattement 100 k€)",
    family: "foncier",
    avant: 21.05,
    apres: 22.0,
    doctrine: "Fiscalité §12",
    description:
      "Fusion donations + successions, imposition chez le RECEVEUR sur l'ensemble de la vie, abattement universel de 100 000 €, puis taux " +
      "proportionnel commun. Carry-over basis pour la transmission d'entreprise productive. Rendement global proche, base simplifiée.",
  },
  {
    id: "r-accises",
    label: "Accises tabac + alcool",
    family: "consommation",
    avant: 18.7,
    apres: 18.7,
    doctrine: "—",
    description: "Accises de santé publique maintenues, hors périmètre de la réforme fiscale structurelle.",
  },
  {
    id: "r-assurances",
    label: "Taxes sur les assurances",
    family: "autresRec",
    avant: 20.6,
    apres: 20.6,
    doctrine: "—",
    description: "Maintenues en l'état dans la présente simulation.",
  },
  {
    id: "r-pharma",
    label: "Remises pharmaceutiques",
    family: "autresRec",
    avant: 11.6,
    apres: 11.6,
    doctrine: "—",
    description: "Recette de régulation du médicament, inchangée.",
  },
  {
    id: "r-autres-fisc",
    label: "Autres fiscalité (IFI, micro-taxes…)",
    apresLabel: "Autres fiscalité (après suppression niches)",
    family: "autresRec",
    avant: 56.9,
    apres: 35.0,
    doctrine: "Fiscalité §7.4 / §15 / §19.1",
    description:
      "Suppression de l'exit tax, de l'IFI (absorbé par la LVT), des plus-values immobilières spécifiques et d'un premier paquet de " +
      "micro-taxes redondantes à faible rendement. Recentrage de l'assiette.",
  },
  {
    id: "r-prod-marchande",
    label: "Recettes de production",
    family: "autresRec",
    avant: 130.9,
    apres: 134.0,
    doctrine: "—",
    description: "Ventes et production marchande des administrations. Légère croissance liée à l'effet d'activité de la réforme.",
  },
  {
    id: "r-propriete",
    label: "Revenus de la propriété",
    family: "autresRec",
    avant: 23.0,
    apres: 23.0,
    doctrine: "—",
    description: "Dividendes et revenus du patrimoine public, inchangés.",
  },
  {
    id: "r-transferts",
    label: "Autres transferts reçus",
    family: "autresRec",
    avant: 33.7,
    apres: 33.7,
    doctrine: "—",
    description: "Transferts courants reçus (UE, divers), inchangés.",
  },
];

// ---------------------------------------------------------------------------
// DÉPENSES (side: "out")
// ---------------------------------------------------------------------------
export const depenses = [
  {
    id: "e-remunerations",
    label: "Rémunération des agents publics",
    family: "fonctionnement",
    avant: 370.0,
    apres: 365.0,
    doctrine: "—",
    description:
      "Masse salariale publique. La simulation retient une quasi-stabilité (légère baisse liée à la simplification administrative : " +
      "moins de guichets, moins de gestion d'aides sous conditions).",
  },
  {
    id: "e-conso",
    label: "Consommations intermédiaires",
    family: "fonctionnement",
    avant: 163.5,
    apres: 160.0,
    doctrine: "—",
    description: "Achats courants des administrations. Légère économie de gestion.",
  },
  {
    id: "e-autres-fonc",
    label: "Autres dépenses de fonctionnement",
    family: "fonctionnement",
    avant: 14.2,
    apres: 14.0,
    doctrine: "—",
    description: "Impôts de production payés par les administrations et divers, quasi inchangés.",
  },
  {
    id: "e-retraites",
    label: "Retraites (pensions publiques)",
    apresLabel: "Retraites (comptes notionnels + garantie vieillesse)",
    family: "retraites",
    avant: 340.0,
    apres: 262.0,
    doctrine: "Retraites §6, §8, §14",
    description:
      "Réforme systémique : comptes notionnels (18 %) automatiquement équilibrés, NON-INDEXATION des pensions au-dessus de la Garantie " +
      "vieillesse nationale (850 € + 200 € isolement), âge minimal 64 ans à neutralité actuarielle, intégration d'Agirc-Arrco et montée " +
      "de la capitalisation obligatoire à 5 % (qui sort une part des pensions de la répartition publique). " +
      "Gain doctrinal sur la dépense retraite : 70-85 Md€ à 10 ans — ici −78 Md€.",
  },
  {
    id: "e-revenu-universel",
    label: "—",
    apresLabel: "Revenu universel (adulte 550 €/mois)",
    family: "universel",
    avant: 0,
    apres: 264.0,
    doctrine: "Revenu universel §4, §18",
    description:
      "NOUVEAU poste. RU adulte individualisé de 550 €/mois × ~40 M de personnes (18-64 ans) = 264 Md€ de COÛT BRUT. " +
      "Il remplace le RSA, la prime d'activité, l'essentiel des APL, certaines aides jeunes et une partie des prestations familiales. " +
      "Le coût NET est très inférieur : il est largement repris par l'impôt proportionnel et par la suppression des aides absorbées " +
      "(le travail reste toujours gagnant car le RU se cumule avec le salaire).",
  },
  {
    id: "e-dividende-carbone",
    label: "—",
    apresLabel: "Dividende carbone",
    family: "redistribution",
    avant: 0,
    apres: 55.0,
    doctrine: "Fiscalité §10.4",
    description:
      "NOUVEAU poste. La totalité de la recette carbone est reversée aux citoyens, versée avec le revenu universel. Strictement égal à la " +
      "recette carbone : effet net nul sur le solde public. Répond à l'objection sociale contre la taxe carbone.",
  },
  {
    id: "e-prestations",
    label: "Autres prestations en espèces (RSA, prime, chômage, famille, minima…)",
    apresLabel: "Autres prestations espèces (chômage contrib., compl. handicap, crédit familial)",
    family: "prestations",
    avant: 240.9,
    apres: 175.0,
    doctrine: "Revenu universel §6, §10, §14",
    description:
      "Le RSA, la prime d'activité, l'ASPA et les prestations familiales générales sont ABSORBÉS par le revenu universel et le crédit " +
      "familial. Restent à part, en complément du RU : l'assurance chômage (strictement contributive), le complément handicap (ex-AAH), " +
      "le crédit familial enfant et le bouclier transitoire pour familles monoparentales modestes. D'où −66 Md€ sur ce poste.",
  },
  {
    id: "e-nature",
    label: "Prestations sociales en nature (santé, APL…)",
    apresLabel: "Prestations en nature (socle santé universel)",
    family: "sante",
    avant: 190.1,
    apres: 178.0,
    doctrine: "Revenu universel §12 / Fiscalité §2.1",
    description:
      "Socle universel de santé financé par l'impôt, maintenu. Les APL (versées en partie en nature) sont absorbées dans le revenu " +
      "universel pour la majorité des bénéficiaires. La réforme structurelle du logement est traitée séparément.",
  },
  {
    id: "e-subventions",
    label: "Subventions",
    family: "redistribution",
    avant: 56.5,
    apres: 44.0,
    doctrine: "Fiscalité §8, §10.1",
    description:
      "Suppression des subventions contradictoires de la transition écologique (remplacées par le signal-prix carbone) et recentrage des " +
      "aides aux entreprises au profit d'une fiscalité de production plus basse.",
  },
  {
    id: "e-transferts",
    label: "Autres transferts courants",
    family: "redistribution",
    avant: 94.0,
    apres: 88.0,
    doctrine: "—",
    description: "Transferts courants divers (collectivités, organismes). Légère rationalisation.",
  },
  {
    id: "e-transferts-capital",
    label: "Transferts en capital",
    family: "redistribution",
    avant: 41.6,
    apres: 40.0,
    doctrine: "—",
    description: "Aides à l'investissement, quasi stables.",
  },
  {
    id: "e-fbcf",
    label: "Investissement (FBCF)",
    family: "investissement",
    avant: 132.2,
    apres: 132.0,
    doctrine: "—",
    description: "Formation brute de capital fixe. Protégée : l'investissement public n'est pas la cible des économies.",
  },
  {
    id: "e-autres-actifs",
    label: "Autres actifs non financiers",
    family: "investissement",
    avant: 5.5,
    apres: 5.5,
    doctrine: "—",
    description: "Acquisitions nettes d'autres actifs, inchangées.",
  },
  {
    id: "e-interets",
    label: "Intérêts de la dette",
    family: "charge",
    avant: 65.7,
    apres: 58.0,
    doctrine: "Retraites §14.3",
    description:
      "À terme, la réduction du besoin de financement (meilleur solde) allège la charge d'intérêts. Effet de second tour pris en compte " +
      "de façon prudente (−7,7 Md€).",
  },
];

// Nœud central -------------------------------------------------------------
export const central = {
  id: "apu",
  label: "Budget des administrations publiques",
};
