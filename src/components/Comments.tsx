import React from 'react'
import UserProfile from './UserProfile'

interface Props {
    userId: string | null;
    name: string;
    image?: string | null;
    content: string;
}

const Comments = ({ userId, name, image, content }: Props) => {
    return (
        <div className='w-full flex flex-col max-md:px-4'>
            <div className='flex flex-row items-start gap-2'>
                <UserProfile id={userId} image={image} />
                <div className='flex flex-col'>
                    <p className='text-sm text-foreground/40'>{name}</p>
                    <p>{content}</p>
                </div>
            </div>
        </div>
    )
}

export default Comments