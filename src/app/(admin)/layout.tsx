import AdmHeader from "@/components/AdminComponents/AdmHeader";
import config from "@/lib/config";
import { ImageKitProvider } from "@imagekit/next";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <ImageKitProvider urlEndpoint={config.env.imagekit.urlEndpoint}>
            <main >
                <AdmHeader />
                {children}
            </main>
        </ImageKitProvider>
    );
}
