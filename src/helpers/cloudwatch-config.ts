import { CloudWatchLogs } from "@aws-sdk/client-cloudwatch-logs";
function getDate() {
    let today = new Date();
    let year = today.getFullYear();
    let month = today.getMonth()+1;
    let day = today.getDate();
    let fulldate =day+"-"+month+"-"+year;
    return fulldate;
   }


export function cloudWatchPutLogEvent({
  events,
  group = process.env.TAXIGO_LOG_GROUP as string,
  stream = `${process.env.TAXIGO_LOG_STREAM as string}-${getDate()}`,
}: {
  events: any;
  group?: string;
  stream?: string;
}): Promise<any> {
  return new Promise((resolve, reject) => {
    const client = new CloudWatchLogs({ region: "eu-west-1" });
    let params = {
      logEvents: events,
      logGroupName: group,
      logStreamName: stream,
    };
     console.log('log events',params);
     
    client.putLogEvents(params, (err: Error, data: any) => {
      if (err) {
        console.log('err put event',err);
        reject(err);
      } 
      resolve(data);
    });
  });
}

export function cloudWatchDescribeLogStreams(group:string = process.env.TAXIGO_LOG_GROUP as string): Promise<any> {
    const client = new CloudWatchLogs({ region: "eu-west-1" });
    const params = {logGroupName: group};
    return new Promise((resolve, reject) => {
     client.describeLogStreams(params,(err:Error,data:any) => {
            if (err) reject(err);
            resolve(data);
        })  
    });
 
}
export function createLogGroup(group:string = process.env.TAXIGO_LOG_GROUP as string) {
    const client = new CloudWatchLogs({ region: "eu-west-1" });
    const params = {logGroupName: group};
    return new Promise((resolve, reject) => {
        client.createLogGroup(params,(err:Error,data:any) => {
               if (err) reject(err);
               resolve(data);
           })  
       });
}

export function createLogStream(group:string = process.env.TAXIGO_LOG_GROUP as string ,stream:string =`${process.env.TAXIGO_LOG_STREAM as string}-${getDate()}` ) {   
    const client = new CloudWatchLogs({ region: "eu-west-1" });
    const params = {logGroupName: group,logStreamName:stream  };
    console.log('log stream  xxxxxxxx',params);
    return new Promise((resolve, reject) => {
        client.createLogStream(params,(err:Error,data:any) => {
               if (err) reject(err);
               resolve(data);
           })  
       });
}