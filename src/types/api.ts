import { AxiosResponse } from "axios";

export type ID = number | string;

export type Data<
  T extends string | number | symbol = string,
  K = string | number | null
> = Record<T, K>;

export type Params<
  T extends string | number | symbol = string,
  K = string | number | null
> = Record<T, K>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface BaseGetResponse<T = any> {
  data: T;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface BaseIndexResponse<T = any> {
  data: T[];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Response<T = any> = Promise<AxiosResponse<T>>;
