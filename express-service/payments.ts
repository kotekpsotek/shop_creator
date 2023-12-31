/* Module is designed to handle payments throught stripe */
import { Router } from "express";
import Stripe from "stripe";
import { mUsers } from "./db";

const stripe = new Stripe(process.env.STRIPE_API_SECRET as string, {
    apiVersion: "2023-08-16"
})
const router = Router();

router.post("/connect-shop", async (req, res) => {
    const body = req.body;
    const ses = res.locals.appSes; // In this way because intialized express-session by call req.session create other session object in database duplicate in this already existing created durning login
    const userData = await mUsers.findOne({ uuid: ses.uuid });

    // Initialize connect
    if (userData) {
        if (!Object.entries(body).length) {
            let account_id: string;
            if (!userData.sid) {
                // Initialize account creation
                const accountC = await stripe.accounts.create({
                    type: 'standard',
                    email: userData.email as string,
                    metadata: {
                        uuid: ses.uuid as string
                    }
                });

                await mUsers.findByIdAndUpdate(userData._id, { $set: { sid: accountC.id } })

                account_id = accountC.id;
            }
            else account_id = userData.sid;

            // Create link -> is also use to refresh account when client gets "http://domain/preparation?return" link from stripe sp
            const accountLink = await stripe.accountLinks.create({
                account: account_id,
                refresh_url: 'http://localhost:5173/preparation?refresh',
                return_url: 'http://localhost:5173/preparation?return',
                type: 'account_onboarding',
            });
            
            // Send response
            res.status(200).json({ r_url: accountLink.url });
        }
        else if (body.verify) {
            try {
                // Verify user connected account
                const ac = await stripe.accounts.retrieve(userData.sid || "");

                // Send appropriate status code under influence whether user connected account
                res.sendStatus(ac.created ? 200 : 400);
            }
            catch (e) {
                res.sendStatus(400);
            }
        }
        else res.sendStatus(404);
    }
    else res.sendStatus(404);
});

router.post("/pay-basket", async (req, res) => {
    const { payment, address }: { payment: "blik" | "card", address: { voivideship: string, city: string } } = req.body;

    if (payment && address.city && address.voivideship) {
        // HERE can be payment handling but i wouldn't give somebody bussiness on my effort cost
    }

    res
        .status(200)
        .end();
})

export default router;
