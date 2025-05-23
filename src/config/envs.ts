import 'dotenv/config';
import * as joi from 'joi';

interface EnvVars{
    PORT_AUTH: number;
    DATABASE_URL_AUTH:string;
    JWT_SECRET: string;
}

const envsSchema = joi.object({
    PORT_AUTH: joi.number().required(),
    DATABASE_URL_AUTH: joi.string().required(),
    JWT_SECRET: joi.string().required(),
})
.unknown(true);

const {error, value} = envsSchema.validate(process.env);

if(error){
    throw new Error(`Config validation error: ${error.message}`);
}

const EnvVars: EnvVars = value;

export const envs = {
    port_auth: EnvVars.PORT_AUTH,
    databaseUrlAuth: EnvVars.DATABASE_URL_AUTH,
    jwtSecret: EnvVars.JWT_SECRET
}
