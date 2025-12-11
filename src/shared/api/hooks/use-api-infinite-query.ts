"use client";

import {
  useInfiniteQuery,
  type QueryFunctionContext,
  type QueryKey,
  type UseInfiniteQueryOptions,
  type UseInfiniteQueryResult,
} from "@tanstack/react-query";
import { apiFetch, type ApiError, type ApiFetchRequest } from "../http-client";

type ApiInfiniteRequest<TPageParam> =
  | ApiFetchRequest
  | ((context: { pageParam: TPageParam }) => ApiFetchRequest);

export type UseApiInfiniteQueryOptions<
  TQueryFnData,
  TError extends Error = ApiError,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
  TPageParam = unknown,
> = {
  queryKey: TQueryKey;
  initialPageParam: TPageParam;
  request: ApiInfiniteRequest<TPageParam>;
} & Omit<
  UseInfiniteQueryOptions<TQueryFnData, TError, TData, TQueryKey, TPageParam>,
  "queryKey" | "queryFn" | "initialPageParam"
>;

export function useApiInfiniteQuery<
  TQueryFnData,
  TError extends Error = ApiError,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
  TPageParam = unknown,
>(
  options: UseApiInfiniteQueryOptions<TQueryFnData, TError, TData, TQueryKey, TPageParam>,
): UseInfiniteQueryResult<TData, TError> {
  const { queryKey, initialPageParam, request, ...reactQueryOptions } = options;

  const queryFn = ({ pageParam }: QueryFunctionContext<TQueryKey, TPageParam>) => {
    const normalizedRequest =
      typeof request === "function" ? request({ pageParam: pageParam as TPageParam }) : request;

    return apiFetch<TQueryFnData>(normalizedRequest);
  };

  const infiniteOptions: UseInfiniteQueryOptions<
    TQueryFnData,
    TError,
    TData,
    TQueryKey,
    TPageParam
  > = {
    ...reactQueryOptions,
    queryKey,
    initialPageParam,
    queryFn,
  };

  return useInfiniteQuery<TQueryFnData, TError, TData, TQueryKey, TPageParam>(infiniteOptions);
}
