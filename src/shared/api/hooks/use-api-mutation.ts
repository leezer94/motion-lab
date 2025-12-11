"use client";

import {
  useMutation,
  type MutationFunction,
  type UseMutationOptions,
  type UseMutationResult,
} from "@tanstack/react-query";
import { apiFetch, type ApiError, type ApiFetchRequest } from "../http-client";

type ApiMutationRequest<TVariables> =
  | ApiFetchRequest
  | ((variables: TVariables) => ApiFetchRequest);

export type UseApiMutationOptions<
  TData,
  TError extends Error = ApiError,
  TVariables = void,
  TContext = unknown,
> = {
  request: ApiMutationRequest<TVariables>;
} & Omit<UseMutationOptions<TData, TError, TVariables, TContext>, "mutationFn">;

export function useApiMutation<
  TData,
  TError extends Error = ApiError,
  TVariables = void,
  TContext = unknown,
>(
  options: UseApiMutationOptions<TData, TError, TVariables, TContext>,
): UseMutationResult<TData, TError, TVariables, TContext> {
  const { request, ...mutationOptions } = options;

  const mutationFn: MutationFunction<TData, TVariables> = (variables) =>
    apiFetch<TData>(typeof request === "function" ? request(variables) : request);

  return useMutation({
    mutationFn,
    ...mutationOptions,
  });
}
