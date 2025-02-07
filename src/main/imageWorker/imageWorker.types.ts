export type ImageMessage = {
    imageId: string;
    imageBuffer: Buffer;
    domain: string;
    apiToken: string;
    uploadPath: string;
};

export type uploadStatus = 'success' | 'error';

export type UploadResult<T extends uploadStatus = uploadStatus> = Readonly<
    {
        status: T;
        imageId: string;
    } & (T extends 'success'
        ? {
              imagePath: string;
          }
        : {
              error: string;
          })
>;
