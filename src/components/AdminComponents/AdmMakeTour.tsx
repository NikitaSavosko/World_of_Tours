'use client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { format, setDefaultOptions } from 'date-fns'
import { ru } from 'date-fns/locale/ru';
import { CalendarIcon, LucideLoaderCircle, Plus } from 'lucide-react'
import React, { useEffect } from 'react'
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from '@/lib/utils'
import ImageUpload from '@/components/ImageUpload'
import Container from '@/components/Container'
import { TourFirm } from '@/generated/prisma'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { createTour } from '@/actions/tour-post-action'
import toast from 'react-hot-toast'
import { getAllTourFirm } from "@/actions/tour-firm-action";

setDefaultOptions({ locale: ru })

const AdmMakeTour = () => {

    const [startDate, setStartDate] = React.useState<Date>()
    const [endDate, setEndDate] = React.useState<Date>()
    const [showImagePicker, setShowImagePicker] = React.useState(false)
    const [imageUrl, setImageUrl] = React.useState<string | undefined>(undefined)
    const [title, setTitle] = React.useState("")
    const [content, setContent] = React.useState("")
    const [description, setDescription] = React.useState("")
    const [isPosting, setIsPosting] = React.useState(false)
    const [selectTourFirm, setSelectTourFirm] = React.useState("")
    const [tourFirm, setTourFirm] = React.useState<TourFirm[]>([])
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
        setSelectTourFirm(value)
    }

    const handleImageChange = (url: string | undefined) => {
        setImageUrl(url);
    };

    const handleAddTour = async () => {
        if (!title.trim() && !content.trim() && !imageUrl && !description.trim() && !startDate && !endDate) return;
        setIsPosting(true)

        try {
            const result = await createTour(selectTourFirm, title, content, description, startDate, endDate, imageUrl || undefined)

            setTitle("")
            setContent("")
            setDescription("")
            setImageUrl("")
            setShowImagePicker(false)
            setStartDate(undefined)
            setEndDate(undefined)

            toast.success("Тур успешно опубликован")

        } catch (error) {
            console.error("Не удалось опубликовать тур", error)
        } finally {
            setIsPosting(false)
        }
    }

    return (
        <div className='w-full flex flex-col'>
            <Container>
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
                                        <SelectItem disabled={isPosting} key={item.id} value={item.id}>{item.name}</SelectItem>
                                    ))
                                )
                            }
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </Container>
            <Container>
                <div className='flex flex-col gap-4 w-full max-w-md'>
                    <Input
                        placeholder='Название тура'
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                    <Input
                        placeholder='Подзаголовок тура'
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    />

                    <Button variant={'ghost'} size={'icon'} className='w-full' onClick={() => {
                        setShowImagePicker(!showImagePicker)
                    }}>
                        <Plus />
                        Добавить заглавное изображение
                    </Button>

                    {(showImagePicker || imageUrl) && (
                        <div className='flex flex-col gap-2'>
                            <ImageUpload
                                value={imageUrl}
                                onChange={handleImageChange}
                            />
                            <p className='text-sm text-foreground/40'>Изображение должно быть не больше 4 Мб.</p>
                        </div>
                    )}
                </div>
            </Container>
            <Container>
                <Textarea
                    placeholder='Описание тура'
                    className='min-h-[200px]'
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
            </Container>
            <Container>
                <div className="flex flex-row items-baseline-last gap-2 w-full">
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant={'outline'}
                                className={cn(
                                    "w-[240px] justify-start text-left font-normal",
                                    !startDate && "text-muted-foreground"
                                )}
                            >
                                <CalendarIcon />
                                {startDate ? format(startDate, "PPP") : <span>Выберите дату начала тура</span>}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className='w-auto p-0' align='start'>
                            <Calendar
                                mode='single'
                                selected={startDate}
                                onSelect={setStartDate}
                                initialFocus
                            />
                        </PopoverContent>
                    </Popover>
                    <span className='font-light'>|</span>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant={'outline'}
                                className={cn(
                                    "w-[240px] justify-start text-left font-normal",
                                    !endDate && "text-muted-foreground"
                                )}
                            >
                                <CalendarIcon />
                                {endDate ? format(endDate, "PPP") : <span>Выберите дату окончания тура</span>}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className='w-auto p-0' align='start'>
                            <Calendar
                                mode='single'
                                selected={endDate}
                                onSelect={setEndDate}
                                initialFocus
                            />
                        </PopoverContent>
                    </Popover>
                </div>
            </Container>
            <Container>
                <Button
                    disabled={isPosting || (!selectTourFirm || !title.trim() || !content.trim() || !description.trim() || !imageUrl || !startDate || !endDate)}
                    onClick={handleAddTour}
                >
                    {isPosting ? (
                        <LucideLoaderCircle className='animate-spin' />
                    ) : ("Создать тур")}
                </Button>
            </Container>
        </div>
    )
}

export default AdmMakeTour