(function () {
  const finale = document.getElementById("finale");
  const glowField = document.getElementById("finaleGlowField");
  if (!finale) return;

  let activated = false;

  function softenMusic() {
    const audio = document.querySelector("audio[data-garden-music]");
    if (!audio) return;

    const targetVolume = Math.max(0.12, (audio.dataset.baseVolume ? Number(audio.dataset.baseVolume) : audio.volume) * 0.45);
    const startVolume = audio.volume;
    const steps = 24;
    let step = 0;

    const fade = window.setInterval(() => {
      step += 1;
      audio.volume = startVolume + (targetVolume - startVolume) * (step / steps);
      if (step >= steps) window.clearInterval(fade);
    }, 80);
  }

  function seedGoldenParticles() {
    if (!glowField || glowField.childElementCount) return;

    const frag = document.createDocumentFragment();
    for (let i = 0; i < 28; i += 1) {
      const particle = document.createElement("span");
      const size = 3 + Math.random() * 5;
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.top = `${Math.random() * 100}%`;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.setProperty("--duration", `${5 + Math.random() * 7}s`);
      particle.style.setProperty("--delay", `${Math.random() * 2.4}s`);
      particle.style.setProperty("--particle-alpha", `${(0.42 + Math.random() * 0.38).toFixed(2)}`);
      frag.appendChild(particle);
    }
    glowField.appendChild(frag);
    window.requestAnimationFrame(() => {
      glowField.classList.add("is-visible");
    });
  }

  function activateFinale() {
    if (activated) return;
    activated = true;

    document.body.classList.add("finale-active");
    finale.classList.add("is-active");
    seedGoldenParticles();
    softenMusic();

    document.dispatchEvent(new CustomEvent("garden:finale", { detail: { active: true } }));
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) activateFinale();
      });
    },
    { threshold: 0.32, rootMargin: "0px 0px -8% 0px" }
  );

  observer.observe(finale);
})();
