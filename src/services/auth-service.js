class AuthService {
  accessToken = null;

  setToken = (_token) => {
    this.accessToken = _token;
  };
}

export default new AuthService();
