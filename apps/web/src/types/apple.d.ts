export interface AppleIDAuthResponse {
  authorization: {
    code: string;
    id_token: string;
    state?: string;
  };
  user?: {
    email?: string;
    name?: {
      firstName?: string;
      lastName?: string;
    };
  };
}

export interface AppleIDAuthConfig {
  clientId: string;
  scope: string;
  redirectURI: string;
  state?: string;
  nonce?: string;
  usePopup: boolean;
}

declare global {
  interface Window {
    AppleID?: {
      auth: {
        init: (config: AppleIDAuthConfig) => void;
        signIn: () => Promise<AppleIDAuthResponse>;
      };
    };
  }
}

export {};