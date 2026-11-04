// {NOK: 1200, EUR: 400} as "NOK 1 200 + EUR 400", or "" when it has nothing.
const fmtPrices = by => Object.entries(by || {}).filter(([, n]) => n).map(([c, n]) => fmtPrice(c, n)).join(" + ");

