import { SSMClient, GetParametersCommand } from "@aws-sdk/client-ssm";
export const getParamsFromStore = async (params:string[]) =>{

            const client = new SSMClient({region:"eu-west-1",apiVersion:"latest"});
            const command = new GetParametersCommand({Names: params,WithDecryption:true});
            const response = await client.send(command);
            return response;
}
