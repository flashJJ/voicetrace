export function filterStories(
  items,
  { query = "", mode = "all", ageBand = "all", favoritesOnly = false } = {},
  favorites = []
) {
  const keyword = query.trim().toLowerCase();
  return items.filter((item) => {
    if (mode !== "all" && item.mode !== mode) return false;
    if (ageBand !== "all" && item.ageBand !== ageBand) return false;
    if (favoritesOnly && !favorites.includes(item.slug)) return false;
    if (!keyword) return true;
    const haystack = [item.title, item.subtitle, item.intro, item.dialect, item.type]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
    return haystack.includes(keyword);
  });
}
