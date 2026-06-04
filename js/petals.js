(function () {
  const layer = document.getElementById("petalLayer");
  if (!layer) return;

  const petals = [];
  const isMobile =
    window.matchMedia("(hover: none) and (pointer: coarse)").matches ||
    window.matchMedia("(max-width: 920px)").matches;
  const count = isMobile ? 24 : 72;

  for (let i = 0; i < count; i += 1) {
    const petal = document.createElement("span");
    petal.className = "petal";
    petals.push(petal);
    layer.appendChild(petal);
  }

  function getPetalSource() {
    const sources = [...document.querySelectorAll("[data-petal-source]")].filter((source) => {
      const rect = source.getBoundingClientRect();
      return rect.width > 8 && rect.height > 8;
    });
    if (!sources.length) {
      return {
        x: Math.random() * window.innerWidth,
        y: -window.innerHeight * 0.08
      };
    }

    const source = sources[Math.floor(Math.random() * sources.length)];
    const rect = source.getBoundingClientRect();
    return {
      x: rect.left + rect.width * (0.18 + Math.random() * 0.64),
      y: Math.max(-40, rect.top + rect.height * (0.05 + Math.random() * 0.35))
    };
  }

  function seedPetal(petal, density) {
    const source = getPetalSource();
    const size = 7 + Math.random() * 11 + density * 5;
    petal.style.setProperty("--size", `${size.toFixed(1)}px`);
    petal.style.setProperty("--start-x", `${source.x.toFixed(1)}px`);
    petal.style.setProperty("--start-y", `${source.y.toFixed(1)}px`);
    petal.style.setProperty("--drift", `${(Math.random() * 620 - 310).toFixed(1)}px`);
    petal.style.setProperty("--spin", `${(Math.random() > 0.5 ? 1 : -1) * (120 + Math.random() * 380)}deg`);
    petal.style.setProperty("--duration", `${(12 - density * 2 + Math.random() * 8).toFixed(2)}s`);
    petal.style.setProperty("--delay", `${(-Math.random() * 16).toFixed(2)}s`);
    petal.style.setProperty("--alpha", `${(0.42 + density * 0.36 + Math.random() * 0.14).toFixed(2)}`);
    petal.style.setProperty("--sparkle", `${Math.random() > 0.78 ? 0.45 : 0.06}`);
  }

  function reseedAll(progress) {
    const density = Math.min(1, 0.24 + progress * 0.76);
    petals.forEach((petal, index) => {
      const minVisible = isMobile ? 10 : 20;
    if (index / petals.length <= density || index < minVisible) {
        petal.style.display = "block";
        seedPetal(petal, density);
      } else {
        petal.style.display = "none";
      }
    });
  }

  reseedAll(0);
  document.addEventListener("garden:scroll", (event) => {
    const progress = event.detail.progress;
    if (Math.abs(progress - (reseedAll.last || 0)) > 0.18) {
      reseedAll.last = progress;
      reseedAll(progress);
    }
  });

  document.addEventListener("garden:finale", () => {
    reseedAll.last = 1;
    petals.forEach((petal) => {
      petal.style.display = "block";
      seedPetal(petal, 1);
      petal.style.setProperty("--alpha", `${(0.58 + Math.random() * 0.32).toFixed(2)}`);
    });
  });
})();
