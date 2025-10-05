import { auth } from "@/auth.config";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { DownloadItem } from "./_components/DownloadItem";

export default async function DownloadPage() {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    redirect("/auth/signin?callbackUrl=/download");
  }

  const orders = await db.order.findMany({
    where: {
      userId,
      paymentStatus: "PAID",
    },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const allOrderItemIds = orders.flatMap(order => order.items.map(item => item.id));

  const downloadLogs = await db.downloadLog.findMany({
    where: {
      userId,
      orderItemId: { in: allOrderItemIds }
    }
  });

  const logsByOrderItemId = downloadLogs.reduce((acc, log) => {
    if (!acc[log.orderItemId]) {
      acc[log.orderItemId] = [];
    }
    acc[log.orderItemId].push(log);
    return acc;
  }, {} as Record<string, typeof downloadLogs>);


  return (
    <div className="container my-10">
      <h1 className="text-3xl font-bold mb-6">My Downloads</h1>
      {orders.length === 0 ? (
        <p className="text-muted-foreground">You have not purchased any products yet.</p>
      ) : (
        <div className="space-y-8">
          {orders.map((order) => (
            <div key={order.id}>
              <h2 className="text-xl font-semibold mb-4">
                Order #{order.id.slice(0, 8)} -{" "}
                <span className="text-sm font-normal text-muted-foreground">
                  {order.createdAt.toLocaleDateString()}
                </span>
              </h2>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <DownloadItem
                    key={item.id}
                    item={{ ...item, order: { createdAt: order.createdAt } }}
                    downloadLogs={logsByOrderItemId[item.id] || []}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}