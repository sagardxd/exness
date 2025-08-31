export interface UserSignupInput {
    email: string
    password: string
}

export interface UserSigninInput {
    email: string
    password: string
}

export interface UserJwtPayload {
    id: string
    email: string
}