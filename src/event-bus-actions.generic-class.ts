/**
 * General ts-utils
 */
type Implements<T, U extends T> = U;

/**
 * Feature ts-utils
 */

type TActionName = Capitalize<`${string}Action`>;
interface IAction {
  name: TActionName;
  payload?: unknown;
}

type TActionNames<Actions extends IAction> = `${Actions["name"]}`;
type TAllActions = "AllActions";
type TUnitedActionNames<Actions extends IAction> =
  | TActionNames<Actions>
  | TAllActions;

type TImplementsAction<Actions extends IAction> = Implements<IAction, Actions>;

type TActionZero = TImplementsAction<{
  name: "MyZeroAction";
}>;

type TActionOne = TImplementsAction<{
  name: "MyOneAction";
  payload: { id: number };
}>;
type TActionTwo = TImplementsAction<{
  name: "MyTwoAction";
  payload: { title: string };
}>;

type TUnitedActions = TActionZero | TActionOne | TActionTwo;

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
    console.log("MyActions subscribe", actionName, callback);

    const subscriptions = this.#subscriptions;

    if (typeof subscriptions[actionName] === "undefined") {
      subscriptions[actionName] = [];
    }

    if (!subscriptions?.[actionName]) {
      return;
    }

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
    console.log("MyActions publish", action);

    const subscriptions = this.#subscriptions;
    const actionName = action.name as TActionNames<Actions>;
    const actionPayload = action.payload as
      | Exclude<TPayload<Actions, typeof action.name>, unknown>
      | undefined;

    if (subscriptions[actionName]) {
      subscriptions[actionName].forEach((callback) => callback(actionPayload));
    }
  }
}

/**
 * Subscribe
 */

const myActions = new MyActions<TUnitedActions>();
myActions.subscribe("MyZeroAction", (payload) => {
  console.log("MyZeroAction", payload);
});
myActions.subscribe("MyOneAction", (payload) => {
  console.log("MyOneAction", payload);
});
myActions.subscribe("MyTwoAction", (payload) => {
  console.log("MyTwoAction", payload);
});
myActions.subscribe("AllActions", (action) => {
  console.log("AllActions", action);
  if (action.name === "MyZeroAction") {
    console.log("AllActions MyZeroAction payload", (action as any)["payload"]);
  } else if (action.name === "MyOneAction") {
    console.log("AllActions MyOneAction payload", action.payload);
  } else if (action.name === "MyTwoAction") {
    console.log("AllActions MyTwoAction payload", action.payload);
  }
});

/**
 * Publish
 */

myActions.publish({
  name: "MyZeroAction",
});
myActions.publish({
  name: "MyOneAction",
  payload: {
    id: 0,
  },
});
myActions.publish({
  name: "MyTwoAction",
  payload: {
    title: "Title",
  },
});
