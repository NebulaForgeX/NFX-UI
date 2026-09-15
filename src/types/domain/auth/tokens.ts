export namespace Tokens {
  export namespace Request {
    export interface RefreshTokens {
      refreshToken: string;
      deviceId: string;
    }
  }
  export namespace Response {
    export interface Tokens {
      accessToken: string;
      refreshToken: string;
    }
  }
}
