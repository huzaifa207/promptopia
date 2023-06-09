import { connectDB } from "@utils/database"
import User from "@models/user"

export const GET = async (req, {params}) => {
    try {
        await connectDB()
        console.log(params.email);

        const user = await User.findOne({email: params.email})

        return new Response(JSON.stringify(user), {status: 200})
    } catch (e) {
        return new Response("Failed to fetch user!", {status: 500})
    }
}