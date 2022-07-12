import { Auth } from '@aws-amplify/auth'
import React, { useEffect, useState } from 'react'
import AuthContext, { AppUser, AuthContextValue } from './context'
import WithChildren from './WithChildren'

export const WithAuth = (props: WithChildren) => {
    useEffect(() => {
        updateCurrentUserDetails()
    }, [])

    const [currentUser, setCurrentUser] = useState<AppUser>()

    const fetchCurrentuser = async () => {
        const loggedInUser = await Auth.currentAuthenticatedUser()
        return loggedInUser
    }

    const updateCurrentUserDetails = async (user = currentUser) => {
        if (!user) {
            try {
                const user = await fetchCurrentuser()
                setCurrentUser(user)
            } catch (error) {
                setCurrentUser(undefined)
            }
        }
    }

    const signIn = async (username: string, password: string): Promise<AppUser> => {
        const user = await Auth.signIn(username, password)
        await updateCurrentUserDetails()
        return user
    }

    const signOut = async () => {
        await Auth.signOut()
        await updateCurrentUserDetails()
    }

    const signUp = async (username: string, password: string, email: string) => {
        const { user } = await Auth.signUp({ username: username, password: password, attributes: { email: email } })
        setCurrentUser(user)
    }

    const confirmSignUp = async (username: string, verificationCode: string) => {
        await Auth.confirmSignUp(username, verificationCode)
        await updateCurrentUserDetails()
    }

    const providerValue: AuthContextValue = {
        currentUser,
        signIn,
        signOut,
        signUp,
        confirmSignUp,
        fetchCurrentuser,
    }

    return <AuthContext.Provider value={providerValue}>{props.children}</AuthContext.Provider>
}
