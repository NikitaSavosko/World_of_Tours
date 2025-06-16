"use client"
import React, { useState, useTransition } from 'react'
import { Button } from './ui/button'
import { Textarea } from './ui/textarea'
import { addReview } from '@/actions/tour-post-action'

interface Props {
    id: string;
}

const ReviewForm = ({ id }: Props) => {
    const [newReview, setNewReview] = useState("")
    const [isPosting, setIsPosting] = useState(false)

    const handleAddReview = async () => {

        if (!newReview.trim()) return

        setIsPosting(true)
        try {
            const result = await addReview(newReview, id)
            if (result?.success) {
                setNewReview("")
                setIsPosting(false)
            }
        } catch (error) {
            console.error("Не получилось опубликовать комментарий")
        }
    }

    return (
        <div className='flex items-end w-full gap-1 max-md:flex-col max-md:items-start'>
            <Textarea
                value={newReview}
                onChange={(e) => setNewReview(e.target.value)}
                placeholder='Напишите отзыв'
                className='resize-none h-[120px]'
            />
            <Button
                onClick={handleAddReview}
                disabled={!newReview.trim() || isPosting}
            >
                Отправить
            </Button>
        </div>
    )
}

export default ReviewForm