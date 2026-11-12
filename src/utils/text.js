export function normalizeText(value) {
  return String(value)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[ʼ'`’]/g, "")
    .trim();
}

const haystacks = new WeakMap();
let lastQuery = null;
let lastWords = [];

function getHaystack(tutor) {
  let h = haystacks.get(tutor);
  if (h === undefined) {
    h = normalizeText(
      [tutor.name, tutor.city, tutor.subjects.join(" "), tutor.bio].join(" "),
    );
    haystacks.set(tutor, h);
  }
  return h;
}

function getWords(query) {
  if (query !== lastQuery) {
    lastQuery = query;
    lastWords = normalizeText(query).split(/\s+/);
  }
  return lastWords;
}

export function matchesQuery(tutor, query) {
  if (!query) return true;
  const haystack = getHaystack(tutor);
  return getWords(query).every((word) => haystack.includes(word));
}
