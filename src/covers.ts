import { coverNight, coverPrinted } from "./images";

export const coverFor = (colorway?: string) => (colorway === "night" ? coverNight : coverPrinted);
