
document.addEventListener("DOMContentLoaded", () => {
  const gallery = document.querySelector(".memory-gallery");
  const modal = document.getElementById("photoModal");
  const modalImage = document.getElementById("modalImage");
  const modalClose = document.getElementById("modalClose");

  // 图片加载失败时显示温柔的占位背景
  document.querySelectorAll(".memory-photo img").forEach((img) => {
    img.addEventListener("error", () => {
      img.style.display = "none";
    });

    img.addEventListener("load", () => {
      const placeholder = img.parentElement.querySelector(".photo-placeholder");
      if (placeholder) {
        placeholder.style.display = "none";
      }
    });
  });

  // 点击照片放大
  gallery?.addEventListener("click", (event) => {
    const card = event.target.closest(".memory-card");
    if (!card) return;

    const img = card.querySelector(".memory-photo img");

    // 图片还没有替换成真实照片时，不打开弹窗
    if (!img || img.style.display === "none" || !img.complete || !img.naturalWidth) {
      return;
    }

    modalImage.src = img.src;
    modal.classList.add("show");
    document.body.style.overflow = "hidden";
  });

  // 关闭照片弹窗
  function closeModal() {
    modal.classList.remove("show");
    document.body.style.overflow = "";
  }

  modalClose?.addEventListener("click", closeModal);

  modal?.addEventListener("click", (event) => {
    if (event.target === modal) {
      closeModal();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeModal();
    }
  });

  // 双击照片，飘出爱心
  gallery?.addEventListener("dblclick", (event) => {
    const card = event.target.closest(".memory-card");
    if (!card) return;

    createHearts(event.clientX, event.clientY);
  });

  function createHearts(x, y) {
    const symbols = ["♡", "♥", "💕", "♡"];

    for (let i = 0; i < 5; i++) {
      const heart = document.createElement("span");
      heart.className = "heart-particle";
      heart.textContent = symbols[Math.floor(Math.random() * symbols.length)];

      heart.style.left = `${x + (Math.random() - 0.5) * 65}px`;
      heart.style.top = `${y + (Math.random() - 0.5) * 25}px`;
      heart.style.animationDelay = `${Math.random() * 0.2}s`;

      document.body.appendChild(heart);

      setTimeout(() => {
        heart.remove();
      }, 1400);
    }
  }

  // 小黄人隐藏彩蛋
  document.querySelectorAll(".hidden-minion").forEach((minion) => {
    minion.addEventListener("click", () => {
      const name = minion.dataset.minion;

      if (typeof window.showToast === "function") {
        window.showToast(`${name} 被你发现啦！Bee-do～ 🍌`);
      }

      minion.style.opacity = "1";
      minion.style.transform = "translateY(-8px) rotate(-8deg)";

      setTimeout(() => {
        minion.style.opacity = "";
        minion.style.transform = "";
      }, 1000);
    });
  });
});
