"use client"
import React, { useState, useTransition } from 'react'
import CardWrapper from './CardWrapper'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { signInSchema } from '@/lib/validations'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { login } from '@/actions/logIn'
import AuthError from './AuthError'

const LogInForm = () => {

    const [error, setError] = useState<string | undefined>("")

    const [isPending, startTransition] = useTransition()

    const form = useForm<z.infer<typeof signInSchema>>({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            email: "",
            password: "",
        }
    })

    const onSubmit = (values: z.infer<typeof signInSchema>): void => {

        setError("")

        startTransition(() => {
            login(values)
                .then((data) => {
                    setError(data?.error);
                })
        })
    }

    return (
        <CardWrapper headerLabel={'Вход'} backButtonLabel={'Нет аккаунта? Зарегистрируйся'} backButtonHref={'/sign-up'}>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
                    <div className='space-y-4'>
                        <FormField
                            control={form.control}
                            name='email'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input
                                            disabled={isPending}
                                            {...field}
                                            type='email' />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name='password'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Пароль</FormLabel>
                                    <FormControl>
                                        <Input
                                            disabled={isPending}
                                            {...field}
                                            type='password' />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <AuthError message={error} />
                    <Button disabled={isPending} type='submit' className='w-full'>Войти</Button>
                </form>
            </Form>
        </CardWrapper>
    )
}

export default LogInForm