import Joi from 'joi';


 const validatePin = Joi.object().keys({
    userInput:Joi.string().regex(/^[0-9]{4}$/).required().error((errors: { code: any; message: string; }[]):any => {  
        errors.forEach((err: { code: any; message: string; }) => {
            console.log('error code',err.code);
          switch (err.code) {
            case "any.empty":
              err.message = "PIN should be provided.Please retry";
              break;
            case "string.pattern.base":
              err.message = `PIN must be ${4} digits.Please retry`;
              break;

            case "string.base":
              err.message = `PIN must be a number.Please retry`;
              break;
            default:
              break;
          }
        });
        return errors;
      }),
}).options({ allowUnknown: true });
export const pinValidation = (data: any) => {
    const errors = validatePin.validate(data);
    if (errors.error) {
         console.log("Validation failed for ", [errors.error]);
        const errorMessage: string = errors.error.details[0].message
          .replace(/\/$/, "")
          .replace(/"/g, "");
          return errorMessage
      }
      return null;
}