const CLE_STOCKAGE = "liste-taches";

const tachesDeDepart = [
  {
    id: 1,
    texte: "Faire les courses",
    terminee: false,
    date: Date.now() - 3000,
  },
  {
    id: 2,
    texte: "Réviser JavaScript",
    terminee: true,
    date: Date.now() - 2000,
  },
  {
    id: 3,
    texte: "Ranger le bureau",
    terminee: false,
    date: Date.now() - 1000,
  },
];

// Charger les tâches enregistrées
function chargerTaches() {
  const sauvegarde = localStorage.getItem(CLE_STOCKAGE);

  if (sauvegarde !== null) {
    return JSON.parse(sauvegarde);
  }

  return tachesDeDepart;
}

// Sauvegarder les tâches
function sauvegarderTaches() {
  localStorage.setItem(CLE_STOCKAGE, JSON.stringify(taches));
}

const taches = chargerTaches();

const liste = document.querySelector(".liste-taches");
const compteur = document.querySelector(".compteur");

let filtreActuel = "toutes";

const recherche = document.getElementById("recherche");
const tri = document.getElementById("tri");
const filtres = document.querySelector(".filtres");
const statsTexte = document.getElementById("stats-texte");
const barreRemplissage = document.querySelector(".barre-remplissage");

// Créer l'élément HTML d'une tâche
function creerElementTache(tache) {
  const li = document.createElement("li");
  li.classList.add("tache");
  li.dataset.id = tache.id;

  if (tache.terminee) {
    li.classList.add("done");
  }

  const texte = document.createElement("span");
  texte.classList.add("tache-texte");
  texte.textContent = tache.texte;

  const bouton = document.createElement("button");
  bouton.classList.add("btn-supprimer");
  bouton.textContent = "Supprimer";
  bouton.setAttribute("aria-label", `Supprimer : ${tache.texte}`);

  const btnTerminer = document.createElement("button");
  btnTerminer.classList.add("btn-terminer");

  btnTerminer.textContent = tache.terminee ? "Réactiver" : "Terminer";

  btnTerminer.setAttribute(
    "aria-label",
    `${tache.terminee ? "Réactiver" : "Terminer"} : ${tache.texte}`,
  );

  li.append(texte, btnTerminer, bouton);
  return li;
}

// Filtrer, rechercher et trier les tâches
function tachesAAfficher() {
  const texteRecherche = recherche.value.trim().toLowerCase();

  return taches
    .filter((tache) => {
      if (filtreActuel === "en-cours") {
        return !tache.terminee;
      }

      if (filtreActuel === "terminees") {
        return tache.terminee;
      }

      return true;
    })
    .filter((tache) => tache.texte.toLowerCase().includes(texteRecherche))
    .slice()
    .sort((a, b) => {
      if (tri.value === "nom") {
        return a.texte.localeCompare(b.texte, "fr");
      }

      return a.date - b.date;
    });
}

// Mettre à jour les statistiques
function mettreAJourStatistiques() {
  const total = taches.length;
  const terminees = taches.filter((tache) => tache.terminee).length;

  const pourcentage = total === 0 ? 0 : Math.round((terminees / total) * 100);

  statsTexte.textContent = `${terminees} / ${total} terminée(s) - ${pourcentage} %`;

  barreRemplissage.style.width = `${pourcentage}%`;
}

// Afficher les tâches selon les filtres
function afficherTaches() {
  liste.replaceChildren();

  const resultats = tachesAAfficher();

  if (resultats.length === 0) {
    const li = document.createElement("li");
    li.classList.add("liste-vide");

    li.textContent =
      taches.length === 0
        ? "Aucune tâche à afficher."
        : "Aucune tâche ne correspond à votre recherche.";

    liste.append(li);
  } else {
    liste.append(...resultats.map(creerElementTache));
  }

  mettreAJourCompteur();
  mettreAJourStatistiques();
}

// Supprimer une tâche
function supprimerTache(id) {
  const index = taches.findIndex((tache) => tache.id === id);

  if (index !== -1) {
    taches.splice(index, 1);
    sauvegarderTaches();
    afficherTaches();
  }
}

function basculerTache(id) {
  const tache = taches.find((tache) => tache.id === id);

  if (tache) {
    tache.terminee = !tache.terminee;
    sauvegarderTaches();
    afficherTaches();
  }
}

// Mettre à jour le compteur
function mettreAJourCompteur() {
  const terminees = taches.filter((tache) => tache.terminee).length;
  const enCours = taches.length - terminees;

  compteur.textContent = `${terminees} terminée(s), ${enCours} en cours`;
}

// Lancer l'affichage
afficherTaches();

// Sélectionner le formulaire et ses éléments
const formAjout = document.getElementById("form-ajout");
const champTache = document.getElementById("nouvelle-tache");
const erreurTache = document.getElementById("erreur-tache");

// Ajouter une tâche déjà validée
function ajouterTache(texte) {
  const maintenant = Date.now();

  const nouvelleTache = {
    id: maintenant,
    texte: texte,
    terminee: false,
    date: maintenant,
  };

  taches.push(nouvelleTache);
  sauvegarderTaches();
  afficherTaches();
}

// Afficher une erreur
function afficherErreur(message) {
  erreurTache.textContent = message;
  champTache.classList.add("invalide");
  champTache.setAttribute("aria-invalid", "true");
  champTache.focus();
}

// Effacer une erreur
function effacerErreur() {
  erreurTache.textContent = "";
  champTache.classList.remove("invalide");
  champTache.removeAttribute("aria-invalid");
}

// Soumission du formulaire
formAjout.addEventListener("submit", (event) => {
  event.preventDefault();

  const texte = champTache.value.trim();

  if (texte === "") {
    afficherErreur("Veuillez saisir une tâche.");
    return;
  }

  if (texte.length < 3) {
    afficherErreur("La tâche doit contenir au moins 3 caractères.");
    return;
  }

  ajouterTache(texte);
  effacerErreur();
  champTache.value = "";
  champTache.focus();
});

// Effacer l'erreur dès que la saisie est corrigée
champTache.addEventListener("input", () => {
  const texte = champTache.value.trim();

  if (texte.length >= 3) {
    effacerErreur();
  }
});

liste.addEventListener("click", (event) => {
  const bouton = event.target.closest("button");

  if (!bouton) {
    return;
  }

  const li = bouton.closest(".tache");

  if (!li) {
    return;
  }

  const id = Number(li.dataset.id);

  if (bouton.classList.contains("btn-supprimer")) {
    supprimerTache(id);
  }

  if (bouton.classList.contains("btn-terminer")) {
    basculerTache(id);
  }
});

// Gérer les boutons de filtrage
filtres.addEventListener("click", (event) => {
  const bouton = event.target.closest(".btn-filtre");

  if (!bouton) {
    return;
  }

  filtreActuel = bouton.dataset.filtre;

  filtres.querySelectorAll(".btn-filtre").forEach((btn) => {
    const actif = btn === bouton;

    btn.classList.toggle("actif", actif);
    btn.setAttribute("aria-pressed", String(actif));
  });

  afficherTaches();
});

// Recherche en temps réel
recherche.addEventListener("input", afficherTaches);

// Tri des tâches
tri.addEventListener("change", afficherTaches);
