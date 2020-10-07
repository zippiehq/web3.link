
import React from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components'

document.head = document.body

// Create a Title component that'll render an <h1> tag with some styles
const Title = styled.h1`
  font-size: 1.5em;
  text-align: center;
  color: palevioletred;
`;

// Create a Wrapper component that'll render a <section> tag with some styles
const Wrapper = styled.section`
  padding: 4em;
  background: papayawhip;
`;

// Use Title and Wrapper like any other React component – except they're styled!
ReactDOM.render(
  <Wrapper>
    <Title>
      Hello World!
    </Title>
  </Wrapper>,
  document.getElementById('root')
);

