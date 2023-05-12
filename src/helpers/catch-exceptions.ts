import { responseError } from "../responses.js";
export default function Catch(target: any, key: any, descriptor:any) {
    const originalMethod = descriptor.value;
    descriptor.value = async function (...arg:any) {
        try {
            return await originalMethod.apply(this,arg);
        } catch (error:any) {
            console.log('uncaught error occurred see error stack in the application',[error]);
            return responseError();
        }
    }
    return descriptor;
}
