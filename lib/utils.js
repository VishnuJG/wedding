import { VENUE, WEDDING } from "@/lib/wedding-data";

export function buildGoogleCalendarUrl() {
  const start = new Date(WEDDING.date);
  const end = new Date(start.getTime() + 4 * 60 * 60 * 1000);

  const format = (date) =>
    date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: `${WEDDING.coupleDisplay} Wedding Ceremony`,
    dates: `${format(start)}/${format(end)}`,
    details: `${WEDDING.dateDetail}\n\nVenue: ${VENUE.name}, ${VENUE.address}`,
    location: `${VENUE.name}, ${VENUE.address}`,
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export function scrollToSection(id) {
  if (typeof document === "undefined") return;
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

export function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}
