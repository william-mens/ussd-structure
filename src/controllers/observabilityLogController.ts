import {
  cloudWatchDescribeLogStreams,
  cloudWatchPutLogEvent,
  createLogGroup,
  createLogStream,
} from "../helpers/cloudwatch-config.js";
let nextSequenceToken: null = null; // need this for sending log to AWS. Will update after each request.
let eventQueue: { message: string; timestamp: number }[] = [];
let interval: any = null;
// use a queue to send log to couldWatch one at a time to avoid throttling

export const OlogsConsumerHandler = async (event: any, context: any) =>{
  console.log(`Processing Data From Storage Queue with Records: ${JSON.stringify(event.Records)}`);
  const batchItemFailures: { itemIdentifier: any; }[] = [];
  await Promise.allSettled(
    event.Records.map(async (record: { body: any; messageId: any; }) => {
      const body = record.body;
      try {
        const {message, timestamp} = JSON.parse(body);
        await log(message,timestamp);
      } catch (e) {
        console.log(`Error in processing SQS Storage consumer: ${body}`);
        batchItemFailures.push({ itemIdentifier: record.messageId });
      }
    })
  );
  console.log("batch itemFailures", JSON.stringify(batchItemFailures));
  return { batchItemFailures };
};

async function startLogQueueToCloudWatch() {
  if (interval == null) {
    interval = setInterval(async () => {
      if (eventQueue.length === 0) {
        clearInterval(interval);
        interval = null;
        return;
      }
      let events = eventQueue.shift();
      try {
        console.log(events);
        const requests = { events: [events] };
        let response = await cloudWatchPutLogEvent(requests);
        nextSequenceToken = response.nextSequenceToken; // store the new sequence token
      } catch (error) {
        if (error instanceof Error) {
          console.error("an error occurred observability logs", {
            reason: error as Error,
          });
          if (
            error.message.includes("The specified log stream does not exist")
          ) {
             console.log(' specified log stream does not exist creating stream');
           const createLogStreamResponse =  await createLogStream();
           console.log('creating stream response',createLogStreamResponse);
            await startLogQueueToCloudWatch();
            return;
          }
          if (
            error.message.includes("The specified log group does not exist")
          ) {
            console.log(' specified log group does not exist creating log group');
            await createLogGroup();
            await startLogQueueToCloudWatch();
            return;
          }
        }
        return;
      }
    }, 1000);
  }
}

async function log(message: string,timestamp:number) {
  if (nextSequenceToken == null) {
    // just ran server, get the token from AWS
    let res = await cloudWatchDescribeLogStreams(
      process.env.TAXIGO_LOG_GROUP as string
    );
    nextSequenceToken = res.logStreams[0].uploadSequenceToken;
  }
  eventQueue.push({
    message: message,
    timestamp: timestamp
  });
  await startLogQueueToCloudWatch();
}
