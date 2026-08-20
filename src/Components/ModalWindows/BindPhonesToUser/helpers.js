export const scrollContainerToBottom = (container) => {
  if (!container) return;

  setTimeout(() => {
    container.scrollTo({
      top: container.scrollHeight,
      behavior: "smooth",
    });
  }, 0);
};