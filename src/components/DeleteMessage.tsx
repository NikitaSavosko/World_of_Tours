'use client'
import React from 'react'
import { Loader2Icon, TrashIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import { Button } from './ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog';
import { deleteMessage } from '@/actions/message-action';

interface Props {
    messageId: string;
    userId: string;
}

const DeleteMessage = ({ messageId, userId }: Props) => {

    const [isDeleting, setIsDeleting] = React.useState(false)

    async function handleDelete() {
        setIsDeleting(true)

        try {
            const result = await deleteMessage(messageId, userId)

        } catch (error) {
            console.error("Не удалось удалить сообщение", error)
            toast.error("Не удалось удалить сообщение")
        } finally {
            setIsDeleting(false)
        }
    }

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant={'ghost'} size={'sm'} className='rounded-full text-foreground/20 hover:text-destructive'>
                    {isDeleting ? (
                        <Loader2Icon className='animate-spin' />
                    ) : (
                        <TrashIcon />
                    )}
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Вы точно хотите удалить сообщение?</AlertDialogTitle>
                    <AlertDialogDescription>Это действие не обратимо</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Назад</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleDelete}
                        className='bg-destructive hover:bg-destructive/70 dark:bg-red-500 dark:text-white dark:hover:bg-destructive'
                        disabled={isDeleting}
                    >Удалить</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default DeleteMessage