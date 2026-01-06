// Järjestää blogit ensisijaisesti tykkäysten mukaan laskevasti
// ja toissijaisesti otsikon mukaan nousevasti
const blogCompareFn = (a, b) => {
  if (a.likes < b.likes) return 1
  if (b.likes < a.likes) return -1
  if (a.title < b.title) return -1
  if (b.title < a.title) return 1
  return 0
}

module.exports = {
  blogCompareFn
}