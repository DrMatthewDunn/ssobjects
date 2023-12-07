import { ThrowableRouter, missing, withParams } from 'itty-router-extras'
import { withDurables } from 'itty-durable'

// export the durable class, per spec
export { Counter } from './Counter'

const router = ThrowableRouter({ base: '/counter' })

router
  // add upstream middleware, allowing Durable access off the request
  .all('*', withDurables())

  // get the durable itself... returns json response, so no need to wrap
  .get('/', ({ Counter }) => Counter.get('test').toJSON())

  // By using { autoReturn: true } in createDurable(), this method returns the contents
  .get('/increment', ({ Counter }) => Counter.get('test').increment())

  // you can pass any serializable params to a method... (e.g. /counter/add/3/4 => 7)
  .get('/add/:a?/:b?', withParams,
    ({ Counter, a, b }) => Counter.get('test').add(Number(a), Number(b))
  )

  // reset the durable
  .get('/reset', ({ Counter }) => Counter.get('test').reset())

  // 404 for everything else
  .all('*', () => missing('Are you sure about that?'))

// with itty, and using ES6 module syntax (required for DO), this is all you need
export default {
  fetch: router.handle
}

/*
Example Interactions:

GET /counter                                => { counter: 0 }
GET /counter/increment                      => { counter: 1 }
GET /counter/increment                      => { counter: 2 }
GET /counter/increment                      => { counter: 3 }
GET /counter/reset                          => { counter: 0 }
GET /counter/add/20/3                       => 23
*/