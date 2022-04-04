declare module "use-bus" {
  export interface EventAction {
    type: string;
    [key: string]: any;
  }

  export function dispatch(name: string): void;
  export function dispatch(event: EventAction): void;

  export default function useBus(name: string, callback: (event: EventAction) => void, deps: any[]): typeof dispatch;
  export default function useBus(name: string[], callback: (event: EventAction) => void, deps: any[]): typeof dispatch;
  export default function useBus(name: RegExp, callback: (event: EventAction) => void, deps: any[]): typeof dispatch;
  export default function useBus(filter: (event: EventAction) => boolean, callback: (event: EventAction) => void, deps: any[]): typeof dispatch;
}
