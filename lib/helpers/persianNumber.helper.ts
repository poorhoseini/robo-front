const persianDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];

export function persianNumber(input: string | number) {
  if (typeof input === "number") {
    return new Number(input).toLocaleString("fa-ir");
  }

  return input.replace(/\d/g, (x) => persianDigits[Number(x)]);
}

export function englishNumber(input: string) {
  for (var i = 0; i < 10; i++) {
    input = input.replaceAll(persianDigits[i], i.toString());
  }
  return input;
}

/**
 * Formats a mobile phone number to standard 09XX XXX XX XX format.
 * Example: "09123456789" -> "۰۹۱۲ ۳۴۵ ۶۷ ۸۹" (or "0912 345 67 89" if toPersian is false)
 */
export function formatPhoneNumber(
  input?: string | number | null,
  toPersian: boolean = true,
): string {
  if (input === undefined || input === null) return "";

  const str = String(input).trim();
  if (!str) return "";

  // Normalize digits (convert Persian digits to English digits and strip spaces/hyphens)
  let raw = englishNumber(str).replace(/[\s\-_]/g, "");

  // Normalize prefixes: +98, 0098, 98, or 10-digit without leading 0
  if (raw.startsWith("+98")) {
    raw = "0" + raw.slice(3);
  } else if (raw.startsWith("0098")) {
    raw = "0" + raw.slice(4);
  } else if (raw.startsWith("98") && raw.length === 12) {
    raw = "0" + raw.slice(2);
  } else if (raw.startsWith("9") && raw.length === 10) {
    raw = "0" + raw;
  }

  // Format 11-character mobile numbers (starting with 09 or wildcards like 0*, 0X, 0x)
  if (
    raw.length === 11 &&
    (raw.startsWith("09") ||
      raw.startsWith("0*") ||
      raw.startsWith("0X") ||
      raw.startsWith("0x"))
  ) {
    const formatted = `${raw.slice(0, 4)} ${raw.slice(4, 7)} ${raw.slice(7, 9)} ${raw.slice(9, 11)}`;
    return toPersian ? persianNumber(formatted) : formatted;
  }

  return toPersian ? persianNumber(str) : str;
}

