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
