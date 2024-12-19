
const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const uploadImageToS3 = async (file) => {
  const buffer = Buffer.from(file.replace(/^data:image\/\w+;base64,/, ''), 'base64');
  const mimeType = file.match(/data:(image\/\w+);base64,/)[1];
  const fileName = `${uuidv4()}.${mimeType.split('/')[1]}`;

  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: fileName,
    Body: buffer,
    ContentType: mimeType,
    ACL: 'public-read',
  };

  const upload = await s3.upload(params).promise();
  return upload.Location; 
};

module.exports = uploadImageToS3;
