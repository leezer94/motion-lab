"use client";

import {
  useQuery,
  type QueryKey,
  type UseQueryOptions,
  type UseQueryResult,
} from "@tanstack/react-query";
import { apiFetch, type ApiError, type ApiFetchRequest } from "../http-client";

type ApiQueryRequest = ApiFetchRequest | (() => ApiFetchRequest);

export type UseApiQueryOptions<
  TQueryFnData,
  TError extends Error = ApiError,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
> = {
  queryKey: TQueryKey;
  request: ApiQueryRequest;
} & Omit<UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>, "queryKey" | "queryFn">;

export function useApiQuery<
  TQueryFnData,
  TError extends Error = ApiError,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
>(
  options: UseApiQueryOptions<TQueryFnData, TError, TData, TQueryKey>,
): UseQueryResult<TData, TError> {
  const { queryKey, request, ...reactQueryOptions } = options;

  return useQuery({
    queryKey,
    queryFn: () => apiFetch<TQueryFnData>(typeof request === "function" ? request() : request),
    ...reactQueryOptions,
  });
}
