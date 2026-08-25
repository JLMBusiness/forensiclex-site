document.addEventListener("DOMContentLoaded", () => {
  const cards = document.querySelectorAll(".card");

  cards.forEach((card, index) => {
    card.style.opacity = 0;
    card.style.transform = "translateY(10px)";
    setTimeout(() => {
      card.style.transition = "opacity 300ms ease-out, transform 300ms ease-out";
      card.style.opacity = 1;
      card.style.transform = "translateY(0)";
    }, 120 * index);
  });
});
