'use client';
import Container from '@/components/Container';
import React, { useEffect } from 'react';
import { TourFirm } from '@/generated/prisma';
import { getAllTourFirm } from '@/actions/tour-firm-action';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { createNews } from '@/actions/news-action';
import toast from 'react-hot-toast';
import { LucideLoaderCircle } from 'lucide-react';

const AdmNews = () => {

    const [title, setTitle] = React.useState("");
    const [content, setContent] = React.useState("")
    const [tourFirm, setTourFirm] = React.useState<TourFirm[]>([]);
    const [tourFirmId, setTourFirmId] = React.useState("");
    const [isLoading, setIsLoading] = React.useState(false)
    const [isFetching, setIsFetching] = React.useState(false)

    useEffect(() => {
        const getTourFirm = async () => {
            try {
                setIsFetching(true)
                const responce = await getAllTourFirm()
                setTourFirm(responce as TourFirm[])
            } catch (error) {
                console.error("Не получилось загрузить турфирмы", error)
            } finally {
                setIsFetching(false)
            }
        }

        getTourFirm()
    }, []);

    const handleSelect = (value: string) => {
        setTourFirmId(value)
    }

    const handleAddNews = async () => {
        if (!title.trim()) return false;
        setIsLoading(true)

        try {
            const result = await createNews(title, content, tourFirmId)

            if (result?.success) {
                setTitle("")
                setContent("")
                setTourFirmId("")
                toast.success("Новость успешно добавлена")
            }
        } catch (error) {
            console.error("Не удалось добавить новость", error)
            toast.error("Не получилось опубликовать новость")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Container>
            <div className={'flex flex-col gap-4 items-center'}>
                <div className={'flex flex-col items-center w-3/4 gap-2'}>
                    <div className={'flex items-center justify-center w-full gap-2'}>
                        <Select onValueChange={handleSelect}>
                            <SelectTrigger className='cursor-pointer'>
                                <SelectValue placeholder="Выберите тур-фирму" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    {
                                        isFetching ? (
                                            <LucideLoaderCircle className={'animate-spin'} />
                                        ) : (
                                            tourFirm.map(item => (
                                                <SelectItem disabled={isLoading} key={item.id} value={item.id}>{item.name}</SelectItem>
                                            ))
                                        )
                                    }
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        <Input
                            placeholder={'Заглавие'}
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className={'max-w-md'}
                            disabled={isLoading}
                        />
                    </div>
                    <Textarea
                        placeholder={'Текст новости'}
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        disabled={isLoading}
                    />
                    <Button
                        onClick={handleAddNews}
                        disabled={isLoading || (!title.trim() || !content.trim() || !tourFirmId)}
                    >
                        {isLoading ? (
                            <LucideLoaderCircle className={'animate-spin'} />
                        ) : ("Опубликовать новость")}
                    </Button>
                </div>
            </div>
        </Container>
    )
}

export default AdmNews