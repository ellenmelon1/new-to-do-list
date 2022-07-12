import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { Button } from '../bits/Button.styled'
import { ErrorMessage } from '../bits/ErrorMessage.styled'
import { InputSection } from '../bits/InputSection.styled'
import AuthContext from '../WithAuth/context'
import Spinner from './Spinner'

interface FormErrors {
    username?: string
    password?: string
    incorrectDetails?: string
}

const Login = styled.div`
    display: flex;
    flex-direction: column;
    width: 500px;
    background-color: lightgray;
    align-items: center;
    padding: 25px;
`
const LoginContainer = styled.div`
    margin-top: 15px;
`

const LogInPage: () => JSX.Element = () => {
    const { signIn } = useContext(AuthContext)

    const [formValues, setFormValues] = useState({ username: '', password: '' })
    const [formErrors, setFormErrors] = useState<FormErrors>({})
    const [showSpinner, setShowSpinner] = useState(false)
    const navigate = useNavigate()

    const handleLogin = async () => {
        const errors = {
            username: formValues.username.length < 5 ? 'Invalid username' : undefined,
            password: formValues.password.length < 5 ? 'Password must be at least 5 characters long' : undefined,
            incorrectDetails: undefined,
        }
        // checks if any errors are defined
        if (errors.username || errors.password) {
            setFormErrors(errors)
        } else {
            setShowSpinner(true)
            try {
                await signIn(formValues.username, formValues.password)
                navigate('/to-do-list')
            } catch (error) {
                console.error(error)
                setFormErrors({ ...formErrors, incorrectDetails: 'Username or password incorrect' })
            }
            setShowSpinner(false)
        }
    }

    return showSpinner ? (
        <Spinner />
    ) : (
        <LoginContainer>
            <h1>Login or create an account</h1>
            <Login>
                <InputSection>
                    <label htmlFor="username">Username</label>
                    <input
                        id="username"
                        value={formValues.username}
                        type="text"
                        onChange={event => {
                            setFormValues({ ...formValues, username: event.target.value })
                            setFormErrors({ ...formErrors, username: undefined, incorrectDetails: undefined })
                        }}
                    ></input>
                    <ErrorMessage>{formErrors.username}</ErrorMessage>
                </InputSection>
                <InputSection>
                    <label htmlFor="password">Password</label>
                    <input
                        id="password"
                        value={formValues.password}
                        type="password"
                        onChange={event => {
                            setFormValues({ ...formValues, password: event.target.value })
                            setFormErrors({ ...formErrors, password: undefined, incorrectDetails: undefined })
                        }}
                    ></input>
                    <ErrorMessage>{formErrors.password}</ErrorMessage>
                    <ErrorMessage>{formErrors.incorrectDetails}</ErrorMessage>
                </InputSection>
                <InputSection>
                    <Button
                        primary
                        onClick={() => {
                            handleLogin()
                        }}
                    >
                        Login
                    </Button>
                </InputSection>
            </Login>
        </LoginContainer>
    )
}

export default LogInPage
