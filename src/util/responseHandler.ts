export const responseHandler = async (response: Response): Promise<any> =>
  await response.json().then((parsed) => {
    if (response.status < 300) {
      return parsed;
    }

    throw new Error(parsed.error.message);
  });
