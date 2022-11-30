import styled from "styled-components"

export const HomeWrapper = styled.div`
  width: 75vw;
  height: 90vh;
  display: flex;
  flex-flow: column;
  margin: auto;
  padding: 8px;
  .overflow-container {
    overflow: auto;
    height: 20vh;
    min-height: 20vh;
    max-height: 20vh;
  }
  .recipe-selected {
    .MuiTypography-body1 {
      font-weight: 600;
    }
  }
  .recipe-not-selected {
    .MuiTypography-body1 {
      font-weight: 400;
    }
  }
`