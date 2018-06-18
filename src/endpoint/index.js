// @flow

import type {IEndpoint, IResponse, IRequest} from './interface'
import type {IIndicator} from '../indicator/interface'
import {INTERNAL_SERVER_ERROR} from '../endpoint/statuses'

export default class Endpoint implements IEndpoint {
  indicator: IIndicator
  constructor (indicator: IIndicator): IEndpoint {
    if (!indicator) {
      throw new Error('Indicator param is required')
    }

    this.indicator = indicator

    return this
  }
  middleware (req: IRequest, res: IResponse, next?: Function) {
    try {
      const health = this.indicator.health()
      const status = health.status

      // https://github.com/facebook/flow/issues/2048
      // $FlowFixMe
      const httpCode: string = this.indicator.constructor.getHttpCode(status) // TODO separate mapping

      this.constructor.send(res, httpCode, health)

    // type annotations for catch params not yet supported
    // $FlowFixMe
    } catch (e) {
      // TODO handle, log, etc.
      this.constructor.send(res, INTERNAL_SERVER_ERROR, {error: 'Health check obtain failed'})
    }
  }

  static send (res: IResponse, code: string | number, data: Object) {
    res.writeHead(+code, {'Content-Type': 'application/json'})
    res.end(JSON.stringify(data))
  }
}
