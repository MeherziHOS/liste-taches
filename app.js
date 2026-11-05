const taches = [
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

const liste = document.querySelector(".liste-taches");
const compteur = document.querySelector(".compteur");

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

// Afficher toutes les tâches
function afficherTaches() {
  liste.replaceChildren();

  taches.forEach((tache) => {
    liste.append(creerElementTache(tache));
  });

  mettreAJourCompteur();
}

// Supprimer une tâche
function supprimerTache(id) {
  const index = taches.findIndex((tache) => tache.id === id);

  if (index !== -1) {
    taches.splice(index, 1);
    afficherTaches();
  }
}

function basculerTache(id) {
  const tache = taches.find((tache) => tache.id === id);

  if (tache) {
    tache.terminee = !tache.terminee;
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

// Sélectionner les éléments de la zone d'ajout
const btnNouvelleTache = document.getElementById("btn-nouvelle-tache");
const formulaireAjout = document.getElementById("formulaire-ajout");
const champNouvelleTache = document.getElementById("champ-nouvelle-tache");
const btnAjouter = document.getElementById("btn-ajouter");

// Ajouter une nouvelle tâche
function ajouterTache() {
  const texte = champNouvelleTache.value.trim();

  if (texte === "") {
    return;
  }

  const maintenant = Date.now();

  const nouvelleTache = {
    id: maintenant,
    texte: texte,
    terminee: false,
    date: maintenant,
  };

  taches.push(nouvelleTache);
  afficherTaches();

  champNouvelleTache.value = "";
  champNouvelleTache.focus();
}

// Afficher ou cacher le formulaire
btnNouvelleTache.addEventListener("click", () => {
  formulaireAjout.hidden = !formulaireAjout.hidden;

  const ouvert = !formulaireAjout.hidden;
  btnNouvelleTache.setAttribute("aria-expanded", String(ouvert));

  if (ouvert) {
    champNouvelleTache.focus();
  }
});

// Ajouter au clic
btnAjouter.addEventListener("click", ajouterTache);

// Ajouter avec la touche Entrée
champNouvelleTache.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    ajouterTache();
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
