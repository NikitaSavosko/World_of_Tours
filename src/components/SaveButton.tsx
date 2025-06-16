'use client'
import React, { useState, useEffect } from 'react'
import { Button } from './ui/button';
import { BookmarkIcon } from 'lucide-react';
import { GetAllTourPosts, toggleSave } from '@/actions/tour-post-action';

type Tours = Awaited<ReturnType<typeof GetAllTourPosts>>
type Tour = Tours[number]

const SaveButton = ({ tour, userId }: { tour: Tour, userId: string | null }) => {

    const [isSaving, setIsSaving] = useState(false);
    const [hasSaved, setHasSaved] = useState(tour.savedBy.some((save) => save.user.id === userId));

    const handleSave = async () => {
        if (isSaving) return

        try {
            setIsSaving(true)
            setHasSaved((prev) => !prev)
            await toggleSave(tour.id)
        } catch (error) {
            setHasSaved(tour.savedBy.some((save) => save.user.id == userId))
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <div className='flex items-center'>
            <Button
                onClick={handleSave}
                variant={'ghost'}
                size={'icon'}
                disabled={isSaving || !userId}
                className={`text-muted-foreground hover:bg-transparent rounded-full text-sm gap-2 cursor-pointer dark:hover:bg-transparent ${hasSaved ? "text-primary hover:text-primary" : "hover:text-primary"}`}
            >
                <BookmarkIcon className={`size-5 ${hasSaved ? "fill-primary" : "fill-none"}`} />
            </Button>
            <span className='text-muted-foreground text-sm font-light'>
                {hasSaved ? "Сохранено" : "Сохранить"}
            </span>
        </div>
    )
}

export default SaveButton