import config from "@/lib/config";
import { getUploadAuthParams } from "@imagekit/next/server";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        if (!config.env.imagekit.privateKey || !config.env.imagekit.publickKey) {
            throw new Error("ImageKit credentials are not configured");
        }

        // Генерируем expire как текущее время + 30 минут (в секундах)
        const expire = Math.floor(Date.now() / 1000) + (30 * 60);

        const authParams = getUploadAuthParams({
            privateKey: config.env.imagekit.privateKey,
            publicKey: config.env.imagekit.publickKey,
            expire, // Передаем вычисленное значение
        });

        return NextResponse.json({
            token: authParams.token,
            expire: authParams.expire, // Используем expire из authParams
            signature: authParams.signature,
            publicKey: config.env.imagekit.publickKey,
        });
    } catch (error) {
        console.error("ImageKit auth error:", error);
        return NextResponse.json(
            {
                error: "Failed to generate upload credentials",
                details: error instanceof Error ? error.message : "Unknown error"
            },
            { status: 500 }
        );
    }
}