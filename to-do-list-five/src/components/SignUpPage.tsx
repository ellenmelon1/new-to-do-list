import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { Button } from '../bits/Button.styled'
import { ErrorMessage } from '../bits/ErrorMessage.styled'
import { InputSection } from '../bits/InputSection.styled'
import AuthContext from '../WithAuth/context'
import Spinner from './Spinner'

interface Errors {
    username?: string
    email?: string
    password?: string
    generic?: string
}

const SignupContainer = styled.div`
    display: flex;
    flex-direction: column;
    width: 500px;
    background-color: lightgray;
    align-items: center;
    padding: 25px;
    margin-top: 18vh;
`
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const initialState = { username: '', password: '', email: '', generic: '' }

const SignUpPage: () => JSX.Element = () => {
    const { signUp } = useContext(AuthContext)
    const navigate = useNavigate()

    const [formValues, setFormValues] = useState(initialState)
    const [newUserErrors, setNewUserErrors] = useState<Errors>(initialState)
    const [showSpinner, setShowSpinner] = useState(false)

    const attemptSignUp = async () => {
        setShowSpinner(true)
        const errors = {
            username: formValues.username.length < 5 ? 'Username must be at least 5 characters long' : undefined,
            email: !emailRegex.test(formValues.email) ? 'Please enter a valid email address' : undefined,
            password: formValues.password.length < 5 ? 'Password must be at least 5 characters long' : undefined,
            generic: undefined,
        }
        if (errors.username || errors.email || errors.password) {
            setNewUserErrors(errors)
        } else {
            try {
                await signUp(formValues.username, formValues.password, formValues.email)
                navigate('/verify-account')
            } catch (error) {
                console.error(error)
                setNewUserErrors({ ...newUserErrors, generic: 'Error signing up new user' })
            }
        }
        setShowSpinner(false)
    }

    return showSpinner ? (
        <Spinner />
    ) : (
        <SignupContainer key="signingUp">
            <InputSection>
                <label htmlFor="username">Username</label>
                <input
                    id="username"
                    value={formValues.username}
                    type="text"
                    onChange={event => {
                        setFormValues({ ...formValues, username: event.target.value })
                        setNewUserErrors({ ...newUserErrors, username: '' })
                    }}
                />
                <ErrorMessage>{newUserErrors.username}</ErrorMessage>
            </InputSection>
            <InputSection>
                <label htmlFor="email">Email</label>
                <input
                    id="email"
                    value={formValues.email}
                    type="email"
                    onChange={event => {
                        setFormValues({ ...formValues, email: event.target.value })
                        setNewUserErrors({ ...newUserErrors, email: '' })
                    }}
                ></input>
                <ErrorMessage>{newUserErrors.email}</ErrorMessage>
            </InputSection>
            <InputSection>
                <label htmlFor="password">Password</label>
                <input
                    id="password"
                    value={formValues.password}
                    type="password"
                    onChange={event => {
                        setFormValues({ ...formValues, password: event.target.value })
                        setNewUserErrors({ ...newUserErrors, password: '' })
                    }}
                ></input>
                <ErrorMessage>{newUserErrors.password}</ErrorMessage>
            </InputSection>
            <InputSection>
                <Button primary onClick={attemptSignUp}>
                    Create Account
                </Button>
                <ErrorMessage>{newUserErrors.generic}</ErrorMessage>
            </InputSection>
        </SignupContainer>
    )
}

export default SignUpPage
