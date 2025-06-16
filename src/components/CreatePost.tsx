"use client"
import React, { useState } from 'react'
import { Textarea } from './ui/textarea'
import ImageUpload from './ImageUpload'
import { Button } from './ui/button'
import { Image, LoaderCircle, SendHorizonal } from 'lucide-react'
import { createPost } from '@/actions/post-action'

const CreatePost = () => {
    const [isImageOpen, setIsImageOpen] = useState(false)
    const [content, setContent] = useState("")
    const [imageUrl, setImageUrl] = useState<string | undefined>(undefined)
    const [isPosting, setIsPosting] = useState(false)

    const handleImageChange = (url: string | undefined) => {
        setImageUrl(url);
    };

    const handleAddPost = async () => {
        if (!content.trim() && !imageUrl) return

        setIsPosting(true)
        try {
            const result = await createPost(content, imageUrl || undefined)
            if (result?.success) {
                setContent("")
                setImageUrl(undefined)
                setIsImageOpen(false)
            }
        } catch (error) {
            console.error("Не удалось создать пост:", error)
        } finally {
            setIsPosting(false)
        }
    }

    return (
        <div className='flex flex-col w-full max-w-xl gap-2 mx-auto p-4'>
            <div className='flex items-end gap-1'>
                <Textarea
                    placeholder='Напишите о чём думаете'
                    className='min-h-[100px] resize-none'
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    disabled={isPosting}
                />
                <div className='flex flex-col gap-1'>
                    <Button
                        variant={isImageOpen ? 'default' : 'outline'}
                        size={'icon'}
                        onClick={() => setIsImageOpen(!isImageOpen)}
                        disabled={isPosting}
                    >
                        <Image />
                    </Button>
                    <Button
                        size={'icon'}
                        onClick={handleAddPost}
                        disabled={isPosting || (!content.trim() && !imageUrl)}
                    >
                        {isPosting ? (
                            <LoaderCircle className='animate-spin' />
                        ) : (
                            <SendHorizonal />
                        )}
                    </Button>
                </div>
            </div>

            {(isImageOpen || imageUrl) && (
                <div className='flex w-full items-center justify-center'>
                    <ImageUpload
                        onChange={handleImageChange}
                        value={imageUrl}
                    />
                </div>
            )}
        </div>
    )
}

export default CreatePost