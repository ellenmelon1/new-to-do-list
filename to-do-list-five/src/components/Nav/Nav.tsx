import React, { useContext, useState } from 'react'
import { LogoutButton } from './NavStyles/LogoutButton.styled'
import { NavContainer } from './NavStyles/NavContainer.styled'
import { NavLink } from './NavStyles/NavLink.styled'
import { WelcomeMessage } from './NavStyles/WelcomeMessage.styled'
import AuthContext from '../../WithAuth/context'
import { useNavigate } from 'react-router-dom'
import Spinner from '../Spinner'
import { ErrorMessage } from '../../bits/ErrorMessage.styled'

const Nav = (): JSX.Element => {
    const { signOut, currentUser } = useContext(AuthContext)
    const [showSpinner, setShowSpinner] = useState(false)
    const [signOutError, setSignOutError] = useState('')
    const navigate = useNavigate()

    const handleSignOut = async () => {
        setShowSpinner(true)
        try {
            signOut()
            navigate('/')
        } catch (error) {
            console.error(error)
            setSignOutError('Unable to sign out user')
        }
        setShowSpinner(false)
    }

    return showSpinner ? (
        <Spinner />
    ) : !currentUser ? (
        <NavContainer>
            <NavLink to="/signup">Sign up</NavLink>
            <NavLink to="/">Login</NavLink>
        </NavContainer>
    ) : (
        <div>
            <NavContainer>
                <WelcomeMessage>Hi {currentUser.username}</WelcomeMessage>
                <LogoutButton onClick={handleSignOut}>Logout</LogoutButton>
            </NavContainer>
            <ErrorMessage>{signOutError}</ErrorMessage>
        </div>
    )
}

export default Nav
