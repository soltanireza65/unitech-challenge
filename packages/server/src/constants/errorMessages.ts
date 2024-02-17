
type Entity = "User" | "Category" | "Email"

export const errorMessages = {
    notFound: (entity: Entity) => `${entity} not found`,
    alreadyExists: (entity: Entity) => `${entity} already exists`,
    userNotVerified: "User is not verified",
    invalidCredentials: "Invalid credentials",
    scoreCannotBeNegative: "Score cannot be negative"
}