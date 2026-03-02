type DateStyle = Intl.DateTimeFormatOptions["dateStyle"];

function formatDate(date: string, dateStyle: DateStyle = "medium", locales = "en",): string {
   const dateFormat = new Date(date.replaceAll("-", "/"));
   const dateFormatter = new Intl.DateTimeFormat(locales, { dateStyle });
   return dateFormatter.format(dateFormat);
};

export { formatDate }
