import "dotenv/config";

const customConfig: {
  port: number;

  accessTokenExpiresIn: number;

  refreshTokenExpiresIn: number;

  origin: string;

  dbUri: string;

  accessTokenPrivateKey: string;

  accessTokenPublicKey: string;

  refreshTokenPrivateKey: string;

  refreshTokenPublicKey: string;
} = {
  port: process.env.PORT as unknown as number,

  accessTokenExpiresIn: 60,

  refreshTokenExpiresIn: 60,

  origin: process.env.ORIGIN as string,

  dbUri: process.env.MONGODB_URI as string,

  accessTokenPrivateKey: process.env
    .ACCESS_TOKEN_PRIVATE_KEY as unknown as string,

  accessTokenPublicKey: process.env
    .ACCESS_TOKEN_PUBLIC_KEY as unknown as string,

  refreshTokenPrivateKey: process.env
    .REFRESH_TOKEN_PRIVATE_KEY as unknown as string,

  refreshTokenPublicKey: process.env
    .REFRESH_TOKEN_PUBLIC_KEY as unknown as string,
};

export default customConfig;
