export default function normalizeText(input) {
  if (!input) return '';
  return String(input)
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/[^a-z--\uFFFFğüşöçıâîû]/g, ' ') // keep Turkish letters approximated
    .replace(/\s+/g, ' ')
    .trim();
}

