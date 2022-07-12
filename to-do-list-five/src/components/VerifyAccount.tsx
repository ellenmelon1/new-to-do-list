import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { Button } from '../bits/Button.styled'
import { ErrorMessage } from '../bits/ErrorMessage.styled'
import { InputSection } from '../bits/InputSection.styled'
import AuthContext from '../WithAuth/context'
import Spinner from './Spinner'

const SignupContainer = styled.div`
    display: flex;
    flex-direction: column;
    width: 500px;
    background-color: lightgray;
    align-items: center;
    padding: 25px;
    margin-top: 18vh;
`

const VerifyAccount: () => JSX.Element = () => {
    const navigate = useNavigate()

    const { confirmSignUp, currentUser } = useContext(AuthContext)
    const [showSpinner, setShowSpinner] = useState(false)
    const [verificationCode, setVerificationCode] = useState('')
    const [verificationError, setVerificationError] = useState('')

    const attemptConfirmSignUp = async () => {
        if (!verificationCode) {
            setVerificationError('Please enter verification code')
        } else {
            setShowSpinner(true)
            try {
                // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
                await confirmSignUp(currentUser?.username!, verificationCode)
                navigate('/')
            } catch (error) {
                console.error(error)
                setVerificationError('Incorrect verification code')
            }
            setShowSpinner(false)
        }
    }

    return showSpinner ? (
        <Spinner />
    ) : (
        <SignupContainer key="verifiying">
            <InputSection>
                <label htmlFor="code">Enter the verification code sent to your email address</label>
                <input
                    id="code"
                    value={verificationCode}
                    type="string"
                    onChange={event => {
                        setVerificationCode(event.target.value)
                        setVerificationError('')
                    }}
                ></input>
                <ErrorMessage>{verificationError}</ErrorMessage>
                <Button primary onClick={attemptConfirmSignUp}>
                    Verify account
                </Button>
            </InputSection>
        </SignupContainer>
    )
}

export default VerifyAccount
