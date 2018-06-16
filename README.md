# Health indicator

[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com)
[![buildStatus](https://img.shields.io/travis/qiwi/health-indicator.svg?maxAge=1000&branch=master)](https://travis-ci.org/qiwi/health-indicator)
[![Coveralls](https://img.shields.io/coveralls/qiwi/health-indicator.svg?maxAge=1000)](https://coveralls.io/github/qiwi/health-indicator)
[![dependencyStatus](https://img.shields.io/david/qiwi/health-indicator.svg?maxAge=1000)](https://david-dm.org/qiwi/health-indicator)
[![devDependencyStatus](https://img.shields.io/david/dev/qiwi/health-indicator.svg?maxAge=1000)](https://david-dm.org/qiwi/health-indicator)

Health indicator kit for server-side monitoring and balancing.
Inspired by [Part V. Spring Boot Actuator: Production-ready feature 47.6.2 Writing custom HealthIndicators](https://docs.spring.io/spring-boot/docs/current/reference/html/production-ready-endpoints.html)

## Install
```bash
    npm i @qiwi/health-indicator
    yarn add @qiwi/health-indicator
```

## Usage
```javascript
    import express from 'express'
    import {SemaphoreIndicator, Endpoint} from '@qiwi/health-indicator'
    
    const app = express()
    const indicator = new SemaphoreIndicator()
    const endpoint = new Endpoint(indicator)
    
    
    // Override 'getStatus' impl in accordance with your business logic
    indicator.getStatus = () => {
        ...
        return 'GREEN'
    }
    // ... or use separate class MyIndicator extends SemaphoreIndicator {...}
    // ... or just directly set indicator status property
    indicator.status = 'RED'
    
    app.get('/health', endpoint.middleware)  
```

Indicator composes aggregator logic, so its health status may be resolved from deps.
```javascript
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

To declare any CustomIndicator you may easily extend the AbstractClass
```javascript
import {AbstractIndicator} from '@qiwi/health-indicator'

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