import {cloudWatchDescribeLogStreams, cloudWatchPutLogEvent,createLogGroup,createLogStream} from './cloudwatch-config.js'; 
let nextSequenceToken: null = null; // need this for sending log to AWS. Will update after each request.
let eventQueue: { message: string; timestamp: number; }[] = [];
let interval:any = null;
// use a queue to send log to couldWatch one at a time to avoid throttling

async function startLogQueueToCloudWatch() {
  if (interval == null) {
    interval =  setInterval(async() => {
        if (eventQueue.length ===0) {
            clearInterval(interval);
            interval = null;
            return;
        }
     let  events = eventQueue.shift();
     try {
        console.log(events);
        const requests = {events: [events]};
        let response = await cloudWatchPutLogEvent(requests);
        nextSequenceToken = response.nextSequenceToken; // store the new sequence token
     } catch (error) {
          if (error instanceof Error) {
            console.error('an error occurred observability logs',{reason:error as Error});
            if (error.message.includes('The specified log stream does not exist')) {
                await createLogStream();
               //await Promise.all([logGroup,logStream]);
              await startLogQueueToCloudWatch();
              return;
          }
          if (error.message.includes('The specified log group does not exist')) {
            await createLogGroup();
           //await Promise.all([logGroup,logStream]);
          await startLogQueueToCloudWatch();
          return;
      }

          }
       
        return;
     }
    },1000);
  }
}
export async function log(message:string) {
    if (nextSequenceToken == null) {
        // just ran server, get the token from AWS
        let res = await cloudWatchDescribeLogStreams(process.env.TAXIGO_LOG_GROUP as string);
        nextSequenceToken = res.logStreams[0].uploadSequenceToken;
       }
     eventQueue.push({
      message: message,
      timestamp: (new Date()).getTime()
     });
    await startLogQueueToCloudWatch(); 
    }