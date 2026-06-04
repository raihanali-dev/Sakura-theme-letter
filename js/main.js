(function () {
  const pollen = document.getElementById("pollenField");
  if (pollen) {
    const frag = document.createDocumentFragment();
    for (let i = 0; i < 36; i += 1) {
      const mote = document.createElement("span");
      mote.style.left = `${Math.random() * 100}%`;
      mote.style.top = `${Math.random() * 100}%`;
      mote.style.setProperty("--duration", `${4 + Math.random() * 7}s`);
      mote.style.animationDelay = `${-Math.random() * 8}s`;
      frag.appendChild(mote);
    }
    pollen.appendChild(frag);
  }

  const enterButton = document.querySelector(".enter-button");
  const lettersSection = document.getElementById("letters");
  const gatedSections = document.querySelectorAll(".garden-gate");

  function unlockGarden() {
    document.body.classList.add("garden-entered");
    gatedSections.forEach((section) => {
      section.setAttribute("aria-hidden", "false");
    });
  }

  if (enterButton && lettersSection) {
    const enterGarden = () => {
      unlockGarden();
      window.requestAnimationFrame(() => {
        lettersSection.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    };

    enterButton.addEventListener("click", (event) => {
      event.preventDefault();
      enterGarden();
    });

    if (window.location.hash === "#letters" || window.location.hash === "#finale") {
      window.requestAnimationFrame(() => {
        unlockGarden();
        const target = document.querySelector(window.location.hash) || lettersSection;
        target.scrollIntoView({ block: "start" });
      });
    }
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      entry.target.classList.toggle("is-visible", entry.isIntersecting);
    });
  }, { threshold: 0.22 });

  document.querySelectorAll(".story-panel").forEach((section) => observer.observe(section));
})();
