import connectDB from "@/config/database";
import Notification from "@/models/Notification";
import User from "@/models/User";
import { getSessionUser } from "@/utils/getSessionUser";
import mongoose from 'mongoose';

export const POST = async (request, response) => {
    try {
        const session =await getSessionUser();
        console.log(session)

        if (!session ||
            !session.user ||
            !session.user.id ||
            session.user.id !== '664da6fa0a207e01f76dfa25') {
            console.log(session.user.id)
            return new Response(JSON.stringify({
                message: 'Unauthorized', ok: false
            }), { status: 401 });
        }

        const { id, message } = await request.json();
        if (!id || !message) {
            return new Response(JSON.stringify({ message: 'Fill all the fields', ok: false }), { status: 400 });
        }

        await connectDB();

        const mongoSession = await mongoose.startSession();
        mongoSession.startTransaction();

        try {
            let users = [];
            if (id !== 'all') {
                const user = await User.findById(id).session(mongoSession);
                if (!user) {
                    await mongoSession.abortTransaction();
                    mongoSession.endSession();
                    return new Response(JSON.stringify({ message: 'No such user exists', ok: false }), { status: 400 });
                }
                users.push(user);
            } else {
                users = await User.find({}).session(mongoSession);
            }

            for (const user of users) {
                const notification = new Notification({
                    sender: '664da6fa0a207e01f76dfa25',
                    receiver: user._id,
                    body: message,
                    toAdmin: false,
                });
                await notification.save({ session: mongoSession });
            }

            await mongoSession.commitTransaction();
            mongoSession.endSession();

            return new Response(JSON.stringify({ message: 'Notifications sent successfully', ok: true }), { status: 200 });

        } catch (error) {
            await mongoSession.abortTransaction();
            mongoSession.endSession();
            console.log(error);
            return new Response(JSON.stringify({ message: 'Could not send notification', ok: false }), { status: 500 });
        }
        finally{
            mongoSession.endSession()
        }

    } catch (error) {
        console.log(error);
        return new Response(JSON.stringify({ message: 'Could not send notification', ok: false }), { status: 500 });
    }
}
