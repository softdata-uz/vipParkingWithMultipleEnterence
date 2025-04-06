import {createGlobalStyle} from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  body {
    background: ${({theme}) => theme.body};
    color: ${({theme}) => theme.text};
    transition: background 0.2s ease-in, color 0.2s ease-in;
  }
`;


export const lightTheme = {
    body: '#FFFFFF',
    text: '#000000'
};

export const darkTheme = {
    body: '#282828',
    text: '#f1f1f1',
    trhover: '#757272',
};