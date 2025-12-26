export type AuthTokensDTO = {
  access_token: string;
  refresh_token: string;
  token_type: string;
};

export type UserDTO = {
  id: number;
  username: string;
  role: string;
};

export type LoginResponseDTO = {
  success: boolean;
  message: string;
  data: {
    auth: AuthTokensDTO;
    user: UserDTO;
  };
};



export type AuthSession = {
  id: number;          
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  username: string;
  role: string;
};
