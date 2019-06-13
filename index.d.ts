declare module "use-bus" {
  export interface EventAction {
    type: string;
    [key: string]: any;
  }
  export function dispatch(name: string): void;
  export function dispatch(payload: EventAction): void;
  export default function useBus(name: string, callback: (payload: EventAction) => void, deps: any[]): typeof dispatch;
}
