const revealItems = document.querySelectorAll(".reveal");
const counters = document.querySelectorAll("[data-count]");
const modal = document.getElementById("applyModal");
const orderText = document.getElementById("orderText");
const orderRange = document.getElementById("orderRange");
const orderCount = document.getElementById("orderCount");
const energyText = document.getElementById("energyText");
const helperBtn = document.getElementById("helperBtn");
const helperTip = document.getElementById("helperTip");
const posterRail = document.getElementById("posterRail");

const tips = [
  "你负责派单推进",
  "平台来单，不用盲找客户",
  "能抗压，收入空间更大",
  "扫码或电话都能报名"
];

let tipIndex = 0;

const countTo = (element) => {
  if (element.dataset.done === "true") return;
  element.dataset.done = "true";

  const target = Number(element.dataset.count);
  const duration = 980;
  const start = performance.now();

  const tick = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    element.textContent = Math.floor(target * eased).toString();

    if (progress < 1) requestAnimationFrame(tick);
  };

  requestAnimationFrame(tick);
};

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      entry.target.querySelectorAll("[data-count]").forEach(countTo);
    });
  },
  { threshold: 0.18 }
);

revealItems.forEach((item) => observer.observe(item));

document.querySelectorAll(".flow-chip").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".flow-chip").forEach((chip) => chip.classList.remove("active"));
    button.classList.add("active");
    orderText.textContent = button.dataset.order;
  });
});

const updateRange = () => {
  const value = Number(orderRange.value);
  orderCount.textContent = value.toString();

  if (value < 16) {
    energyText.textContent = "适合先熟悉节奏，稳稳把流程跑顺";
  } else if (value < 28) {
    energyText.textContent = "节奏不错，适合想稳定冲业绩的人";
  } else {
    energyText.textContent = "强冲刺节奏，适合目标感很强的人";
  }
};

orderRange.addEventListener("input", updateRange);
updateRange();

const updateActivePoster = () => {
  if (!posterRail) return;

  const posters = [...posterRail.querySelectorAll("img")];
  const railBox = posterRail.getBoundingClientRect();
  const railCenter = railBox.left + railBox.width / 2;

  let activePoster = posters[0];
  let activeDistance = Number.POSITIVE_INFINITY;

  posters.forEach((poster) => {
    const box = poster.getBoundingClientRect();
    const posterCenter = box.left + box.width / 2;
    const distance = Math.abs(posterCenter - railCenter);

    if (distance < activeDistance) {
      activeDistance = distance;
      activePoster = poster;
    }
  });

  posters.forEach((poster) => poster.classList.toggle("is-active", poster === activePoster));
};

if (posterRail) {
  posterRail.addEventListener("scroll", () => requestAnimationFrame(updateActivePoster), { passive: true });
  window.addEventListener("resize", updateActivePoster);
  updateActivePoster();
}

const openModal = () => {
  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
};

const closeModal = () => {
  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
};

document.querySelectorAll(".open-apply").forEach((button) => {
  button.addEventListener("click", openModal);
});

document.querySelectorAll("[data-close-modal]").forEach((button) => {
  button.addEventListener("click", closeModal);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && modal.classList.contains("is-open")) closeModal();
});

helperBtn.addEventListener("click", () => {
  tipIndex = (tipIndex + 1) % tips.length;
  helperTip.textContent = tips[tipIndex];
});
