import React from 'react';
import { AxiosResponse } from 'axios';
import { Message } from 'semantic-ui-react';

interface IProps {
    error: AxiosResponse,
    text?: string
}

const ErroMessage: React.FC<IProps> = ({ error, text}) => {
    return (
        <Message error>
            <Message.Header>{error.statusText}</Message.Header>
            {error.data && Object.keys(error.data.errors).length > 0 && (
                <Message.List>
                    {Object.values(error.data.errors).flat().map((erro: any, i) => (
                        <Message.Item key={i}>{erro}</Message.Item>
                    ))}
                </Message.List>
            )}
            {text} 
        </Message>
    )
}

export default ErroMessage;