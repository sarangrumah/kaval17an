import AdminNav from "@/components/AdminNav";

export const dynamic = "force-dynamic";

export default function AdminLayout({ children }) {
  return (
    <>
      <AdminNav />
      <main className="mx-auto max-w-4xl px-3 py-6 sm:px-6">{children}</main>
    </>
  );
}
