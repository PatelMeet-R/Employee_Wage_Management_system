interface cookieOption {
  expires: Date;
  httpOnly: boolean;
}
interface bodyResponse {
  clearCookie(arg0: string, arg1: { httpOnly: boolean; }): unknown;
  status: (code: number) => bodyResponse;
  cookie: (name: string, value: string, options?: cookieOption) => bodyResponse;
  json: (body: any) => void;
  send: (body: any) => void;
}
interface hashValidation {
  isValid: boolean;
  hashPass?: string;
}

export { cookieOption, bodyResponse, hashValidation };
