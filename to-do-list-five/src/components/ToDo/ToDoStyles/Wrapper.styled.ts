import styled from 'styled-components'

interface Props {
    hidden: boolean
}

export const Wrapper = styled.div<Props>`
    ${props =>
        props.hidden &&
        `
            display: none;
        `};
`
