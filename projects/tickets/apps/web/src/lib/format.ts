const priceFormat = new Intl.NumberFormat("pl-PL", {
  style: "currency",
  currency: "PLN",
});

export const formatPrice = (cents: number): string =>
  priceFormat.format(cents / 100);

const plural = new Intl.PluralRules("pl-PL");
const ticketForms = {
  one: "bilet",
  few: "bilety",
  many: "biletów",
  other: "biletu",
} as const;

export const formatTickets = (count: number): string =>
  `${count} ${ticketForms[plural.select(count) as keyof typeof ticketForms]}`;
