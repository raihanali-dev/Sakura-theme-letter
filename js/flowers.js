(function () {
  const frames = [document.getElementById("leftFlowers"), document.getElementById("rightFlowers")].filter(Boolean);
  const flowers = [];

  frames.forEach((frame) => {
    for (let i = 0; i < 7; i += 1) {
      const flower = document.createElement("span");
      flower.className = "garden-flower";
      flower.style.setProperty("--x", `${5 + i * 12 + Math.random() * 10}%`);
      flower.style.setProperty("--h", `${180 + Math.random() * 260}px`);
      flower.style.setProperty("--lean", `${-9 + Math.random() * 18}deg`);
      flower.style.setProperty("--growth", "0");
      flower.style.setProperty("--bloom", "0");
      flower.innerHTML = "<i></i><b></b>";
      frame.appendChild(flower);
      flowers.push({ flower, threshold: i / 12 + Math.random() * 0.2 });
    }
  });

  document.addEventListener("garden:scroll", (event) => {
    const progress = event.detail.progress;
    flowers.forEach(({ flower, threshold }) => {
      const growth = Math.max(0, Math.min(1, (progress - threshold) * 2.2));
      flower.style.setProperty("--growth", growth.toFixed(3));
      flower.style.setProperty("--bloom", Math.max(0, Math.min(1, (growth - 0.55) * 2.5)).toFixed(3));
    });
  });
})();
