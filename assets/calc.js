// 2026年（令和8年分所得税・令和9年度分住民税）の税金計算
// 出典：国税庁「源泉所得税の改正のあらまし（令和8年4月）」ほか

const BRACKETS = [
  [1949000, 0.05, 0], [3299000, 0.10, 97500], [6949000, 0.20, 427500], [8999000, 0.23, 636000],
  [17999000, 0.33, 1536000], [39999000, 0.40, 2796000], [Infinity, 0.45, 4796000],
];
const MAN = 10000;
const floor1000 = n => Math.max(0, Math.floor(n / 1000) * 1000);
const num = id => Math.max(0, Number(document.getElementById(id).value) || 0);

// 給与所得（令和8・9年分は最低保障額74万円。所得税・住民税とも同じ）
function salaryIncome(a) {
  if (a <= 0) return 0;
  let d;
  if (a <= 3600000) d = a * 0.3 + 80000;
  else if (a <= 6600000) d = a * 0.2 + 440000;
  else if (a <= 8500000) d = a * 0.1 + 1100000;
  else d = 1950000;
  return Math.max(0, a - Math.max(740000, d));
}

// 所得税の基礎控除（令和8年分）
function basicIT(income) {
  if (income <= 4890000) return 1040000;
  if (income <= 6550000) return 670000;
  if (income <= 23500000) return 620000;
  if (income <= 24000000) return 480000;
  if (income <= 24500000) return 320000;
  if (income <= 25000000) return 160000;
  return 0;
}
// 住民税の基礎控除
const basicRT = income => (income <= 24000000 ? 430000 : income <= 24500000 ? 290000 : income <= 25000000 ? 150000 : 0);

// 課税所得から所得税（復興特別所得税を含む）
function incomeTaxOf(taxable) {
  if (taxable <= 0) return 0;
  const [, rate, minus] = BRACKETS.find(b => taxable <= b[0]);
  return Math.floor(Math.round(taxable * rate - minus) * 1021 / 1000);
}
const marginalRate = taxable => (taxable > 0 ? BRACKETS.find(b => taxable <= b[0])[1] : 0);

// 会社員の社会保険料の目安（健康保険5.0%、介護0.8%、厚生年金9.15%〈上限あり〉、雇用保険0.55%）
const socialEstimate = (annual, over40) =>
  annual > 0 ? Math.min(annual / 12, 650000) * 0.0915 * 12 + annual * (0.05 + (over40 ? 0.008 : 0)) + annual * 0.0055 : 0;

/**
 * 所得税・住民税（扶養家族なしの想定）
 * p = { salary: 給与収入, other: 給与以外の所得（事業・雑所得など）, social: 社会保険料, ded: そのほかの所得控除（iDeCoなど） }
 */
function taxes(p) {
  const income = salaryIncome(p.salary || 0) + (p.other || 0);
  const ded = (p.social || 0) + (p.ded || 0);
  const taxableIT = floor1000(income - ded - basicIT(income));
  const incomeTax = incomeTaxOf(taxableIT);
  let residentTax = 0;
  const taxableRT = floor1000(income - ded - basicRT(income));
  if (income > 450000) { // 住民税の非課税限度（単身の目安：合計所得45万円）
    const adjust = taxableRT <= 2000000 ? Math.min(50000, taxableRT) * 0.05 : Math.max((50000 - (taxableRT - 2000000)) * 0.05, 2500);
    residentTax = Math.max(0, Math.floor(taxableRT * 0.1 - adjust)) + 5000;
  }
  return { income, taxableIT, incomeTax, taxableRT, residentTax, rate: marginalRate(taxableIT) };
}

// 国民年金保険料（2026年1〜3月は令和7年度17,510円、4〜12月は令和8年度17,920円）
const PENSION_2026 = 17510 * 3 + 17920 * 9;

// 国民健康保険料のおおまかな目安（全国的によくある料率で概算。実際は市区町村によって大きく違う）
function kokuhoEstimate(income, over40) {
  const base = Math.max(0, income - 430000);
  const fee = base * (0.105 + (over40 ? 0.025 : 0)) + 50000 + (over40 ? 17000 : 0);
  return Math.min(Math.round(fee), over40 ? 1090000 : 920000);
}
