import {Button} from "@/components/ui/button";
import Link from "next/link";

const AdmToMain = () => {
    return (
        <Link href={'/'}>
            <Button
                variant={'outline'}
                className={'text-sm'}
            >
                Перейти на главную
            </Button>
        </Link>
    )
}

export default AdmToMain;