// @flow

import type {IEndpoint, IRequest, IResponse, INext} from './interface'
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
  middleware (req: IRequest, res: IResponse, next: INext) {
    try {
      const health = this.indicator.health()
      const status = health.status

      // https://github.com/facebook/flow/issues/2048
      // $FlowFixMe
      const httpCode: number = this.indicator.constructor.getHttpCode(status) // TODO separate mapping

      res
        .status(httpCode)
        .send(health)

    // type annotations for catch params not yet supported
    // $FlowFixMe
    } catch (e) {
      // TODO handle, log, etc.
      res
        .status(INTERNAL_SERVER_ERROR)
        .send({error: 'Health check obtain failed'})
    }
  }
}
