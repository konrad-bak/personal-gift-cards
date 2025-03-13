import axios from 'axios';

type UserDataProps = {
  username: string;
  email: string;
  password: string;
};

const register = async (userData: UserDataProps) => {
  try {
    const response = await axios.post(
      'http://127.0.0.1:8080/register',
      userData
    );
    console.log(response.data);
  } catch (error) {
    console.error(error);
  }
};

export default register;
