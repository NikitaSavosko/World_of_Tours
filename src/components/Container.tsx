import React from 'react'

interface Props {
    children?: React.ReactNode;
}

const Container = ({ children }: Props) => {
    return (
        <div className='w-full border-b border-dashed'>
            <div className='container-wrapper'>
                <div className='container-pad'>
                    {children}
                </div>
            </div>
        </div>
    )
}

export default Container