// @flow

interface Send {
  (status: number, body:? any): IResponse;
  (body:? any): IResponse;
}

export interface INext {
  (err:? any): void;
}

export interface IMiddleware {
  (req: Object, res:? Object, next:? INext): any;
}

export interface IRequest {
  query: Object,
  params: Object,
  body: Object,
  principal:? any,
  session:? any
}

export interface IResponse {
  send: Send,
  status(code: number): IResponse,
}

export interface IEndpoint {
  constructor(indicator: any): IEndpoint;
  middleware(req: IRequest, res: IResponse, next: INext): any;
}
