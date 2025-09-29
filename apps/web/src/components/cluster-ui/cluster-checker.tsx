import { useCluster } from "@/providers/cluster-provider";
import { useConnection } from "@solana/wallet-adapter-react";
import { useQuery } from "@tanstack/react-query";
import AppAlert from "../layout/app-alert";
import { Button } from "../ui/button";

const ClusterChecker = ({ children }: { children: React.ReactNode }) => {
  const { cluster } = useCluster();
  const { connection } = useConnection();

  const versionQuery = useQuery({
    queryKey: ["version", { cluster, endpoint: connection.rpcEndpoint }],
    queryFn: () => connection.getVersion(),
    retry: 1,
  });

  if (versionQuery.isLoading) {
    return null;
  }

  if (versionQuery.isError || !versionQuery.data) {
    return (
      <AppAlert
        action={
          <Button variant="outline" onClick={() => versionQuery.refetch()}>
            Refresh
          </Button>
        }
      >
        Error connecting to cluster{" "}
        <span className="font-bold">{cluster.name}</span>
      </AppAlert>
    );
  }

  return children;
};

export default ClusterChecker;
