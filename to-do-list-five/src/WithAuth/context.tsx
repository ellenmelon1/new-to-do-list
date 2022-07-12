import { CognitoUser } from '@aws-amplify/auth'
import { createContext } from 'react'

export interface CognitoUserAttributes {
    email: string
    emailVerified?: boolean
    sub: string
}

export interface AppUser extends CognitoUser {
    attributes?: CognitoUserAttributes
    // challengeName?: string
    username?: string
}

export type AuthContextValue = {
    signIn: (username: string, password: string) => Promise<AppUser>
    signOut: () => void
    signUp: (username: string, password: string, email: string) => Promise<void>
    confirmSignUp: (username: string, verificationCode: string) => Promise<void>
    currentUser?: AppUser
    fetchCurrentuser: () => Promise<string>
}

const AuthContext = createContext<AuthContextValue>({} as AuthContextValue)

export default AuthContext
