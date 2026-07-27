import bcrypt from "bcryptjs";

const pw = process.argv[2];
if (!pw) {
  console.log('Cara pakai:  npm run hash -- "passwordpilihananda"');
  process.exit(1);
}
if (pw.length < 10) {
  console.log("Password minimal 10 karakter. Ini dipakai untuk mengubah angka kas warga.");
  process.exit(1);
}
console.log("\nSalin baris ini ke .env.local dan ke Environment Variables di Vercel:\n");
console.log(`ADMIN_PASSWORD_HASH="${bcrypt.hashSync(pw, 10)}"\n`);
