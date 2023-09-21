/* Module is designed to handle payments throught stripe */
import { Router } from "express";
import Stripe from "stripe";
import { mUsers } from "./db";

const stripe = new Stripe(process.env.STRIPE_API_SECRET as string, {
    apiVersion: "2023-08-16"
})
const router = Router()

router.post("/connect-shop", async (req, res) => {
    const body = req.body;
    const userData = await mUsers.findOne({ uuid: req.session.uuid });

    // Initialize connect
    if (userData) {
        if (!Object.entries(body).length) {
            let account_id: string;
            if (!userData.stripe_account_id) {
                // Initialize account creation
                const account = await stripe.accounts.create({
                    type: 'standard',
                    email: userData.email as string,
                    metadata: {
                        uuid: req.session.uuid as string
                    }
                });
    
                // Save account id in db
                const sO = await mUsers.updateOne({ uuid: req.session.uuid }, { 
                    $set: {
                        stripe_account_id: account.id
                    } 
                });

                account_id = account.id
            }
            else account_id = userData.stripe_account_id;

            // Create link
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
            // Verify user connected account
            const ac = await stripe.accounts.retrieve(userData.stripe_account_id);

            // Send appropriate status code under influence whether user connected account
            res.sendStatus(ac.created ? 200 : 400);
        };
    }
    else res.sendStatus(404);
});

export default router;
