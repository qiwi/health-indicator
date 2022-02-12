import { IFunction } from '@qiwi/substrate'

import { INTERNAL_SERVER_ERROR } from '../endpoint/statuses'
import { IIndicator } from '../indicator/interface'
import { IEndpoint, IRequest, IResponse } from './interface'

type ThisConstructor<T> = {
  // @see https://github.com/Microsoft/TypeScript/issues/3841#issuecomment-337560146
  ['constructor']: T
}

export class Endpoint implements IEndpoint, ThisConstructor<typeof Endpoint> {
  indicator: IIndicator
  // @see https://github.com/Microsoft/TypeScript/issues/3841#issuecomment-337560146
  ['constructor']: typeof Endpoint

  constructor (indicator: IIndicator) {
    if (!indicator) {
      throw new Error('Indicator param is required')
    }
    this.indicator = indicator

    return this
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  middleware (_req: IRequest, res: IResponse, _next?: IFunction | Function) {
    try {
      const health = this.indicator.health()
      const status = health.status
      const httpCode: number = this.indicator.constructor.getHttpCode(status) // TODO separate mapping
      this.constructor.send(res, httpCode, health)
    } catch (e) {
      // TODO handle, log, etc.
      this.constructor.send(res, INTERNAL_SERVER_ERROR, { error: 'Health check obtain failed' })
    }
  }

  static send (res: IResponse, code: string | number, data: Record<string, any>) {
    res.writeHead(+code, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify(data))
  }
}
