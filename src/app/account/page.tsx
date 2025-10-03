import { auth } from "@/auth.config";
import { redirect } from "next/navigation";

export default async function AccountPage() {
  const session = await auth();

  if (!session) {
    redirect("/auth/signin");
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold">My Account</h1>
      <p className="mt-4">Welcome, {session.user?.name || session.user?.email}!</p>
      <div className="mt-8">
        <h2 className="text-2xl font-semibold">Order History</h2>
        <p className="mt-2 text-gray-500">
          (Placeholder for user order history)
        </p>
      </div>
    </div>
  );
}