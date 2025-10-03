import { auth } from "@/auth.config";
import { redirect } from "next/navigation";
import { Sidebar } from "./_components/Sidebar";
import Link from "next/link";
import { Package } from "lucide-react";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session || (session.user as any)?.role !== "ADMIN") {
    redirect("/auth/signin?callbackUrl=/admin");
  }

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-muted/40 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link href="/admin" className="flex items-center gap-2 font-semibold">
              <Package className="h-6 w-6" />
              <span className="">PixelDew Admin</span>
            </Link>
          </div>
          <div className="flex-1 overflow-auto py-2">
            <Sidebar />
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        {/* You can add a header here with mobile nav toggle and user menu if needed */}
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}