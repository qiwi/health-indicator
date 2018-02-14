# Health indicator

[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com)
![buildStatus](https://travis-ci.org/qiwi/health-indicator.svg?branch=master)
![Coverage](https://coveralls.io/repos/qiwi/health-indicator/badge.svg)
![deps](https://david-dm.org/qiwi/health-indicator.svg)
![devDeps](https://david-dm.org/qiwi/health-indicator/dev-status.svg)


Health indicator kit for server-side monitoring and balancing.

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