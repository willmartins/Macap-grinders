const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

/** Format YYYY-MM-DD (or a datetime prefix) in British form, without using the current clock. */
export function formatDate(value: string | null | undefined): string {
  if (!value) return "";
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(value);
  if (!match) return value;
  const year = match[1];
  const month = months[Number(match[2]) - 1];
  const day = String(Number(match[3]));
  if (!month || !year) return value;
  return `${day} ${month} ${year}`;
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-GB", { maximumFractionDigits: 2 }).format(value);
}
