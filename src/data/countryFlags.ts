// Map country names (matching src/data/countries.ts) to ISO 3166-1 alpha-2 codes
export const COUNTRY_ISO: Record<string, string> = {
  "Afghanistan": "AF", "Albania": "AL", "Algeria": "DZ", "Argentina": "AR", "Armenia": "AM",
  "Australia": "AU", "Austria": "AT", "Azerbaijan": "AZ", "Bahrain": "BH", "Bangladesh": "BD",
  "Belgium": "BE", "Bolivia": "BO", "Bosnia and Herzegovina": "BA", "Brazil": "BR", "Bulgaria": "BG",
  "Cambodia": "KH", "Cameroon": "CM", "Canada": "CA", "Chile": "CL", "China": "CN",
  "Colombia": "CO", "Costa Rica": "CR", "Croatia": "HR", "Cuba": "CU", "Cyprus": "CY",
  "Czech Republic": "CZ", "Denmark": "DK", "Dominican Republic": "DO", "Ecuador": "EC", "Egypt": "EG",
  "El Salvador": "SV", "Estonia": "EE", "Ethiopia": "ET", "Finland": "FI", "France": "FR",
  "Georgia": "GE", "Germany": "DE", "Ghana": "GH", "Greece": "GR", "Guatemala": "GT",
  "Honduras": "HN", "Hong Kong": "HK", "Hungary": "HU", "Iceland": "IS", "India": "IN",
  "Indonesia": "ID", "Iran": "IR", "Iraq": "IQ", "Ireland": "IE", "Israel": "IL",
  "Italy": "IT", "Jamaica": "JM", "Japan": "JP", "Jordan": "JO", "Kazakhstan": "KZ",
  "Kenya": "KE", "Kuwait": "KW", "Latvia": "LV", "Lebanon": "LB", "Libya": "LY",
  "Lithuania": "LT", "Luxembourg": "LU", "Malaysia": "MY", "Malta": "MT", "Mexico": "MX",
  "Moldova": "MD", "Mongolia": "MN", "Montenegro": "ME", "Morocco": "MA", "Mozambique": "MZ",
  "Myanmar": "MM", "Nepal": "NP", "Netherlands": "NL", "New Zealand": "NZ", "Nicaragua": "NI",
  "Nigeria": "NG", "North Macedonia": "MK", "Norway": "NO", "Oman": "OM", "Pakistan": "PK",
  "Palestine": "PS", "Panama": "PA", "Paraguay": "PY", "Peru": "PE", "Philippines": "PH",
  "Poland": "PL", "Portugal": "PT", "Qatar": "QA", "Romania": "RO", "Russia": "RU",
  "Rwanda": "RW", "Saudi Arabia": "SA", "Senegal": "SN", "Serbia": "RS", "Singapore": "SG",
  "Slovakia": "SK", "Slovenia": "SI", "Somalia": "SO", "South Africa": "ZA", "South Korea": "KR",
  "Spain": "ES", "Sri Lanka": "LK", "Sudan": "SD", "Sweden": "SE", "Switzerland": "CH",
  "Syria": "SY", "Taiwan": "TW", "Tanzania": "TZ", "Thailand": "TH", "Tunisia": "TN",
  "Turkey": "TR", "UAE": "AE", "Uganda": "UG", "Ukraine": "UA", "United Kingdom": "GB",
  "United States": "US", "Uruguay": "UY", "Uzbekistan": "UZ", "Venezuela": "VE", "Vietnam": "VN",
  "Yemen": "YE", "Zambia": "ZM", "Zimbabwe": "ZW",
};

/** Returns the emoji flag for a country name, or empty string if unknown. */
export const getCountryFlag = (name: string): string => {
  const code = COUNTRY_ISO[name];
  if (!code) return "";
  return code
    .toUpperCase()
    .split("")
    .map(c => String.fromCodePoint(127397 + c.charCodeAt(0)))
    .join("");
};
