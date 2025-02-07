import axios from 'axios';

export type DownloadImageProps = {
    url: string;
    token: string;
};

export type DownloadResult =
    | {
          isSuccess: true;
          image: Buffer;
      }
    | {
          isSuccess: false;
          error: string;
      };

export const downloadImage = async ({
    url,
    token,
}: DownloadImageProps): Promise<DownloadResult> => {
    console.log('Downloading image from', url);

    try {
        const response = await axios.get(url, {
            headers: {
                Authorization: 'Bearer ' + token,
            },
            responseType: 'arraybuffer',
            timeout: 20000,
        });
        console.log(
            `Downloaded image from ${url}:\nresponse: ${response.status}, ${response.statusText}`,
        );

        return { isSuccess: true, image: Buffer.from(response.data, 'binary') };
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.error('Error downloading image:', error.message || error);

        return { isSuccess: false, error: error.message || error.toString() };
    }
};
