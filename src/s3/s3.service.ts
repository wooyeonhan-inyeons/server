import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class S3Service {
  private readonly awsS3: AWS.S3;

  constructor() {
    this.awsS3 = new AWS.S3({
      accessKeyId: process.env.S3_ACCESS_KEY,
      secretAccessKey: process.env.S3_SECRET_KEY,
      region: process.env.S3_REGION,
    });
    console.log(process.env.S3_ACCESS_KEY);
  }

  async uploadFile(files: Express.Multer.File[]) {
    const url_list = [];
    await Promise.all(
      files.map(async (file: Express.Multer.File) => {
        const uploadResult = await this.awsS3
          .upload({
            Bucket: process.env.S3_BUCKET_NAME,
            Body: file.buffer,
            Key: `${uuidv4()}.${file.originalname.split('.').reverse()[0]}`,
          })
          .promise();
        url_list.push(uploadResult.Location);
      }),
    );

    return url_list;
  }
}
