import { createDurable } from 'itty-durable'

export class Counter extends createDurable({ autoReturn: true }) {
  constructor(state, env) {
    super(state, env)

    // anything defined here is only used for initialization (if not loaded from storage)
    this.counter = 0
  }

  // Because this function does not return anything, it will return the entire contents
  // Example: { counter: 1 }
  increment() {
    this.counter++
  }

  // Any explicit return will honored, despite the autoReturn flag.
  // Note that any serializable params can passed through from the Worker without issue.
  add(a, b) {
    return a + b
  }
}