enum HttpStatusCodes200 {
  OK = 200,
  CREATED = 201
}
enum HttpStatusCodes400 {
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  NOT_FOUND = 404,
  CONFLICT = 409
}
enum HttpStatusCodes500 {
  INTERNAL_SERVER_ERROR = 500
}

export const httpStatusCodes = {
  ...HttpStatusCodes200,
  ...HttpStatusCodes400,
  ...HttpStatusCodes500
};

export type HttpStatusCodes = HttpStatusCodes200 | HttpStatusCodes400 | HttpStatusCodes500;
