import { QueryClient, type DefaultOptions } from "@tanstack/react-query";

const defaultOptions: DefaultOptions = {
  queries: {
    staleTime: 1000 * 60,
    gcTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    retry: 1,
  },
  mutations: {
    retry: 1,
  },
};

export function createQueryClient() {
  return new QueryClient({
    defaultOptions,
  });
}

export type CreateQueryClient = ReturnType<typeof createQueryClient>;
