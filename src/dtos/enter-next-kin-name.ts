import Joi from 'joi';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const customPhoneNumber = Joi.extend(require('joi-phone-number'));
 const enterNextKinName = Joi.object().keys({
    userInput:Joi.string().max(154).required().regex(/^[-\w\s]*$/).error((errors):any => {  
        console.log('validation errors',errors);
        errors.forEach((err: { code: any; message: string; }) => {
            console.log('error code',err.code);
          switch (err.code) {
            case "any.empty":
              err.message = "next of kin input should be provided.Please retry";
              break;
            case "string.base":
              err.message = `next of kin input must be in characters.Please retry`;
              break;
            default:
              break;
          }
        });
        return errors;
      }),
}).options({ allowUnknown: true });


const enterNextKinContact = Joi.object().keys({
    userInput:customPhoneNumber.string().phoneNumber({ defaultCountry: 'GH', strict: true }).error((errors: any[]):any => {  
        console.log('phone number  errors',errors);
        errors.forEach(err => {
            console.log('error code',err.code);
          switch (err.code) {
            case "any.empty":
              err.message = "contact kin input should be provided.Please retry";
              break;
            case "string.base":
              err.message = `contact input must be in numbers.Please retry`;
              break;
            case "phoneNumber.invalid":
                err.message = `contact did not seem to be a valid phone number`;
                break;
            default:
              break;
          }
        });
        return errors;
      }),
}).options({ allowUnknown: true });
export const NextOfKinValidation = (data: any) => {
    const errors = enterNextKinName.validate(data);
    if (errors.error) {
         console.log("Validation failed for ", [errors.error]);
        const errorMessage: string = errors.error.details[0].message
          .replace(/\/$/, "")
          .replace(/"/g, "");
          return errorMessage
      }
      return null;
}
export const NextOfKinContactValidation = (data: any) => {
    const errors = enterNextKinContact.validate(data);
    if (errors.error) {
         console.log("Validation failed for ", [errors.error]);
        const errorMessage: string = errors.error.details[0].message
          .replace(/\/$/, "")
          .replace(/"/g, "");
          return errorMessage
      }
      return null;
}