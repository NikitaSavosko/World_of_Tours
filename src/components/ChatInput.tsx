'use client'
import React from 'react'
import { LoaderCircleIcon, SendHorizonal } from 'lucide-react'
import { createMessage } from '@/actions/message-action'
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';

interface Props {
    senderId: string;
    getterId: string;
}

const ChatInput = ({ senderId, getterId }: Props) => {
    const [isSending, setIsSending] = React.useState(false)
    const [content, setContent] = React.useState("")
    const textareaRef = React.useRef<HTMLTextAreaElement>(null)

    async function handleSendMessage() {
        if (!content.trim()) return;

        setIsSending(true)
        try {
            await createMessage(senderId, getterId, content)
            setContent("")
            textareaRef.current?.focus()
        } finally {
            setIsSending(false)
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSendMessage()
        }
    }

    return (
        <div className="sticky bottom-0 bg-background pt-2 pb-4 px-4 border-t">
            <div className="flex gap-2 items-center max-w-4xl mx-auto">
                <Textarea
                    ref={textareaRef}
                    className="resize-none min-h-[40px] max-h-[60px] flex-1"
                    disabled={isSending}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Написать сообщение..."
                />
                <Button
                    className="h-10 w-10"
                    size="icon"
                    disabled={isSending || !content.trim()}
                    onClick={handleSendMessage}
                >
                    {isSending ? (
                        <LoaderCircleIcon className="animate-spin h-5 w-5" />
                    ) : (
                        <SendHorizonal className="h-5 w-5" />
                    )}
                </Button>
            </div>
        </div>
    )
}

export default ChatInput