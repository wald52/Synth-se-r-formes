# Simulation budgétaire des doctrines — diagramme de Sankey avant / après

Application web (Vite + D3 / d3-sankey) qui simule l'effet sur le budget des
**administrations publiques françaises (S13)** des trois notes de doctrine
fournies :

1. **Doctrine retraites** — réforme systémique type suédois (comptes notionnels,
   garantie vieillesse, capitalisation obligatoire, nationalisation Agirc-Arrco) ;
2. **Revenu universel et refonte des prestations sociales** ;
3. **Chapitre fiscalité** — remise à plat complète du système fiscal.

Le diagramme de Sankey, inspiré de
[`wald52/Sankey-finances-publique`](https://github.com/wald52/Sankey-finances-publique),
montre les **recettes → budget → dépenses**, avec un commutateur
**Avant / Après** :

- **Avant** = système actuel (ordres de grandeur INSEE 2024-2025) ;
- **Après** = régime **cible** des trois doctrines (horizon ~10-15 ans).

Chaque poste est cliquable : un panneau latéral affiche la valeur avant, la
valeur après, la variation, **la référence doctrinale** et l'explication du
changement.

## Lancer le projet

```bash
npm install
npm run dev      # serveur de développement
npm run build    # build de production dans dist/
npm run preview  # prévisualiser le build
```

## Résultat de synthèse

| Indicateur (Md€)   | Avant     | Après     | Variation     |
| ------------------ | --------- | --------- | ------------- |
| Recettes           | 1 547     | 1 764     | +216          |
| Dépenses           | 1 714     | 1 840     | +126          |
| **Solde public**   | **−167**  | **−77**   | **+90**       |

> **Lecture importante.** Les masses brutes **gonflent** des deux côtés
> (~+200 Md€) parce que le **revenu universel** apparaît en dépense pour son
> **coût brut** (264 Md€) et que l'**impôt proportionnel** apparaît en recette
> pour le montant qui le finance (contribution de solidarité incluse). C'est
> exactement la mise en garde des doctrines : *« le coût brut ne doit jamais
> être confondu avec le coût net »*. Ce qui compte est le **solde**, qui
> s'améliore d'environ **+90 Md€** au régime cible.

---

## Méthodologie

- Périmètre : administrations publiques (S13), comptabilité nationale.
- Base **Avant** : ordres de grandeur INSEE 2024-2025 (mêmes masses que le
  projet de référence `Sankey-finances-publique`).
- Base **Après** : application des paramètres **explicites** des doctrines
  (taux, montants, suppressions) et, lorsque la doctrine ne donne qu'une
  orientation, d'un ordre de grandeur prudent au **régime stabilisé**.
- Les montants sont **programmatiques**, pas une micro-simulation actuarielle.
  Le bouclage est recherché au niveau du **système global**, comme le demandent
  les notes, et non poste par poste.

Le déficit apparaît comme un flux entrant (« Besoin de financement ») pour
équilibrer visuellement le diagramme.

---

## Détail des changements (côté RECETTES)

### Impôt proportionnel unique — `IRPP + CSG + CRDS` → 260 ⟶ 475 Md€
*Fiscalité §4.1-4.2 ; Revenu universel §18.*
Fusion de l'IR, de la CSG et de la CRDS en un **impôt proportionnel unique**
(cible < 30 %), assiette large sur tous les revenus (salaires, capital,
pensions, foncier net…), **individualisé** (suppression du foyer fiscal). Il
intègre la **contribution de solidarité** qui finance le revenu universel : la
hausse brute correspond mécaniquement au RU reversé à tous. La progressivité
n'est plus dans le barème mais dans le couple **impôt proportionnel + RU**.

### TVA → 209 ⟶ 265 Md€
*Fiscalité §6.* Convergence vers un **taux unique de 25 %**, extinction des taux
réduits. La justice sociale passe par le RU et le dividende carbone, non par des
taux réduits invisibles. Élargissement d'assiette ⇒ rendement accru.

### Land Value Tax — `Taxe foncière + DMTO + IFI` → 64 ⟶ 120 Md€
*Fiscalité §7.* Création d'une **taxe nationale sur la valeur du foncier nu**
(2 %, rendement cible ~120 Md€). Elle **remplace** taxe foncière, DMTO, IFI,
taxes sur logements vacants, surtaxes résidences secondaires et plus-values
immobilières. Elle taxe la **rente d'emplacement**, pas la construction. Report
de paiement prévu pour les propriétaires modestes.

### IS net → 68 ⟶ 62 Md€
*Fiscalité §9.* Convergence du taux vers **15-20 %**, financée par la suppression
des niches et **l'extinction du CIR** (assiette élargie). Rendement net proche,
légèrement abaissé au profit de l'investissement productif.

### Impôts de production — `C3S, CVAE, CFE…` → 89 ⟶ 18 Md€
*Fiscalité §8.* **Suppression immédiate** de la C3S et de la CVAE résiduelle.
La CFE bascule dans la LVT professionnelle. Ne subsiste qu'un résidu de taxe sur
les salaires.

### Fiscalité carbone — `TICPE + accises énergie` → 42 ⟶ 55 Md€
*Fiscalité §10-11.* Signal-prix carbone lisible (**cible 200 €/tCO₂**).
L'électricité bas-carbone **n'est plus taxée** spécifiquement (fin de l'accise
sur l'électricité). La recette est intégralement reversée en **dividende
carbone** (côté dépenses) : **effet net nul** sur le solde.

### Successions / donations — `DMTG` → 21 ⟶ 22 Md€
*Fiscalité §12.* Fusion donations + successions, imposition **chez le receveur**
sur toute la vie, **abattement universel de 100 000 €**, puis taux proportionnel
commun. Carry-over basis pour la transmission d'entreprise productive.

### Cotisations sociales → 499 ⟶ 470 Md€
*Retraites §4.2 ; Fiscalité §2.1.* Le cœur contributif (compte notionnel à 18 %)
et l'assurance chômage restent financés par cotisations. Mais les cotisations
**non contributives** basculent vers l'impôt, et la **capitalisation obligatoire
(5 % à terme)** sort de la répartition vers des comptes individuels **hors budget
public**. D'où une légère baisse des cotisations publiques.

### Autres fiscalité → 57 ⟶ 35 Md€
*Fiscalité §7.4, §15, §19.1.* Suppression de l'**exit tax**, de l'IFI (absorbé
par la LVT), de la fiscalité spécifique des plus-values immobilières et d'un
premier paquet de **micro-taxes** redondantes.

### Postes inchangés
Accises tabac/alcool, taxes sur les assurances, remises pharmaceutiques, recettes
de production (+ léger effet d'activité), revenus de la propriété, autres
transferts reçus.

---

## Détail des changements (côté DÉPENSES)

### Retraites → 340 ⟶ 262 Md€ (−78)
*Retraites §6, §8, §14.* Réforme systémique :
- **Comptes notionnels** (18 %) automatiquement équilibrés ;
- **Non-indexation** des pensions au-dessus de la **Garantie vieillesse
  nationale** (850 € + 200 € d'allocation isolement) — principal levier
  d'économies ;
- Âge minimal **64 ans** à neutralité actuarielle ;
- Intégration d'**Agirc-Arrco** et montée de la **capitalisation obligatoire à
  5 %** (qui sort une part des pensions de la répartition publique).

Gain doctrinal sur la dépense retraite : 70-85 Md€ à 10 ans (ici −78 Md€).

### Revenu universel (adulte) → 0 ⟶ 264 Md€ (**nouveau**)
*Revenu universel §4, §18.* RU adulte **individualisé** de **550 €/mois ×
~40 M de personnes (18-64 ans)** = 264 Md€ de **coût brut**. Il remplace le RSA,
la prime d'activité, l'essentiel des APL, certaines aides jeunes et une partie
des prestations familiales. Le **coût net** est très inférieur (repris par
l'impôt proportionnel et par la suppression des aides absorbées). Le travail
reste **toujours gagnant** : le RU se cumule avec le salaire.

### Dividende carbone → 0 ⟶ 55 Md€ (**nouveau**)
*Fiscalité §10.4.* Reversement intégral de la recette carbone aux citoyens,
strictement égal à celle-ci : **effet net nul** sur le solde.

### Autres prestations en espèces → 241 ⟶ 175 Md€ (−66)
*Revenu universel §6, §10, §14.* Le RSA, la prime d'activité, l'ASPA et les
prestations familiales générales sont **absorbés** par le RU et le crédit
familial. Restent **à part, en complément du RU** : assurance chômage
(strictement contributive), complément handicap (ex-AAH), crédit familial enfant,
**bouclier transitoire** pour familles monoparentales modestes.

### Prestations en nature → 190 ⟶ 178 Md€ (−12)
*Revenu universel §12 ; Fiscalité §2.1.* Socle universel de santé maintenu
(financé par l'impôt). Les **APL** (versées en partie en nature) sont absorbées
dans le RU pour la majorité des bénéficiaires.

### Subventions → 57 ⟶ 44 Md€ (−12)
*Fiscalité §8, §10.1.* Suppression des subventions contradictoires de la
transition (remplacées par le signal-prix carbone) et recentrage des aides aux
entreprises au profit d'une fiscalité de production plus basse.

### Intérêts de la dette → 66 ⟶ 58 Md€ (−8)
*Retraites §14.3.* La réduction du besoin de financement allège, à terme, la
charge d'intérêts (effet de second tour, pris prudemment).

### Postes quasi stables
Rémunération des agents (−5, simplification administrative), consommations
intermédiaires, autres transferts courants et en capital, **investissement
(FBCF) protégé**, autres actifs.

---

## Limites assumées

- Régime **cible** : la trajectoire de transition (5 ans + bouclier 2-3 ans pour
  le RU ; montée progressive de la LVT, de la TVA et de la capitalisation) n'est
  pas représentée — seul l'état stabilisé l'est.
- La **capitalisation obligatoire (5 %)** et le 4ᵉ étage **CRUC / 401(k)**
  alimentent le patrimoine des ménages **hors périmètre S13** ; ils sont
  mentionnés mais ne figurent pas dans les masses publiques.
- Les montants sont des **ordres de grandeur programmatiques**. Plusieurs postes
  reposent sur des hypothèses prudentes là où les doctrines ne donnent qu'une
  orientation (« à calibrer », « rendement à évaluer »).

## Structure du code

```
index.html              point d'entrée
src/main.js             rendu Sankey (d3-sankey), KPIs, panneau de détail, bascule
src/styles.css          styles
src/data/scenario.js    DONNÉES : chaque poste avant/après + référence doctrinale
```

Pour ajuster une hypothèse, modifier les champs `avant` / `apres` (et la
`description`) d'un poste dans `src/data/scenario.js` : le diagramme, les KPIs et
le panneau de détail se recalculent automatiquement.
