// server/checkSecretWord.ts
import { createServerFn } from "@tanstack/react-start";

interface SecretWordPayload {
  secretWord: string;
}

export const checkSecretWord = createServerFn({ method: "POST" })
  .validator((data: SecretWordPayload) => data)
  .handler(({ data }) => {
    if (data.secretWord !== process.env.SIGNUP_SECRET) {
      throw new Error("Invalid secret word");
    }
    return { success: true };
  });
