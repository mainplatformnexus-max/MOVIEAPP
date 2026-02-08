import { useAuth } from "@/contexts/AuthContext";
import { formatUGX } from "@/data/subscriptions";
import { XCircle } from "lucide-react";

const planPrices: Record<string, Record<string, number>> = {
  normal: { "1day": 5000, "1week": 10000, "1month": 25000 },
  agent: { "1week": 20000, "1month": 50000 },
};

const AdminSubscriptions = () => {
  const { allSubscriptions, allUsers, cancelSubscription } = useAuth();

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground mb-6">Subscriptions</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-card rounded-xl border border-border p-4">
          <p className="text-sm text-muted-foreground">Total</p>
          <p className="text-2xl font-bold text-foreground">{allSubscriptions.length}</p>
        </div>
        <div className="bg-card rounded-xl border border-border p-4">
          <p className="text-sm text-muted-foreground">Active</p>
          <p className="text-2xl font-bold text-emerald-400">{allSubscriptions.filter((s) => s.status === "active").length}</p>
        </div>
        <div className="bg-card rounded-xl border border-border p-4">
          <p className="text-sm text-muted-foreground">Expired</p>
          <p className="text-2xl font-bold text-amber-400">{allSubscriptions.filter((s) => s.status === "expired").length}</p>
        </div>
        <div className="bg-card rounded-xl border border-border p-4">
          <p className="text-sm text-muted-foreground">Revenue</p>
          <p className="text-lg font-bold text-foreground">
            {formatUGX(allSubscriptions.reduce((sum, s) => sum + (planPrices[s.plan]?.[s.duration] || 0), 0))}
          </p>
        </div>
      </div>

      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-3 text-muted-foreground font-medium">User</th>
                <th className="text-left p-3 text-muted-foreground font-medium">Plan</th>
                <th className="text-left p-3 text-muted-foreground font-medium">Duration</th>
                <th className="text-left p-3 text-muted-foreground font-medium">Price</th>
                <th className="text-left p-3 text-muted-foreground font-medium">Status</th>
                <th className="text-left p-3 text-muted-foreground font-medium">Expires</th>
                <th className="text-right p-3 text-muted-foreground font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {allSubscriptions.map((s) => {
                const user = allUsers.find((u) => u.id === s.userId);
                const planLabel = (s.plan || "unknown").toUpperCase();
                return (
                  <tr key={s.id} className="border-b border-border last:border-0 hover:bg-secondary/30">
                    <td className="p-3 text-foreground">{user?.name || "Unknown"}</td>
                    <td className="p-3">
                      <span className={`text-xs px-2 py-0.5 rounded font-medium ${s.plan === "agent" ? "bg-amber-500/20 text-amber-400" : "gradient-primary text-primary-foreground"}`}>
                        {planLabel}
                      </span>
                    </td>
                    <td className="p-3 text-muted-foreground">{s.duration || "N/A"}</td>
                    <td className="p-3 text-foreground">{formatUGX(planPrices[s.plan]?.[s.duration] || 0)}</td>
                    <td className="p-3">
                      <span className={`text-xs px-2 py-0.5 rounded ${
                        s.status === "active" ? "bg-emerald-500/20 text-emerald-400" :
                        s.status === "expired" ? "bg-amber-500/20 text-amber-400" :
                        "bg-destructive/20 text-destructive"
                      }`}>
                        {s.status}
                      </span>
                    </td>
                    <td className="p-3 text-muted-foreground text-xs">
                      {new Date(s.endDate).toLocaleDateString()}
                    </td>
                    <td className="p-3 text-right">
                      {s.status === "active" && (
                        <button onClick={() => cancelSubscription(s.id)} className="p-1.5 rounded hover:bg-secondary text-destructive" title="Cancel">
                          <XCircle className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
              {allSubscriptions.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-6 text-center text-muted-foreground">No subscriptions yet</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminSubscriptions;
