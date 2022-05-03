import * as Joi from 'joi';

export default Joi.object({
  username: Joi.string().alphanum().min(3).max(20).required(),
  password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
  repeatPassword: Joi.ref('password'),
  accessToken: [Joi.string(), Joi.number()],
  email: Joi.string().email({
    minDomainSegments: 2,
    tlds: { allow: ['com', 'net'] },
  }),
})
  .with('username', 'password')
  .with('password', 'repeatPassword')
  .xor('accessToken', 'password');
