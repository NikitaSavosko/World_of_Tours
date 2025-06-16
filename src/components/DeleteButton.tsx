"use client"
import React from 'react'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog'
import { Button } from './ui/button'
import { Loader2Icon, TrashIcon } from 'lucide-react'

interface Props {
    isDeleting: boolean;
    onDelete: () => Promise<void>;
}

const DeleteButton = ({ isDeleting, onDelete }: Props) => {
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant={'ghost'} size={'icon'} className='rounded-full text-foreground/50 hover:text-destructive'>
                    {isDeleting ? (
                        <Loader2Icon className='animate-spin' />
                    ) : (
                        <TrashIcon />
                    )}
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Вы точно хотите удалить пост?</AlertDialogTitle>
                    <AlertDialogDescription>Это действие не обратимо</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Назад</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={onDelete}
                        className='bg-destructive hover:bg-destructive/70 dark:bg-red-500 dark:text-white dark:hover:bg-destructive'
                        disabled={isDeleting}
                    >Удалить</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default DeleteButton