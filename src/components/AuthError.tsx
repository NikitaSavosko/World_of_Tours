import { CircleX } from 'lucide-react';
import React from 'react'

interface Props {
    message?: string;
}

const AuthError = ({ message }: Props) => {

    if (!message) return null;

    return (
        <div className='px-4 py-2 bg-destructive/15 rounded-md flex items-center gap-2 text-destructive'>
            <CircleX strokeWidth={1} size={18} />
            <p className='font-light text-sm'>{message}</p>
        </div>
    )
}

export default AuthError