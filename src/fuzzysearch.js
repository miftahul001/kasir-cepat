export function scoreMatch(name, keyword) {
  name = name.toLowerCase();
  keyword = keyword.toLowerCase();

  if (name === keyword) return 100; // exact
  if (name.startsWith(keyword)) return 80;
  if (name.includes(keyword)) return 60;

  // fuzzy karakter berurutan
  let score = 0;
  let kIndex = 0;

  for (let i = 0; i < name.length && kIndex < keyword.length; i++) {
    if (name[i] === keyword[kIndex]) {
      score += 5;
      kIndex++;
    }
  }

  return kIndex === keyword.length ? score : 0;
}

function searchProduct(keyword) {
  let results = products
    .map(p => ({
      ...p,
      score: scoreMatch(p.name, keyword)
    }))
    .filter(p => p.score > 0)
    .sort((a, b) => b.score - a.score);

  return results[0]; // ambil terbaik
}