import { Implements } from "../ts-utils";

export type TImplementsAction<Actions extends IAction> = Implements<
  IAction,
  Actions
>;

/**
 * Feature ts-utils
 */

type TActionName = Capitalize<`${string}Action`>;
export interface IAction {
  name: TActionName;
  payload?: unknown;
}

type TActionNames<Actions extends IAction> = `${Actions["name"]}`;
type TAllActions = "AllActions";
type TUnitedActionNames<Actions extends IAction> =
  | TActionNames<Actions>
  | TAllActions;

type TPayload<
  Actions extends IAction,
  ActionName extends TUnitedActionNames<Actions>,
> =
  Extract<Actions, { name: ActionName }> extends {
    payload: infer P;
  }
    ? P
    : never;

type TActionCallback<
  Actions extends IAction,
  ActionName extends TUnitedActionNames<Actions>,
> = (payload?: TPayload<Actions, ActionName>) => void;

type TAllActionsCallback<Actions extends IAction> = (action: Actions) => void;

type TUnifiedActionCallbacks<
  Actions extends IAction,
  ActionName extends TUnitedActionNames<Actions>,
> = ActionName extends TAllActions
  ? TAllActionsCallback<Actions>
  : TActionCallback<Actions, ActionName>;

type IActionSubscription<
  Actions extends IAction,
  ActionName extends TUnitedActionNames<Actions> = TUnitedActionNames<Actions>,
> = {
  [actionName in ActionName]?: Array<
    TUnifiedActionCallbacks<Actions, actionName>
  >;
};

/**
 * Feature implementation
 */

export class MyActions<Actions extends IAction> {
  #subscriptions: IActionSubscription<Actions> = {};

  subscribe<ActionName extends TUnitedActionNames<Actions>>(
    actionName: ActionName,
    callback: TUnifiedActionCallbacks<Actions, typeof actionName>,
  ) {
    const subscriptions = this.#subscriptions;

    subscriptions[actionName] ??= [];

    if (actionName === "AllActions") {
      /**
       * actionName === 'AllActions'
       */
      subscriptions[actionName].push(callback);
    } else {
      /**
       * actionName - custom action name
       */
      subscriptions[actionName].push(callback);
    }
  }

  publish(action: Actions) {
    const subscriptions = this.#subscriptions;
    const actionName = action.name as TActionNames<Actions>;

    if (subscriptions[actionName]) {
      const actionPayload = action.payload as
        | Exclude<TPayload<Actions, typeof action.name>, unknown>
        | undefined;
      subscriptions[actionName]?.forEach((callback) =>
        callback(structuredClone(actionPayload)),
      );
    }
    subscriptions.AllActions?.forEach((callback) =>
      callback(structuredClone(action)),
    );
  }
}
