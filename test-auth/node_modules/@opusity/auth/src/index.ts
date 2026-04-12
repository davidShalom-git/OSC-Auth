import { createLogout } from "./core/logout";
import { createLogin } from "./core/login";
import { createSignUp } from "./core/signUp";
import { protectRoute } from "./middleware/protect";
import { IAdapter } from "./adapters/IAdapter";
import { createMongoAdapter } from "./adapters/mongoAdapter";
import { createPostgresAdapter } from "./adapters/postgresAdapter";

export interface AuthConfig{
    adapter: IAdapter
}
export function createAuth(config: AuthConfig) {
    return {
        signUp: createSignUp(config.adapter),
        login: createLogin(config.adapter),
        logout: createLogout(config.adapter),
        protect: protectRoute(config.adapter) // ← add adapter here
    }
}

export { createMongoAdapter, createPostgresAdapter }