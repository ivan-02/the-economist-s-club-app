import User from '../user';

describe('test for user persistence model', () => {
  const validUser = {
    email: 'mail@gmail.com',
    password: 'Password123',
  };
  it('does not allow email duplicaiton', async () => {
    await User.create(validUser);
    await expect(User.create(validUser)).rejects.toEqual(
      Error('user with that email already exists')
    ); // Error
  });
});
