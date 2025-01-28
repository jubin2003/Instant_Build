import Lookup from "@/data/Lookup";
import React, { useContext, useState } from "react";
import { Button } from "../ui/button";
import { PayPalButtons } from "@paypal/react-paypal-js";
import { UserDetailContext } from "@/context/UserDetailContext";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Image from "next/image";
import { useSidebar } from "../ui/sidebar";

function PricingModel() {
  const { userDetail, setUserDetail } = useContext(UserDetailContext);
  const UpdateToken = useMutation(api.users.UpdateToken);
  const [selectedOption, setSelectedOption] = useState(null);
  const [alertOpen, setAlertOpen] = useState(false);
  const { toggleSidebar } = useSidebar(); // Sidebar toggling function

  const onPaymentSuccess = async () => {
    const token = userDetail?.token+Number(selectedOption?.value);
    console.log(token);

    if (isNaN(additionalTokens)) {
      console.error("Invalid token value from pricing option");
      return;
    }
    const newTokens = Math.max(currentTokens + additionalTokens, 0); // Ensure tokens stay valid
    // Update tokens in the database
    await UpdateToken({
      token: token,
      userId: userDetail?._id,
    });

    // Update user context with the new token value
    setUserDetail({
      ...userDetail,
      token: token,
    });
  };

  const onPurchaseClick = (pricing) => {
    if (!userDetail) {
      setAlertOpen(true); // Show alert dialog if no user is logged in
      return;
    }
    setSelectedOption(pricing); // Set selected pricing option for PayPal
  };

  return (
    <div>
      {/* Profile Image for Sidebar Toggle */}
      {userDetail && (
        <div className="fixed bottom-5 left-5 z-50">
          <Image
            src={userDetail.picture}
            className="rounded-full cursor-pointer"
            onClick={toggleSidebar}
            alt="user-profile"
            width={35}
            height={35}
          />
        </div>
      )}

      {/* Alert Dialog */}
      <Dialog open={alertOpen} onOpenChange={setAlertOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Insufficient Tokens</DialogTitle>
            <p className="text-gray-600">
              You need to purchase tokens to continue using this feature. Please
              select a plan and complete the payment.
            </p>
          </DialogHeader>
          <Button
            onClick={() => setAlertOpen(false)}
            className="bg-blue-500 text-white mt-4"
          >
            Got It
          </Button>
        </DialogContent>
      </Dialog>

      {/* Pricing Options */}
      <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {Lookup.PRICING_OPTIONS.map((pricing, index) => (
          <div
            className="border p-7 rounded-xl flex flex-col gap-3"
            key={index}
          >
            <h2 className="font-bold text-2xl">{pricing.name}</h2>
            <h2 className="font-medium text-lg">
              {pricing.tokens || 0} Tokens
            </h2>
            <p className="text-gray-400">{pricing.desc}</p>
            <h2 className="font-bold text-4xl text-center mt-5">
              Rs {pricing.price || 0}
            </h2>
            <PayPalButtons
              style={{ layout: "horizontal" }}
              onClick={() => onPurchaseClick(pricing)}
              onApprove={() => onPaymentSuccess()}
              onCancel={() => console.log("Payment cancelled")}
              disabled={!userDetail} // Disable PayPal buttons if no user is logged in
              createOrder={(data, actions) => {
                return actions.order.create({
                  purchase_units: [
                    {
                      amount: {
                        value: pricing.price || "0.00", // Ensure price is always a valid number
                        currency_code: "USD",
                      },
                    },
                  ],
                });
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default PricingModel;
