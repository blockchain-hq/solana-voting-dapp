import { ClusterProvider } from "./cluster-provider";
import { ReactQueryProvider } from "./react-query-provider";
import { SolanaProvider } from "./solana-provider";
import { ThemeProvider } from "./theme-provider";
import React from "react";

export const AppProviders = ({
  children,
}: Readonly<{ children: React.ReactNode }>) => {
  return (
    <ReactQueryProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <ClusterProvider>
          <SolanaProvider>{children}</SolanaProvider>
        </ClusterProvider>
      </ThemeProvider>
    </ReactQueryProvider>
  );
};
