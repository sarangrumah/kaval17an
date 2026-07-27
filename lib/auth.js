import { SignJWT, jwtVerify } from "jose";

const MASA_BERLAKU = "8h";
export const NAMA_COOKIE = "sesi_panitia";

function kunci() {
  const s = process.env.SESSION_SECRET;
  if (!s || s.length < 32) {
    throw new Error("SESSION_SECRET belum diisi atau kurang dari 32 karakter.");
  }
  return new TextEncoder().encode(s);
}

export async function buatSesi(username) {
  return await new SignJWT({ u: username })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(MASA_BERLAKU)
    .sign(kunci());
}

export async function bacaSesi(token) {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, kunci());
    return payload;
  } catch {
    return null;
  }
}
