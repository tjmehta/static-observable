declare module 'static-observable' {
  import { Observable } from 'rxjs'

  export default class StaticObservable<ValueType> extends Observable<
    ValueType
  > {
    next(val: ValueType): void
    error(error: Error): void
    complete(): void
  }
}
