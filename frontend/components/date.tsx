//import { parseISO, format } from "date-fns";

export default function DateComponent({ dateString }) {
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  };
  const date = new Date(dateString).toLocaleDateString(undefined, options);
  return <time dateTime={date}>{date}</time>;
}
