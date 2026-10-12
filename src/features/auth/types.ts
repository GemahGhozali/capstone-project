import { getAuthenticatedUserData } from "./queries";

export type AuthenticatedUserData = Awaited<ReturnType<typeof getAuthenticatedUserData>>;
