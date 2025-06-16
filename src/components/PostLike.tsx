"use client"
import { getPosts, togglePostLike } from '@/actions/post-action'
import React, { useState } from 'react'
import { Button } from './ui/button'
import { HeartIcon } from 'lucide-react'

type Posts = Awaited<ReturnType<typeof getPosts>>
type Post = Posts[number]

const PostLike = ({ userId, post }: { userId: string | null, post: Post }) => {

    const [isLiking, setIsLiking] = useState(false);
    const [hasLiked, setHasLiked] = useState(post.likes.some((like) => like.userId === userId));
    const [optimisticLikes, setOptmisticLikes] = useState(post._count.likes);

    const handleLike = async () => {
        if (isLiking) return;
        try {
            setIsLiking(true);
            setHasLiked((prev) => !prev);
            setOptmisticLikes((prev) => prev + (hasLiked ? -1 : 1));
            await togglePostLike(post.id)
        } catch (error) {
            setOptmisticLikes(post._count.likes);
            setHasLiked(post.likes.some((like) => like.userId === userId));
        } finally {
            setIsLiking(false);
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

export default PostLike