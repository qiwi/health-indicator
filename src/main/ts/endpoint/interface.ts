import { IFunction } from '@qiwi/substrate'

type IAny = any

export type IHeaders = {
  [key: string]: string | string[]
}

export type IRequest = IAny

export interface IResponse {
  writeHead (code: number, headers: IHeaders): IAny,

  end (data?: string, encoding?: string, cb?: IFunction | Function): IResponse
}

export interface IEndpoint {
  middleware (req: IRequest, res: IResponse, next?: IFunction | Function): IAny;
}
