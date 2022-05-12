import * as AWS from "aws-sdk";
import { ReadStream } from "fs";

//AWS login
AWS.config.update({
  credentials: {
    accessKeyId: process.env.AWS_KEY,
    secretAccessKey: process.env.AWS_SECRET,
  },
});

export const uploadToS3 = async (
  file: any,
  userId: number,
  folderName?: string
) => {
  const { filename, createReadStream } = await file;
  const readStream: ReadStream = createReadStream();
  const objectName = `${folderName}/${userId} - ${Date.now()} - ${filename}`;

  const { Location } = await new AWS.S3()
    .upload({
      Body: readStream, //file Stream
      Bucket: "instaclone-photo-upload",
      Key: objectName,
      ACL: "public-read-write",
    })
    .promise();

  return Location;
};

const s3 = new AWS.S3();

export const deleteToS3 = async (fileUrl: any, folderName: string) => {
  const decodeUrl = decodeURI(fileUrl);
  const filePath = decodeUrl.split(folderName)[1];
  const fileName = `${folderName}${filePath}`;

  await s3
    .deleteObject({
      Bucket: "instaclone-photo-upload",
      Key: fileName,
    })
    .promise();
};

//fileUrl(encode) https://instaclone-photo-upload.s3.ap-northeast-2.amazonaws.com/uploads/1%20-%201652282383781%20-%20img_0.jpg

//decodeUrl https://instaclone-photo-upload.s3.ap-northeast-2.amazonaws.com/uploads/1 - 1652282383781 - img_0.jpg
