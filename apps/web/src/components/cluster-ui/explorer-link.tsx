import { useCluster } from "@/providers/cluster-provider";

interface ExplorerLinkProps {
  path: string;
  label: string;
  className?: React.ComponentProps<"a">["className"];
}

const ExplorerLink = (props: ExplorerLinkProps) => {
  const { path, label, className } = props;
  const { getExplorerUrl } = useCluster();

  return (
    <a
      href={getExplorerUrl(path)}
      target="_blank"
      rel="noopener noreferrer"
      className={className ? className : `link font-mono`}
    >
      {label}
    </a>
  );
};

export default ExplorerLink;
