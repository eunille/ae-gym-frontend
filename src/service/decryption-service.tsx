import { Token, Secret } from "@crmackey/fernet";
import { json } from "stream/consumers";

export default function decryptionService(secret_key: string, message: string) {
  let secret = new Secret(secret_key);

  const token = new Token({
    token: message,
    secret: secret,
    ttl: 0,
  });

  let decrypted_message = token.decode();

  return JSON.parse(decrypted_message);
}

// must use same secret that encoded the token
