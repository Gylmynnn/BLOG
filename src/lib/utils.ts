type DateStyle = Intl.DateTimeFormatOptions["dateStyle"];

export const formatDate = (
   date: string,
   dateStyle: DateStyle = "medium",
   locales = "en",
) => {
   const dateFormat = new Date(date.replaceAll("-", "/"));
   const dateFormatter = new Intl.DateTimeFormat(locales, { dateStyle });
   return dateFormatter.format(dateFormat);
};
