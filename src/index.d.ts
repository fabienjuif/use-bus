declare module "use-bus" {
  export interface EventAction<T extends string = string> {
    type: T;
    [key: string]: any;
  }

  interface DispatchFn<T extends EventAction = EventAction> {
    (name: keyof T): void;
    (event: T): void;
  }

  type FilterActionType<
    A extends EventAction,
    ActionType extends A["type"]
  > = A extends any ? ActionType extends A['type'] ? A : never : never;

  interface UseBus<
    T extends EventAction = EventAction
  > {
    <TName extends T['type'] = T['type']>(name: TName, callback: (event: FilterActionType<T, TName>) => void, deps: any[]): DispatchFn<T>;
    <TName extends T['type'] = T['type']>(name: TName[], callback: (event: FilterActionType<T, TName>) => void, deps: any[]): DispatchFn<T>;
    (name: RegExp, callback: (event: T) => void, deps: any[]): DispatchFn<T>;
    <TEvent extends T>(filter: (event: T) => event is TEvent, callback: (event:TEvent) => void, deps: any[]): DispatchFn<T>;
  }

  export const dispatch: DispatchFn;

  const useBus: UseBus;
  export default useBus;

  export function createBus<TEvents extends EventAction = EventAction>(): [UseBus<TEvents>, DispatchFn<TEvents>];
}
