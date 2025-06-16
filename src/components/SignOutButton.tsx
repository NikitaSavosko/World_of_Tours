"use client"
import React from 'react'
import { Button } from './ui/button'
import { signOut } from "next-auth/react"
import { LogOut } from 'lucide-react'

const SignOutButton = () => {

    const handleSignOut = async () => {
        await signOut();
    }

    return (
        <Button
            onClick={handleSignOut}
            variant={'ghost'}
            size={'icon'}
        >
            <LogOut />
        </Button>
    )
}

export default SignOutButton