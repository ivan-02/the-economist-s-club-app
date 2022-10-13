import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { User } from '../../model';

export const SIGNUP_ROUTE = '/api/auth/signup';
const signUpRouter = express.Router();

signUpRouter.post(
  SIGNUP_ROUTE,
  [
    body('email').isEmail().withMessage('Email must be in a valid format'),
    body('password')
      .trim()
      .isLength({ min: 8, max: 32 })
      .withMessage('Password must be between 8 and 32 characters'),
    body('password')
      .matches(/^(.*[a-z].*)$/)
      .withMessage('Password must contain at least one lowercase letter'),
    body('password')
      .matches(/^(.*[A-Z].*)$/)
      .withMessage('Password must contain at least one uppercase letter'),
    body('password')
      .matches(/^(.*\d.*)$/)
      .withMessage('Password must contain at least one digit'),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty())
      return res.status(422).send({ errors: errors.array() });

    const { email, password } = req.body;
    try {
      const user = await User.create({ email, password });
      return res.status(201).send({ email: user.email });
    } catch (error) {
      return res.status(201).send({ errors: [error] });
    }
  }
);

signUpRouter.all(SIGNUP_ROUTE, (req, res) => res.status(405).send({}));

export default signUpRouter;
