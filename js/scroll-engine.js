(function () {
  const root = document.documentElement;
  let latest = 0;
  let ticking = false;

  function update() {
    const max = Math.max(1, document.body.scrollHeight - window.innerHeight);
    const progress = Math.min(1, Math.max(0, window.scrollY / max));
    latest = progress;
    root.style.setProperty("--scroll-progress", progress.toFixed(4));
    root.style.setProperty("--stage-progress", Math.min(1, progress * 1.25 + 0.08).toFixed(4));
    document.dispatchEvent(new CustomEvent("garden:scroll", { detail: { progress } }));
    ticking = false;
  }

  function requestUpdate() {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  }

  window.GardenScroll = {
    get progress() {
      return latest;
    }
  };

  window.addEventListener("scroll", requestUpdate, { passive: true });
  window.addEventListener("resize", requestUpdate);
  requestUpdate();
})();
