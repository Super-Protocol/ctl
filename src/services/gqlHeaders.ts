export default (accessToken: string): { [header: string]: string } => {
  return {
    Authorization: `Bearer ${accessToken}`,
  };
};
