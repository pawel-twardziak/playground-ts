import { faker } from "@faker-js/faker";
import {
  MyActions,
  TImplementsAction,
} from "./event-bus-actions.generic-class";

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

/**
 * Subscribe
 */

describe("EventBus Actions", () => {
  let myActions: MyActions<TUnitedActions>;
  beforeEach(() => {
    myActions = new MyActions<TUnitedActions>();
  });

  it("MyZeroAction should emit correct payload", (done) => {
    myActions.subscribe("MyZeroAction", (payload) => {
      expect(payload).toBeUndefined();
      done();
    });
    myActions.publish({
      name: "MyZeroAction",
    });
  });

  it("MyOneAction should emit correct payload", (done) => {
    const payloadDef: TActionOne["payload"] = { id: faker.number.int() };
    myActions.subscribe("MyOneAction", (payload) => {
      expect(payload).toEqual(payloadDef);
      done();
    });
    myActions.publish({
      name: "MyOneAction",
      payload: payloadDef,
    });
  });

  it("MyTwoAction should emit correct payload", (done) => {
    const payloadDef: TActionTwo["payload"] = {
      title: faker.string.alphanumeric(),
    };
    myActions.subscribe("MyTwoAction", (payload) => {
      expect(payload).toEqual(payloadDef);
      done();
    });
    myActions.publish({
      name: "MyTwoAction",
      payload: payloadDef,
    });
  });

  it("AllActions should emit correct MyZeroAction", (done) => {
    const actionDef: TActionZero = {
      name: "MyZeroAction",
    };
    myActions.subscribe("AllActions", (action) => {
      expect(action).toEqual(actionDef);
      done();
    });
    myActions.publish(actionDef);
  });

  it("AllActions should emit correct MyOneAction", (done) => {
    const actionDef: TActionOne = {
      name: "MyOneAction",
      payload: { id: faker.number.int() },
    };
    myActions.subscribe("AllActions", (action) => {
      expect(action).toEqual(actionDef);
      done();
    });
    myActions.publish(actionDef);
  });

  it("AllActions should emit correct MyTwoAction", (done) => {
    const actionDef: TActionTwo = {
      name: "MyTwoAction",
      payload: { title: faker.string.alphanumeric() },
    };
    myActions.subscribe("AllActions", (action) => {
      expect(action).toEqual(actionDef);
      done();
    });
    myActions.publish(actionDef);
  });

  it("non-existing action should be emitted", (done) => {
    const actionDef: any = {
      name: "MyNonExistingAction",
      payload: { code: faker.string.uuid() },
    };
    myActions.subscribe("AllActions", (action) => {
      expect(action).toEqual(actionDef);
      done();
    });
    myActions.publish(actionDef);
  });
});
