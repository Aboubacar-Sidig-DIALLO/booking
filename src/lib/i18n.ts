import { getRequestConfig } from "next-intl/server";

export default getRequestConfig(async () => ({
  messages: (await import("../../messages/fr.json")).default,
  locale: "fr",
}));
