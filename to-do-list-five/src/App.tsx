import Amplify from 'aws-amplify'
import awsExports from './aws-exports'
import ToDoPage from './components/ToDo/ToDoPage'
import SignUpPage from './components/SignUpPage'
import Nav from './components/Nav/Nav'
import LoginPage from './components/LogInPage'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { MainContainer } from './bits/MainContainer.styled'
import { WithAuth } from './WithAuth/index'
import VerifyAccount from './components/VerifyAccount'
import React from 'react'

Amplify.configure(awsExports)

const App = () => {
    return (
        <div>
            <BrowserRouter>
                <WithAuth>
                    <Nav />
                    <MainContainer>
                        <Routes>
                            <Route path="/" element={<LoginPage />} />
                            <Route path="/signup" element={<SignUpPage />} />
                            <Route path="/to-do-list" element={<ToDoPage />} />
                            <Route path="/verify-account" element={<VerifyAccount />} />
                        </Routes>
                    </MainContainer>
                </WithAuth>
            </BrowserRouter>
        </div>
    )
}

export default App
