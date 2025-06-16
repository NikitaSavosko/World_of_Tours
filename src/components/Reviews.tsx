import React from 'react'
import UserProfile from './UserProfile';

interface Props {
    avatar?: string;
    name: string;
    review: string;
    id: string | null;
    image: string | null;
}

const Reviews = ({ name, review, id, image }: Props) => {

    return (
        <div className='flex flex-col w-full'>
            <div className='flex w-full gap-2'>
                <UserProfile id={id} image={image} />
                <div className='flex flex-col border-b pb-2 border-dashed w-full'>
                    <p className='text-sm text-foreground/50 font-light'>{name}</p>
                    <p className='whitespace-pre-wrap'>{review}</p>
                </div>
            </div>
        </div>
    )
}

export default Reviews