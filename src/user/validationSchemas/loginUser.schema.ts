import * as Joi from 'joi';

export default Joi.object({
  username: Joi.string().alphanum().min(3).max(20),
  password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
  email: Joi.string().email({
    minDomainSegments: 2,
    tlds: { allow: ['com', 'net'] },
  }),
}).xor('username', 'email');
