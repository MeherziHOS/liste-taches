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

  bouton.addEventListener("click", () => {
    supprimerTache(tache.id);
  });

  li.append(texte, bouton);
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

// Mettre à jour le compteur
function mettreAJourCompteur() {
  const terminees = taches.filter((tache) => tache.terminee).length;
  const enCours = taches.length - terminees;

  compteur.textContent = `${terminees} terminée(s), ${enCours} en cours`;
}

// Lancer l'affichage
afficherTaches();
