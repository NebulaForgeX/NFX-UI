import type { AuthSignupPlatformEnum, LanguageEnum } from "@/enums";

import type { Login } from "./login";

export namespace Signup {
  export namespace Request {
    export interface SendVerificationCode {
      email: string;
      lang: LanguageEnum;
    }

    export interface SignupWithEmail {
      email: string;
      password: string;
      verificationCode: string;
      lang: LanguageEnum;
      deviceId: string;
      signupPlatform: AuthSignupPlatformEnum;
    }
  }

  export namespace Response {
    export type SignupWithEmail = Login.Response.LoginWithEmail;
  }
}
