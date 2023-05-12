import Joi from 'joi';
 const enterAmounts = Joi.object().keys({
    userInput:Joi.number().positive().precision(2).required().error((errors: any[]):any => {  
        errors.forEach(err => {
            console.log('error code',err.code);
          switch (err.code) {
            case "any.empty":
              err.message = "amount should be provided.Please retry";
              break;
            case "number.base":
              err.message = `amount must be a number.Please retry`;
              break;
            default:
              break;
          }
        });
        return errors;
      }),
}).options({ allowUnknown: true });
export const amountValidation = (data: any) => {
    const errors = enterAmounts.validate(data);
    if (errors.error) {
         console.log("Validation failed for ", [errors.error]);
        const errorMessage: string = errors.error.details[0].message
          .replace(/\/$/, "")
          .replace(/"/g, "");
          return errorMessage
      }
      return null;
}