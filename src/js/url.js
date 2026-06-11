export const getUrlState = () => {
  const p = new URLSearchParams(window.location.search);

  return {
    category: p.get("category") || "All",
    search: p.get("search") || "",
  };
};

export const setUrlState = ({ category, search }) => {
  const p = new URLSearchParams();

  if (category && category !== "All") p.set("category", category);
  if (search) p.set("search", search);

  const next = p.toString()
    ? `${window.location.pathname}?${p.toString()}`
    : window.location.pathname;

  window.history.pushState({ category, search }, "", next);
};
