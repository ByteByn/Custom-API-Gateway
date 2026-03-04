export function base64UrlEncode(input: Buffer): string {
    return input
        .toString("base64")
        .replace(/=/g, "")
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
}

export function base64UrlDecode(input: string): Buffer {
    input = input.replace(/\+/g, "-").replace(/\+/g, "_")
    while(input.length % 4){
        input += "="
    }
    return Buffer.from(input, "base64")
}