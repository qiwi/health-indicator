# Health indicator

[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com)
![buildStatus](https://travis-ci.org/qiwi/health-indicator.svg?branch=master)
![coverage](https://coveralls.io/repos/qiwi/health-indicator/badge.svg)
![deps](https://david-dm.org/qiwi/health-indicator.svg)
![devDeps](https://david-dm.org/qiwi/health-indicator/dev-status.svg)


Health indicator kit for server-side monitoring and balancing.
Inspired by [Part V. Spring Boot Actuator: Production-ready feature 47.6.2 Writing custom HealthIndicators](https://docs.spring.io/spring-boot/docs/current/reference/html/production-ready-endpoints.html)

```
    import express from 'express'
    import {SemaphoreIndicator, Endpoint} from 'health-indicator'
    
    const app = express()
    const indicator = new SemaphoreIndicator()
    const endpoint = new Endpoint(indicator)
    
    
    // Override 'getStatus' impl with your business logic accordance
    indicator.getStatus = () => {
        ...
        return 'GREEN'
    }
    // ... or better vis class MyIndicator extends SemaphoreIndicator {...}
    // ... or use direct set for indicator status property
    indicator.status = 'RED'
    
    app.get('/health', endpoint.middleware)  
```

Indicator composes aggregator logic, so its health status may be resolved from deps.
```
    const dep1 = new SemaphoreIndicator({status: 'RED', critical: true})
    const dep2 = new SemaphoreIndicator({status: 'GREEN'})
    const dep3 = new SemaphoreIndicator({deps: {dep1, dep2}})
    const indicator = new SemaphoreIndicator({deps: {dep3}})
    
    indicator.health()
    /*
       {
           status: 'RED',
           critical: true,
           deps: {
               status: 'RED',
               critical: true,
               deps: {
                   dep1: {
                        status: 'RED',
                        critical: true
                   },
                   dep2: {
                        status: 'GREEN'
                   }
               }
           }       
       }

    */
```

To declare any CustomIncicator you may simply extend the AbstractClass
```
// @flow

import AbstractIndicator from './abstract'

const OK = 200
const SERVICE_UNAVAILABLE = 503

export const GREEN = 'GREEN'
export const RED = 'RED'
export const BROKEN = 'BROKEN'
export const STATUS_MAP = {GREEN, BROKEN, RED}
export const SEVERITY_ORDER = [RED, BROKEN, GREEN]

export const DEFAULT_HTTP_CODE = OK
export const HTTP_MAP = {[GREEN]: OK, [RED]: SERVICE_UNAVAILABLE, [BROKEN]: SERVICE_UNAVAILABLE}

export default class SemaphoreIndicator extends AbstractIndicator {
  static getDefaultStatus (): string {
    return BROKEN
  }

  static getDefaultHttpCode (): number {
    return DEFAULT_HTTP_CODE
  }

  static getHttpMap (): Object {
    return HTTP_MAP
  }

  static getStatusMap (): Object {
    return STATUS_MAP
  }

  static getSeverityOrder (): string[] {
    return SEVERITY_ORDER
  }
}

```