'use client'
import React, { useState } from 'react'
import { Button } from './ui/button'
import { LoaderCircleIcon, PencilIcon } from 'lucide-react'
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog'
import ImageUpload from './ImageUpload'
import { updateProfile } from '@/actions/user-actions'
import toast from 'react-hot-toast'

interface Props {
    id: string;
}

const ChangeAvatar = ({ id }: Props) => {

    const [imageUrl, setImageUrl] = useState<string | undefined>(undefined)
    const [isUploading, setIsUploading] = useState(false)

    const handleImageChange = (url: string | undefined) => {
        setImageUrl(url);
    };

    const handleChangeProfile = async () => {
        if (!imageUrl) return;
        setIsUploading(true)

        try {
            const result = await updateProfile(imageUrl, id)
            if (result.success) {
                toast.success("Профиль обновился")
            }
        } catch (error) {
            console.error("Не удалось обновить профиль", error)
            toast.error("Не удалось обновить профиль")
        } finally {
            setIsUploading(false)
        }
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant={'ghost'} size={'icon'} className='rounded-full'>
                    <PencilIcon />
                </Button>
            </DialogTrigger>
            <DialogContent className='p-4'>
                <DialogHeader>
                    <DialogTitle>Сменить фото аккаунта</DialogTitle>
                </DialogHeader>
                <ImageUpload onChange={handleImageChange} value={imageUrl} />
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant={'outline'}>
                            Закрыть
                        </Button>
                    </DialogClose>
                    <Button disabled={isUploading} onClick={handleChangeProfile}>
                        {isUploading ? (
                            <LoaderCircleIcon className='animate-spin' />
                        ) : (
                            <p>Сменить фото</p>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default ChangeAvatar