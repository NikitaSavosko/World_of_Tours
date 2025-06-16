"use client"
import React, { useState } from 'react'
import { Button } from './ui/button'
import { toggleFollow } from '@/actions/user-actions';
import toast from 'react-hot-toast';

interface Props {
    userId: string;
    isFollowing: boolean;
}

const SubscriptionButton = ({ userId, isFollowing: initialIsFollowing }: Props) => {

    const [isUpdatingFollow, setIsUpdatingFollow] = useState(false)
    const [isFollowing, setIsFollowing] = useState(initialIsFollowing)

    const handleFollow = async () => {
        if (!userId) return;

        try {
            setIsUpdatingFollow(true)
            await toggleFollow(userId)
            setIsUpdatingFollow(!isFollowing)
            setIsFollowing(!isFollowing)
        } catch (error) {
            toast.error("Не получилось подписаться на пользователя")

        } finally {
            setIsUpdatingFollow(false)
        }
    }

    return (
        <Button disabled={isUpdatingFollow} onClick={handleFollow} className='w-[150px] mx-auto'>
            {isFollowing ? "Отписаться" : "Подписаться"}
        </Button>
    )
}

export default SubscriptionButton