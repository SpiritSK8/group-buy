import { Timestamp } from "firebase/firestore";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function formatTimestamp(timestamp: Timestamp): string {
    const date = timestamp.toDate().getDate();
    const month = MONTHS[timestamp.toDate().getMonth()];
    const year = timestamp.toDate().getFullYear();

    return date + " " + month + " " + year;
}