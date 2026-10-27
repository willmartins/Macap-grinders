const CODES = `
AD AE AF AG AI AL AM AO AQ AR AS AT AU AW AX AZ
BA BB BD BE BF BG BH BI BJ BL BM BN BO BQ BR BS BT BV BW BY BZ
CA CC CD CF CG CH CI CK CL CM CN CO CR CU CV CW CX CY CZ
DE DJ DK DM DO DZ
EC EE EG EH ER ES ET
FI FJ FK FM FO FR
GA GB GD GE GF GG GH GI GL GM GN GP GQ GR GS GT GU GW GY
HK HM HN HR HT HU
ID IE IL IM IN IO IQ IR IS IT
JE JM JO JP
KE KG KH KI KM KN KP KR KW KY KZ
LA LB LC LI LK LR LS LT LU LV LY
MA MC MD ME MF MG MH MK ML MM MN MO MP MQ MR MS MT MU MV MW MX MY MZ
NA NC NE NF NG NI NL NO NP NR NU NZ
OM
PA PE PF PG PH PK PL PM PN PR PS PT PW PY
QA
RE RO RS RU RW
SA SB SC SD SE SG SH SI SJ SK SL SM SN SO SR SS ST SV SX SY SZ
TC TD TF TG TH TJ TK TL TM TN TO TR TT TV TW TZ
UA UG UM US UY UZ
VA VC VE VG VI VN VU
WF WS
YE YT
ZA ZM ZW
`.trim().split(/\s+/);

const regionNames = new Intl.DisplayNames(["en-GB"], { type: "region" });

export type Country = {
  code: string;
  name: string;
};

export const countries: Country[] = CODES.map((code) => ({
  code,
  name: regionNames.of(code) || code,
}))
  .filter((country) => country.name !== country.code)
  .sort((a, b) => a.name.localeCompare(b.name, "en-GB"));

const byCode = new Set(countries.map((country) => country.code));

export function isCountryCode(code: string): boolean {
  return byCode.has(code);
}

export function countryName(code: string): string {
  return countries.find((country) => country.code === code)?.name || code;
}

/** United Kingdom stays first. Typing matches the English name or the ISO code. */
export function filterCountries(query: string): Country[] {
  const needle = query.trim().toLowerCase();
  const matched = needle
    ? countries.filter(
        (country) =>
          country.name.toLowerCase().includes(needle) || country.code.toLowerCase().includes(needle),
      )
    : countries;
  const pinned = matched.filter((country) => country.code === "GB");
  const rest = matched.filter((country) => country.code !== "GB");
  return [...pinned, ...rest];
}
