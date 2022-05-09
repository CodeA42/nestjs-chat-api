import * as Joi from 'joi';

export default Joi.object({
  name: Joi.string().min(3).max(32).required(),
});
