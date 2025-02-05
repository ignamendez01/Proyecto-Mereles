import styled from 'styled-components';

export const PageContainer = styled.div`
    padding-top: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
`;

export const ButtonContainer = styled.div`
    display: flex;
    gap: 5px;
    margin-top: 20px;
`;

export const Button = styled.button`
    padding: 10px 20px;
    font-size: 16px;
    cursor: pointer;
    border-radius: 5px;
    &:hover {
        background-color: dimgray;
    }
    margin-left: 0;
    &:disabled {
        background-color: lightgray;
        cursor: not-allowed;
    }
`;
