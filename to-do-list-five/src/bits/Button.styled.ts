import styled from 'styled-components'

interface Props {
    primary: boolean
}

export const Button = styled.button<Props>`
    background-color: #1261a0;
    color: white;
    outline: none;
    border: none;
    font-size: 18px;
    padding: 12px;
    margin-right: 12px;
    margin-top: 12px;
    max-width: 200px;

    ${props => props.primary && 'margin:0px; max-width:100%;'}
`
