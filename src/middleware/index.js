// @flow

import type {IEndpoint, IRequest, IResponse, INext} from './interface'
import type {IIndicator} from '../indicator/interface'

export default class Endpoint implements IEndpoint {
  indicator: IIndicator
  constructor (indicator: IIndicator): IEndpoint {
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
        .status(500)
        .send({message: 'Health check obtain failed'})
    }
  }
}
