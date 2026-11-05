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
