(function () {
  if (document.getElementById("realisticSakuraTree")) return;

  const blossomLayer = document.getElementById("paintedBlossoms");
  const highlightLayer = document.getElementById("paintedHighlights");
  if (!blossomLayer) return;

  const clusters = [
    [27, 27, 13, 9], [46, 16, 14, 9], [69, 21, 15, 10],
    [17, 46, 13, 8], [79, 45, 14, 9], [48, 43, 20, 11],
    [31, 61, 10, 7], [68, 62, 11, 7]
  ];
  const total = 190;
  const frag = document.createDocumentFragment();
  const highlightFrag = document.createDocumentFragment();

  for (let i = 0; i < total; i += 1) {
    const cluster = clusters[i % clusters.length];
    const angle = Math.random() * Math.PI * 2;
    const radius = Math.sqrt(Math.random());
    const x = cluster[0] + Math.cos(angle) * cluster[2] * radius;
    const y = cluster[1] + Math.sin(angle) * cluster[3] * radius;
    const size = 11 + Math.random() * 18;
    const flower = document.createElement("span");
    flower.className = "painted-blossom";
    flower.style.left = `${x.toFixed(2)}%`;
    flower.style.top = `${y.toFixed(2)}%`;
    flower.style.setProperty("--s", `${size.toFixed(1)}px`);
    flower.style.setProperty("--r", `${Math.random() * 360}deg`);
    flower.style.setProperty("--float-time", `${4 + Math.random() * 4}s`);
    flower.style.transitionDelay = `${i * 8}ms`;
    frag.appendChild(flower);

    if (i % 5 === 0 && highlightLayer) {
      const glint = document.createElement("span");
      glint.className = "painted-highlight";
      glint.style.left = `${x.toFixed(2)}%`;
      glint.style.top = `${y.toFixed(2)}%`;
      glint.style.setProperty("--s", `${(size * (2.4 + Math.random())).toFixed(1)}px`);
      glint.style.setProperty("--r", `${Math.random() * 360}deg`);
      glint.style.setProperty("--float-time", `${5 + Math.random() * 5}s`);
      highlightFrag.appendChild(glint);
    }
  }

  blossomLayer.appendChild(frag);
  if (highlightLayer) highlightLayer.appendChild(highlightFrag);
})();
