"use server";
export async function GetVariable( { name } ) {
    return process.env[name] || null;
}

export async function GetUsername() {
    return process.env.USERNAME || null;
}