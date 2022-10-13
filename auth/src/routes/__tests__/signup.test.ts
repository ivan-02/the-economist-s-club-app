import request from 'supertest';
import { User } from '../../../model';
import app from '../../app';
import { SIGNUP_ROUTE } from '../signup';

/**
 * Avaiable methods:
 *  - POST
 */
describe('tests signup route request availability', () => {
  let email = '';
  let password = '';
  beforeAll(() => {
    email = 'ivan@gmail.com';
    password = 'Password123';
  });

  it('should return 405 for non-post requests to the signup route', async () => {
    await request(app).get(SIGNUP_ROUTE).send({ email, password }).expect(405);
    await request(app).put(SIGNUP_ROUTE).send({ email, password }).expect(405);
    await request(app)
      .patch(SIGNUP_ROUTE)
      .send({ email, password })
      .expect(405);
    await request(app)
      .delete(SIGNUP_ROUTE)
      .send({ email, password })
      .expect(405);
  });

  it('shout return 201 for post requests to the signup route', async () => {
    await request(app).post(SIGNUP_ROUTE).send({ email, password }).expect(201);
  });
});

/**
 * Valid email conditions:
 *   - Standard email formats from 'express-validator' package
 */
describe('test validity of email input', () => {
  let password = '';

  beforeAll(() => {
    password = 'Validpassword1';
  });

  it('should return 422 if the email is not provided', async () => {
    await request(app).post(SIGNUP_ROUTE).send({ password }).expect(422);
  });

  it('should return 422 if the email is not valid', async () => {
    await request(app)
      .post(SIGNUP_ROUTE)
      .send({ email: 'invalidEmail', password })
      .expect(422);
  });

  it('should return 201 if the email is valid', async () => {
    await request(app)
      .post(SIGNUP_ROUTE)
      .send({ email: 'test@test.com', password })
      .expect(201);
  });
});

/**
 * Valid password conditions:
 *   - At least 8 characters
 *   - At most 32 characters
 *   - One lowercase letter
 *   - One uppercase letter
 *   - One digit
 */
describe('test validity of password input', () => {
  let email = '';
  let password = '';
  let flag = false;

  beforeAll(() => {
    email = 'test@test.com';
  });

  it('should return 422 if the password is not provided', async () => {
    await request(app).post(SIGNUP_ROUTE).send({ email }).expect(422);
  });

  it('should return 422 if the password contains less than 8 characters', async () => {
    password = 'Valid12';
  });

  it('should return 422 if the password contains more than 32 characters', async () => {
    password = 'Valid12Valid12Valid12Valid12Valid12';
  });

  it('should return 422 if the password does not contain one lower-case letter', async () => {
    password = 'VALID12VALID12';
  });

  it('should return 422 if the password does not contain one upper-case letter', async () => {
    password = 'valid12valid12';
  });

  it('should return 422 if the password does not contain a digit', async () => {
    password = 'Valid';
    flag = true;
  });

  it('should return 201 if the password is valid', async () => {
    password = 'Valid12valid12';
  });

  afterEach(() => async () => {
    if (!flag) {
      await request(app)
        .post(SIGNUP_ROUTE)
        .send({ email, password })
        .expect(422);
    } else {
      await request(app)
        .post(SIGNUP_ROUTE)
        .send({ email, password })
        .expect(201);
    }
  });
});

/**
 * DataBase persistance layer
 */
describe('test saving user to the database', () => {
  const validUser = {
    email: 'mail@gmail.com',
    password: 'Password123',
  };

  it('persists user in the db if the credentials are valid', async () => {
    const response = await request(app)
      .post(SIGNUP_ROUTE)
      .send(validUser)
      .expect(201);
    expect(response.body.email).toEqual(validUser.email);

    const persistedUser = await User.findOne({ email: response.body.email });
    const persistedUserEmail = persistedUser ? persistedUser.email : '';

    expect(persistedUser).toBeDefined();
    expect(persistedUserEmail).toEqual(validUser.email);
  });
});
