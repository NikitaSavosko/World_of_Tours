import React, { ReactNode } from 'react'

const Layout = ({ children }: { children: ReactNode }) => {
    return (
        <main className='w-full h-full'>
            <div className='h-full min-h-screen flex items-center justify-center'>
                <div className='w-full max-w-sm'>
                    {children}
                </div>
            </div>
        </main>
    )
}

export default Layout