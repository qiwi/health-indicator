import {IHttpMap, IIndicatorDeps, IStatusMap} from "../src/indicator/interface"
import {IHeaders, IResponse} from "../src/endpoint/interface"

declare module '@qiwi/health-indicator' {
  declare interface IHealth {
    constructor(opts: IHealthOpts): IHealth;
    status: string,
    critical: boolean,
    deps: IHealthDeps,
    [key: string]: any,
  }
  
  declare type IHealthOpts = {
    status: string,
    critical?: boolean,
    deps: ?IHealthDeps,
    extra: ?IHealthExtra,
  }
  
  declare type IHealthDeps = {
    [key: string]: IHealth;
  } | void
  
  declare type IHealthExtra = {
    [key: string]: any
  } | void

  declare interface IResponse {
    writeHead(code: string, IHeaders) : any,
    end(data?: string, encoding?: string, cb?: Function): IResponse
  }
  
  declare interface IEndpoint {
    constructor(indicator: IIndicator): IEndpoint,
    middleware(req: any, res: IResponse, next?: Function): any
  }
  
  declare interface IIndicator {
    critical: boolean | void,
    status: string | void,
    deps: IIndicatorDeps,
    extra: IHealthExtra,
    constructor(opts: IIndicatorOpts): IIndicator,
    health(): IHealth,
    getCritical(): boolean,
    getStatus(): string,
    getDeps(): IIndicatorDeps | void,
    getExtra(): any
  }
  
  declare interface IIndicatorStatics {
    getDefaultStatus(): string,
    getSeverityOrder(): string[],
    getStatusMap (): IStatusMap,
    getHttpMap (): IHttpMap,
    getDefaultHttpCode (): number,
    getHttpCode (status: string): number,
    resolveCritical (deps:? IIndicatorDeps): boolean,
    resolveStatus (deps:? IIndicatorDeps, order: string[], def: string): string,
    getLowestStatus (deps: IIndicatorDeps, order: string[]): string,
    getHighestStatus (deps: IIndicatorDeps, order: string[]): string
  }

  declare type IIndicatorOpts = {
   critical: boolean,
   status?: string,
   deps: IIndicatorDeps,
   extra: IHealthExtra,
  }
  
  declare type IIndicatorDeps = {
   [key: string]: IIndicator,
  } | void
  
  declare type IHttpMap = {
    [key: string]: number;
  }

  declare type IStatusMap = {
    [key: string]: string;
  }

  declare class Endpoint implements IEndpoint {
    constructor(indicator: IIndicator): IEndpoint,
    middleware(req: any, res: IResponse, next?: Function): any
  }

  declare class AbstractIndicator implements IIndicator {
    critical: boolean | void,
    status: string | void,
    deps: IIndicatorDeps,
    extra: IHealthExtra,
    constructor(opts: IIndicatorOpts): IIndicator,
    health(): IHealth,
    getCritical(): boolean,
    getStatus(): string,
    getDeps(): IIndicatorDeps | void,
    getExtra(): any,

    static getDefaultStatus(): string,
    static getSeverityOrder(): string[],
    static getStatusMap (): IStatusMap,
    static getHttpMap (): IHttpMap,
    static getDefaultHttpCode (): number,
    static getHttpCode (status: string): number,
    static resolveCritical (deps:? IIndicatorDeps): boolean,
    static resolveStatus (deps:? IIndicatorDeps, order: string[], def: string): string,
    static getLowestStatus (deps: IIndicatorDeps, order: string[]): string,
    static getHighestStatus (deps: IIndicatorDeps, order: string[]): string
  }

  declare class SemaphoreIndicator extends AbstractIndicator implements IIndicator {}

  declare class StandardIndicator extends AbstractIndicator implements IIndicator {}

  declare export {
    AbstractIndicator,
    SemaphoreIndicator,
    StandardIndicator,
    Endpoint
  }
}
