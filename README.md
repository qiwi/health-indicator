# Health indicator

[![CI](https://github.com/qiwi/health-indicator/workflows/CI/badge.svg)](https://github.com/qiwi/health-indicator/actions)
[![Maintainability](https://api.codeclimate.com/v1/badges/92555c89dbb2ee348d0c/maintainability)](https://codeclimate.com/github/qiwi/health-indicator/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/92555c89dbb2ee348d0c/test_coverage)](https://codeclimate.com/github/qiwi/health-indicator/test_coverage)
[![npm (tag)](https://img.shields.io/npm/v/@qiwi/health-indicator/latest.svg)](https://www.npmjs.com/package/@qiwi/health-indicator)

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

### Customization
The lib exports only a couple of indicator implementations: 
* `StandardIndicator` (DOWN, OUT_OF_SERVICE, UNKNOWN, UP)
* `SemaphoreIndicator` (RED, BROKEN, GREEN)

To declare any `CustomIndicator` you may easily extend the `AbstractIndicator`
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
