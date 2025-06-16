"use client"
import { GetAllTourPosts, toggleLike } from '@/actions/tour-post-action';
import React, { useState } from 'react'
import { Button } from './ui/button';
import { HeartIcon } from 'lucide-react';
import { redirect } from 'next/navigation';
import { Session } from 'next-auth';

type Tours = Awaited<ReturnType<typeof GetAllTourPosts>>
type Tour = Tours[number];

const TourLike = ({ dbUserId, tour, session }: { dbUserId: string | null, tour: Tour; session: Session | null }) => {

    const [isLiking, setIsLiking] = useState(false);
    const [hasLiked, setHasLiked] = useState(tour.likes.some((like) => like.userId === dbUserId));
    const [optimisticLikes, setOptmisticLikes] = useState(tour._count.likes);

    const handleLike = async () => {
        if (isLiking) return;
        if (!session) {
            redirect("/sign-in")
        } else {
            try {
                setIsLiking(true);
                setHasLiked((prev) => !prev);
                setOptmisticLikes((prev) => prev + (hasLiked ? -1 : 1));
                await toggleLike(tour.id);
            } catch (error) {
                setOptmisticLikes(tour._count.likes);
                setHasLiked(tour.likes.some((like) => like.userId === dbUserId));
            } finally {
                setIsLiking(false);
            }
        }
    };

    return (
        <div className='flex flex-row items-center'>
            <Button onClick={handleLike} variant={'ghost'} size={'icon'} className={`text-muted-foreground hover:bg-transparent dark:hover:bg-transparent rounded-full text-sm gap-2 cursor-pointer ${hasLiked ? "text-red-500 hover:text-red-600" : "hover:text-red-500"
                }`}>
                <HeartIcon className={`size-5 ${hasLiked ? "fill-red-500" : "fill-none"}`} />
            </Button>
            <span className='text-muted-foreground text-sm font-light'>{optimisticLikes}</span>
        </div>
    )
}

export default TourLike