"use client"
import React, { useState } from 'react'
import { Textarea } from './ui/textarea'
import { Button } from './ui/button'
import { LoaderCircle, SendHorizonalIcon } from 'lucide-react'
import { createComment, getPosts } from '@/actions/post-action'
import toast from 'react-hot-toast'

type Posts = Awaited<ReturnType<typeof getPosts>>
type Post = Posts[number]

const AddComments = ({ post }: { post: Post }) => {

    const [newComment, setNewComment] = useState("")
    const [isCommenting, setIsCommenting] = useState(false)

    const handleAddComment = async () => {
        if (!newComment.trim() || isCommenting) return;
        try {
            setIsCommenting(true)
            const result = await createComment(post.id, newComment)
            if (result?.success) {
                setNewComment("")
            }

        } catch (error) {
            toast.error("Не получилось опубликовать комментарий")

        } finally {
            setIsCommenting(false)
        }
    }

    return (
        <div className='flex flex-row items-end gap-2 w-full max-w-lg'>
            <Textarea
                placeholder='Напишите комментарий'
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className='resize-none'
            />
            <Button
                size={'icon'}
                disabled={!newComment.trim() || isCommenting}
                onClick={handleAddComment}>
                {isCommenting ? (
                    <LoaderCircle className='animate-spin' />
                ) : (
                    <SendHorizonalIcon />
                )}
            </Button>
        </div>
    )
}

export default AddComments