import "./style.css";
import "./webpage.ts";

import { Sample, Config, Subscriber, Session } from "@ZettaScaleLabs/zenoh-ts";

export async function main() {
  const session = await Session.open(Config.new("ws/127.0.0.1:10000"));

  const subscriber_callback = async function (sample: Sample): Promise<void> {
    console.log("    cb demo 1 :  Key_expr ", sample.keyexpr());
    console.log("    cb demo 1 :  Value    ", sample.payload());
  };

  // Callback Subscriber tkae a callback which will be called upon every sample recieved.
  let callback_subscriber: Subscriber = await session.declare_subscriber(
    "demo/pub",
    subscriber_callback,
  );
  await sleep(1000 * 3);
  callback_subscriber.undeclare();
  console.log("undeclare callback_subscriber");

  // Poll Subscribers will only consume data on calls to receieve()
  // This means that interally the FIFO queue will fill up to the point that new values will be dropped
  // The dropping of these values occurs in the Remote-API Plugin
  let poll_subscriber: Subscriber =
    await session.declare_subscriber("demo/pub");
  let value = await poll_subscriber.recieve();
  console.log("poll_subscriber", value);
  console.log(await poll_subscriber.recieve());
  poll_subscriber.undeclare();
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

main()
  .then(() => console.log("Done"))
  .catch((e) => {
    console.log(e);
    throw e;
  });
