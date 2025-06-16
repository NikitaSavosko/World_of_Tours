"use client"
import React from 'react'
import { Card, CardContent, CardFooter, CardHeader } from './ui/card'
import BackButton from './BackButton';

interface Props {
    children: React.ReactNode;
    headerLabel: string;
    backButtonLabel: string;
    backButtonHref: string;
}

const CardWrapper = ({ children, headerLabel, backButtonHref, backButtonLabel }: Props) => {
    return (
        <Card className='w-full max-w-[400px]'>
            <CardHeader><h1 className='text-2xl font-bold'>{headerLabel}</h1></CardHeader>
            <CardContent>
                {children}

            </CardContent>
            <CardFooter>
                <BackButton
                    label={backButtonLabel}
                    href={backButtonHref}
                />
            </CardFooter>
        </Card>
    )
}

export default CardWrapper