import axios from "axios";

export type UploadImageProps = {
    image: Buffer;
    url: string;
    token: string;
};
export type Response = {
    detail: string;
    filename: string;
};
export type UploadResult = {
    isSuccess: true;
    response: Response;
} | {
    isSuccess: false;
    error: string;
}

export type UploadImage = (props: UploadImageProps) => Promise<UploadResult>;

export const uploadImage: UploadImage = async ({image, url, token}) => {
    console.log("Uploading image to", url);

    try {
        const response = await axios.post(url, image, {
            headers: {
                "Content-Type": "image/webp",
                "Authorization": "Bearer " + token,
            },
            timeout: 60000,
        });

        console.log("Image uploaded successfully:", response.data);
        return {
            isSuccess: true,
            response: response.data,
        };
    } catch (error: any) {
        console.error("Error uploading image:", error.message || error);
        return {
            isSuccess: false,
            error: error.message || error.toString(),
        }
    }
}
