(function () {
  const cards = document.querySelectorAll("[data-letter]");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isTouch = window.matchMedia("(hover: none) and (pointer: coarse)").matches;
  const OPEN_LOCK = "letter-sequence-active";
  const PREVIEW_H = 420;

  /* Overlap phases so motion feels continuous (ms) */
  const timing = isTouch
    ? { departOverlap: 400, flap: 950, depart: 1000, reveal: 1000 }
    : { departOverlap: 460, flap: 1050, depart: 1100, reveal: 1100 };

  function measureLetterHeight(letter) {
    const previous = {
      position: letter.style.position,
      visibility: letter.style.visibility,
      height: letter.style.height,
      maxHeight: letter.style.maxHeight,
      overflow: letter.style.overflow,
    };

    letter.style.position = "absolute";
    letter.style.visibility = "hidden";
    letter.style.height = "auto";
    letter.style.maxHeight = "none";
    letter.style.overflow = "visible";

    const height = Math.ceil(letter.scrollHeight);

    letter.style.position = previous.position;
    letter.style.visibility = previous.visibility;
    letter.style.height = previous.height;
    letter.style.maxHeight = previous.maxHeight;
    letter.style.overflow = previous.overflow;

    return Math.max(PREVIEW_H, height);
  }

  function lockBackground(active) {
    document.body.classList.toggle(OPEN_LOCK, active);
  }

  function nextFrame() {
    return new Promise((resolve) => {
      requestAnimationFrame(() => requestAnimationFrame(resolve));
    });
  }

  function withTimeout(promise, ms) {
    return Promise.race([
      promise,
      new Promise((resolve) => window.setTimeout(resolve, ms)),
    ]);
  }

  function waitTransition(element, propertyName) {
    return new Promise((resolve) => {
      const done = (event) => {
        if (event.target !== element) return;
        if (propertyName && event.propertyName !== propertyName) return;
        element.removeEventListener("transitionend", done);
        resolve();
      };
      element.addEventListener("transitionend", done);
    });
  }

  function waitAnimation(element, animationName) {
    return new Promise((resolve) => {
      const done = (event) => {
        if (event.target !== element) return;
        if (animationName && event.animationName !== animationName) return;
        element.removeEventListener("animationend", done);
        resolve();
      };
      element.addEventListener("animationend", done);
    });
  }

  async function runOpenSequence(card, openedLetter, envelope, flap) {
    lockBackground(true);
    card.classList.add("is-opening");

    await nextFrame();
    card.classList.add("is-open");

    let departDone = null;
    const departTimer = window.setTimeout(() => {
      card.classList.add("is-envelope-exiting");
      departDone = withTimeout(waitAnimation(envelope, "envelopeDepart"), timing.depart);
    }, timing.departOverlap);

    await withTimeout(waitTransition(flap, "transform"), timing.flap);

    if (departDone) {
      await departDone;
    } else {
      card.classList.add("is-envelope-exiting");
      await withTimeout(waitAnimation(envelope, "envelopeDepart"), timing.depart);
    }
    window.clearTimeout(departTimer);

    card.classList.remove("is-envelope-exiting");
    card.classList.add("is-envelope-done");
    openedLetter.removeAttribute("aria-hidden");
    card.classList.add("is-revealing");

    await withTimeout(waitAnimation(openedLetter, "letterContentReveal"), timing.reveal);

    card.classList.remove("is-opening");
    card.classList.add("is-layout-settled");
    lockBackground(false);
  }

  cards.forEach((card) => {
    const button = card.querySelector("button");
    const openedLetter = card.querySelector(".opened-letter");
    const envelope = card.querySelector(".envelope");
    const flap = card.querySelector(".envelope-flap");

    if (!button || !openedLetter || !envelope || !flap) return;

    openedLetter.setAttribute("aria-hidden", "true");
    button.setAttribute("aria-expanded", "false");

    button.addEventListener("click", () => {
      if (card.classList.contains("is-open") || card.classList.contains("is-opening")) {
        return;
      }

      button.setAttribute("aria-expanded", "true");
      button.disabled = true;

      const fullHeight = measureLetterHeight(openedLetter);
      card.style.setProperty("--letter-expand-h", `${fullHeight}px`);

      if (reducedMotion) {
        card.classList.add("is-open", "is-envelope-done", "is-revealing", "is-layout-settled");
        openedLetter.removeAttribute("aria-hidden");
        return;
      }

      runOpenSequence(card, openedLetter, envelope, flap).catch(() => {
        card.classList.add(
          "is-open",
          "is-envelope-done",
          "is-revealing",
          "is-layout-settled"
        );
        card.classList.remove("is-opening", "is-envelope-exiting");
        openedLetter.removeAttribute("aria-hidden");
        lockBackground(false);
      });
    });
  });
})();
