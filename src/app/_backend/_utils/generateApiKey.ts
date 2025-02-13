import { MD5 } from "crypto-js";

export const generateApiKey = () => {
  const generateHash = (host: string): string => {
    const auth = process.env.NEXT_PUBLIC_API_SECRET_KEY || "";
    return MD5(MD5(auth) + host + MD5(host + auth)).toString();
  };

  return {
    generateHash
  }
};
