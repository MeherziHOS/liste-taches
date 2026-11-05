const titre = document.querySelector("h1");
titre.textContent = "Mes tâches du jour";

const taches = document.querySelectorAll(".tache");
console.log("Nombre de tâches : ", taches.length);

const compteur = document.querySelector(".compteur");
compteur.textContent = `${taches.length} tâches en cours`;

taches.forEach((tache) => {
  tache.textContent = "📌" + tache.textContent;
  console.log("tache : ", tache.textContent);
});

// Marquer la première tâche comme terminée
taches[0].classList.add("done");
taches[0].dataset.status = "done";

// Compter les tâches selon leur statut
let terminees = 0;
let enCours = 0;

taches.forEach((tache) => {
  if (tache.dataset.status === "done") {
    terminees++;
  } else if (tache.dataset.status === "active") {
    enCours++;
  }
});

// Mettre à jour le compteur
compteur.textContent = `${terminees} terminée(s), ${enCours} en cours`;
