import { verify } from 'jsonwebtoken';

const checkToken = async (token: string, phrase: string) => {
  try {
    const isToken = verify(token, phrase);
    if (!isToken) return false;

    return isToken;
  } catch (error) {
    return false;
  }
};

export { checkToken };
