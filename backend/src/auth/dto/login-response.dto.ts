export interface AuthenticatedUserDto {
  username: string;
  displayName: string;
}

export interface LoginResponseDto {
  accessToken: string;
  tokenType: string;
  user: AuthenticatedUserDto;
}
