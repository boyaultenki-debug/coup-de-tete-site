# Coiffeur Coup de Tête — Site vitrine

Site statique (HTML / CSS / JavaScript natif, **aucune dépendance au runtime**).
Rapide, responsive, optimisé mobile. Transitions de pages via la View Transitions API.

## Mise en ligne
Héberger le contenu du dossier tel quel sur n'importe quel hébergement statique
(OVH, Netlify, Vercel, GitHub Pages, o2switch…). La racine du site est ce dossier.

Avant publication, remplacer le domaine `https://www.coup-de-tete.fr/` dans les balises
`canonical`, `og:url` et `sitemap.xml` si le domaine final est différent.

## Pages
- `index.html` — Accueil
- `prestations.html` — Prestations (sans prix, sur demande)
- `realisations.html` — Galerie (16 photos, lightbox)
- `salon.html` — Le salon + la gérante
- `contact.html` — Contact, horaires, carte
- `mentions-legales.html` — Mentions légales

## État des informations

✅ **Validé / intégré**
- Horaires confirmés (Lun fermé · Mar–Jeu 9h–18h · Ven 9h–17h30 · Sam 9h–17h · Dim fermé)
- Avis Google (note 4,8/5) confirmés par le client
- Gérante : Nadia Taïralil (reprise du salon en 2025) — texte intégré
- Produits écoresponsables sans ammoniaque / paraben / résorcine
- Photos fournies par le salon (droits OK)
- Prestations affichées **sans prix** (choix validé : « tarifs sur demande »)
- Mentions légales : exploitant, forme juridique, responsable de publication renseignés

- Photo de Nadia intégrée (page « Le salon »). Source basse définition (229×255) : fournir
  une version plus haute résolution donnera un rendu encore plus net.

⚠️ **Reste à fournir par le client**
1. **Mentions légales** — SIRET, e-mail de contact, **hébergeur** (dépend de l'hébergement
   choisi) et **médiateur de la consommation** (champs `TODO` dans `mentions-legales.html`).
   Le client a indiqué ne pas encore disposer de ces informations.
2. **Réservation** — par téléphone uniquement pour l'instant (`tel:04 76 47 21 74`).
   Si une plateforme en ligne est mise en place plus tard, remplacer les liens `tel:`
   des boutons « Réserver ».

## Ré-optimiser des images (optionnel)
Les scripts de build sont dans `_tools/` (nécessitent `npm install sharp`).
`node _tools/convert.js` régénère les WebP de la galerie.
