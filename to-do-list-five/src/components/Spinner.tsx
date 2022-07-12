import React from 'react'
import styled from 'styled-components'

const SpinnerContainer = styled.div`
    display: flex;
    flex-direction: column;
    height: 100vh;
    justify-content: center;
    align-items: center;
    text-align: center;
    position: absolute;
    z-index: 1;
    width: 100%;
    top: -48px;
    background: white;
`
const SpinnerInner = styled.div`
    border: 10px solid #f3f3f3;
    border-top: 10px solid #3498db;
    border-radius: 50%;
    width: 80px;
    height: 80px;
    animation: spin 1s linear infinite;
    @keyframes spin {
        0% {
            transform: rotate(0deg);
        }
        100% {
            transform: rotate(360deg);
        }
    }
`

const Spinner: () => JSX.Element = () => {
    return (
        <SpinnerContainer>
            <SpinnerInner></SpinnerInner>
        </SpinnerContainer>
    )
}

export default Spinner
