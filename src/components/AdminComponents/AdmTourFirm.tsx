"use client"
import Container from "@/components/Container";
import { Input } from "@/components/ui/input";
import React, { useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { LucideLoaderCircle } from "lucide-react";
import { createTourFirm, getAllTourFirm, updateTourFirm } from "@/actions/tour-firm-action";
import toast from "react-hot-toast";
import { TourFirm } from "@/generated/prisma";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const AdmTourFirm = () => {

    const [title, setTitle] = React.useState("")
    const [description, setDescription] = React.useState("")
    const [isLoading, setIsLoading] = React.useState(false)
    const [newTitle, setNewTitle] = React.useState("")
    const [newDescription, setNewDescription] = React.useState("")
    const [selectTourFirm, setSelectTourFirm] = React.useState("")
    const [tourFirm, setTourFirm] = React.useState<TourFirm[]>([])

    const getTourFirm = async () => {
        try {
            const responce = await getAllTourFirm()
            setTourFirm(responce as TourFirm[])

        } catch (error) {
            console.error("Не удалось получить турфирмы", error)
        }
    }

    useEffect(() => {
        getTourFirm()
    }, [])

    const handleSelect = (value: string) => {
        setSelectTourFirm(value)
    }

    async function handleAddTourFirm() {
        setIsLoading(true)

        try {
            if (!title.trim() || !description.trim()) return false;
            const result = await createTourFirm(title, description)

            if (result?.success) {
                setTitle("")
                setDescription("")
                toast.success("Турфирма добавлена")
            }
        } catch (e) {
            console.error("Не получилось добавить турфирму", e)
        } finally {
            setIsLoading(false)
        }
    }

    async function handleUpdateTourFirm() {
        setIsLoading(true)

        try {
            const result = await updateTourFirm(selectTourFirm, newTitle, newDescription)

            if (result?.success) {
                setNewTitle('')
                setNewDescription('')
                setSelectTourFirm('')
                toast.success("Турфирма успешно обновлена")
            }

        } catch (error) {
            console.error("Не получилось обновить турфирму", error)
        } finally {
            setIsLoading(false)
        }
    }


    return (
        <div className='w-full'>
            <Container>
                <div className={'flex items-center flex-col gap-4'}>
                    <h1 className={'text-2xl font-bold text-center'}>Добавить турфирму</h1>
                    <div className={'flex w-1/2 flex-col gap-4'}>
                        <Input
                            placeholder={'Название турфирмы'}
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            disabled={isLoading}
                        />
                        <Textarea
                            placeholder={'Описание турфирмы'}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            disabled={isLoading}
                        />

                        <Button
                            disabled={isLoading || !title.trim()}
                            onClick={handleAddTourFirm}
                        >
                            {
                                isLoading ? (
                                    <LucideLoaderCircle className={'animate-spin'} />
                                ) : ("Добавить турфирму")
                            }
                        </Button>
                    </div>
                </div>
            </Container>
            <Container>
                <div className={'flex items-center flex-col gap-4'}>
                    <h1 className={'text-2xl font-bold'}>Обновить существующую турфирму</h1>
                    <div className={'flex w-1/2 items-center justify-center gap-2'}>
                        <Select onValueChange={handleSelect}>
                            <SelectTrigger className='cursor-pointer'>
                                <SelectValue placeholder="Выберите турфирму" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    {
                                        tourFirm.map(item => (
                                            <SelectItem key={item.id} value={item.id}>{item.name}</SelectItem>
                                        ))
                                    }
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        <Input
                            placeholder={'Название'}
                            value={newTitle}
                            onChange={(e) => setNewTitle(e.target.value)}
                            disabled={isLoading}
                            className={'max-w-lg'}
                        />
                    </div>
                    <div className={'flex w-1/2 items-start gap-4'}>
                        <Textarea
                            placeholder={'Описание'}
                            value={newDescription}
                            onChange={(e) => setNewDescription(e.target.value)}
                            disabled={isLoading}
                            className={'w-full'}
                        />
                    </div>
                    <Button
                        onClick={handleUpdateTourFirm}
                        disabled={isLoading || !newTitle.trim()}
                    >
                        {
                            isLoading ? (
                                <LucideLoaderCircle className={'animate-spin'} />
                            ) : ("Обновить турфирму")
                        }
                    </Button>
                </div>
            </Container>
        </div>
    )
}

export default AdmTourFirm