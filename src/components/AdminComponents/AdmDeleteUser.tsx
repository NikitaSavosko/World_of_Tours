"use client"
import { deleteUser } from '@/actions/user-actions'
import React from 'react'
import toast from 'react-hot-toast'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../ui/alert-dialog'
import { Button } from '../ui/button'
import { Loader2Icon, TrashIcon } from 'lucide-react'

interface Props {
    id: string
}

const AdmDeleteUser = ({ id }: Props) => {
    const [isDeleting, setIsDeleting] = React.useState(false)

    async function handleDelete() {
        setIsDeleting(true)

        try {
            const result = await deleteUser(id)

            if (result?.success) {
                toast.success("Пользователь успешно удалён")
            }
        } catch (error) {
            console.error("Не удалось удалить пользователя", error)
            toast.error("Не удалось удалить пользователя")
        } finally {
            setIsDeleting(false)
        }
    }

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
                    <AlertDialogTitle>Вы точно хотите удалить пользователя?</AlertDialogTitle>
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

export default AdmDeleteUser