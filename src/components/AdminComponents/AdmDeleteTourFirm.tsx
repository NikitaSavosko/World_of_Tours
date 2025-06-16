"use client"
import { deleteTourFirm } from "@/actions/tour-firm-action";
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel,
    AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Loader2Icon, TrashIcon } from "lucide-react";
import React from "react";
import toast from "react-hot-toast";

interface Props {
    tourFirmId: string;
}

const AdmDeleteTourFirm = ({ tourFirmId }: Props) => {

    const [isDeleting, setIsDeleting] = React.useState(false)

    async function handleDelete() {
        setIsDeleting(true)

        try {
            const result = await deleteTourFirm(tourFirmId)

            if (result?.success) {
                toast.success("Турфирма успешно удалена")
            }
        } catch (error) {
            console.error("Не удалось удалить турфирму", error)
            toast.error("Не удалось удалить турфирму")
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
                    <AlertDialogTitle>Вы точно хотите удалить турфирму?</AlertDialogTitle>
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

export default AdmDeleteTourFirm