import axios from 'axios';

export const getCountries = async () => {
  try {
    const response = await axios.get(
      'https://api.countrystatecity.in/v1/countries',
      {
        headers: {
          'X-CSCAPI-KEY': process.env.NEXT_PUBLIC_CSCAPI_KEY,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const getStates = async (country: string) => {
  try {
    const response = await axios.get(
      `https://api.countrystatecity.in/v1/countries/${country}/states`,
      {
        headers: {
          'X-CSCAPI-KEY': process.env.NEXT_PUBLIC_CSCAPI_KEY,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.log(error);
  }
};
