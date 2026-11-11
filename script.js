
const welcome = document.getElementById("welcome");
const greeting = document.getElementById("greeting");

const form = document.getElementById("nameForm");

const recipientName = document.getElementById("recipientName");
const yearDisplay = document.getElementById("yearDisplay");
const wishMessage = document.getElementById("wishMessage");

const shareCustom = document.getElementById("shareCustom");
const shareGeneral = document.getElementById("shareGeneral");
const copyCustom = document.getElementById("copyCustom");
const restart = document.getElementById("restart");

const newYear = new Date().getFullYear() + 1;
yearDisplay.textContent = newYear;

// Banque de messages de vœux (un {prenom} y est injecté dynamiquement)
const wishMessages = [
  (prenom, annee) =>
    `Que cette nouvelle année t'apporte, ${prenom}, le bonheur, la santé, la réussite, la paix et de merveilleuses opportunités. Que chacun de tes rêves trouve son chemin vers la réalisation.`,

  (prenom, annee) =>
    `${prenom}, que ${annee} t'offre de belles surprises, des projets qui aboutissent et des rencontres qui comptent. Garde cette lumière qui te caractérise.`,

  (prenom, annee) =>
    `Une nouvelle page s'ouvre, ${prenom} ! Puisse ${annee} être remplie de rires, de succès mérités et de moments précieux avec ceux que tu aimes.`,

  (prenom, annee) =>
    `${prenom}, je te souhaite une année ${annee} pleine d'énergie positive, de belles opportunités et de petits bonheurs qui rendent la vie douce.`,

  (prenom, annee) =>
    `Que ${annee} t'apporte la force de réaliser tes ambitions, ${prenom}, et la sagesse d'apprécier chaque étape du chemin.`,

  (prenom, annee) =>
    `${prenom}, puisse cette nouvelle année être synonyme de croissance, de sérénité et de belles réussites, autant personnelles que professionnelles.`,

  (prenom, annee) =>
    `À toi, ${prenom}, je souhaite une année ${annee} lumineuse, pleine de gratitude, de santé et de projets qui te ressemblent.`,

  (prenom, annee) =>
    `${prenom}, que chaque mois de ${annee} t'apporte son lot de belles surprises et que tous tes efforts soient récompensés comme il se doit.`
];

// Choisit un message au hasard dans la banque
function getRandomWish(firstName, year) {
  const index = Math.floor(Math.random() * wishMessages.length);
  return wishMessages[index](firstName, year);
}

// Adresse générale du site
function getGeneralLink() {
  return window.location.origin + window.location.pathname;
}

// Génération d'un lien personnalisé
function createCustomLink(firstName, lastName) {
  const url = new URL(getGeneralLink());

  url.searchParams.set("prenom", firstName);
  url.searchParams.set("nom", lastName);

  return url.toString();
}

// Afficher les vœux
function showGreeting(firstName, lastName) {
  recipientName.textContent = firstName + " " + lastName;
  wishMessage.textContent = getRandomWish(firstName, newYear);

  welcome.classList.add("hidden");
  greeting.classList.remove("hidden");

  launchConfetti();
}

// Animation des confettis
function launchConfetti() {
  const container = document.getElementById("confetti-container");

  const colors = [
    "#ffd700",
    "#ff4d6d",
    "#ffffff",
    "#50fa7b",
    "#00d4ff"
  ];

  for (let i = 0; i < 70; i++) {
    const piece = document.createElement("div");

    piece.className = "confetti";

    piece.style.left = Math.random() * 100 + "vw";
    piece.style.backgroundColor =
      colors[Math.floor(Math.random() * colors.length)];

    piece.style.animationDelay = Math.random() * 2 + "s";

    container.appendChild(piece);

    setTimeout(() => {
      piece.remove();
    }, 6500);
  }
}

// Formulaire du visiteur
form.addEventListener("submit", function(event) {
  event.preventDefault();

  const firstName = document
    .getElementById("prenom").value.trim();

  const lastName = document
    .getElementById("nom").value.trim();

  if (!firstName || !lastName) {
    alert("Veuillez remplir votre nom et prénom.");
    return;
  }

  showGreeting(firstName, lastName);
});

// Partage du lien
async function shareLink(url, message) {
  const fullMessage = message + "\n" + url;

  if (navigator.share) {
    try {
      await navigator.share({
        title: "Une surprise pour toi !",
        text: message,
        url: url
      });
      return;
    } catch (error) {
      if (error.name === "AbortError") return;
    }
  }

  const whatsappURL =
    "https://wa.me/?text=" + encodeURIComponent(fullMessage);

  window.open(whatsappURL, "_blank");
}

// Récupérer le nom affiché
function getRecipientData() {
  const names = recipientName.textContent.trim().split(" ");

  return {
    firstName: names[0],
    lastName: names.slice(1).join(" ")
  };
}

// Partager un lien personnalisé
shareCustom.addEventListener("click", function() {
  const person = getRecipientData();

  const link = createCustomLink(
    person.firstName,
    person.lastName
  );

  shareLink(
    link,
    "Une belle surprise t'attend ! Découvre tes vœux personnalisés pour " + newYear + "."
  );
});

// Partager le lien général
shareGeneral.addEventListener("click", function() {
  shareLink(
    getGeneralLink(),
    "Viens découvrir tes vœux personnalisés pour " + newYear + " !"
  );
});

// Copier le lien personnalisé
copyCustom.addEventListener("click", async function() {
  const person = getRecipientData();

  const link = createCustomLink(
    person.firstName,
    person.lastName
  );

  try {
    await navigator.clipboard.writeText(link);
    alert("Lien personnalisé copié !");
  } catch (error) {
    prompt("Copie ce lien :", link);
  }
});

// Recommencer
restart.addEventListener("click", function() {
  greeting.classList.add("hidden");
  welcome.classList.remove("hidden");
  form.reset();
});

// Vérifier si le visiteur arrive avec un lien personnalisé
const params = new URLSearchParams(window.location.search);

const firstName = params.get("prenom");
const lastName = params.get("nom");

if (firstName && lastName) {
  showGreeting(firstName.trim(), lastName.trim());
}
