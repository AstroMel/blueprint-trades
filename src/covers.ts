import { coverFieldNotes, coverPrinted } from "./images";

export const coverFor = (colorway?: string) => (colorway === "fieldnotes" ? coverFieldNotes : coverPrinted);
