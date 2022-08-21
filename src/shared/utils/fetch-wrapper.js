import JwtService from "../../../services/auth-service";

export const fetch = async ({ path, method, body }) => {
  const response = await fetch(
    `${Constants.manifest.extra.baseUrl}/api/v1/${path}`,
    {
      method,
      headers: {
        Authorization: `Bearer ${JwtService.accessToken}`,
      },
      body,
    }
  );
  return await response.json();
};
