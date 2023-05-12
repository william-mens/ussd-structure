import { SQSClient,SendMessageCommand } from "@aws-sdk/client-sqs";

export async function pushMessageToQueue(message:{message:string,timestamp:number},queueUrl:string = process.env.TAXIGO_QUEUE_URL as string) {
    const client = new SQSClient({ region: "eu-west-1" });
    try {
        const queueRequests = {
            DelaySeconds: 0,
            MessageBody: JSON.stringify(message),
            QueueUrl: queueUrl
          };
          const command = new SendMessageCommand(queueRequests);
          const response = await client.send(command);
          console.log('successfully pushed message to queue',response);
          return true;
    } catch (error) {
        console.error('an error occurred pushing message to queue',{reason: error as Error});
        return true;
    }

}