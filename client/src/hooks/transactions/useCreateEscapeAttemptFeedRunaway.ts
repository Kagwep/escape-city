import { Address,StringValue,NumericalValue,U64Type,U32Type } from "@multiversx/sdk-core/out"
import { getChainId } from "utils/getChainId"
import { refreshAccount } from "@multiversx/sdk-dapp/utils/account/refreshAccount"
import { sendTransactions } from "@multiversx/sdk-dapp/services/transactions/sendTransactions"
import { RouteNamesEnum } from "localConstants"
import { useGetAccount } from "@multiversx/sdk-dapp/hooks/account/useGetAccount"
import { smartContract } from "utils/smartContract"


export const useCreateEscapeAttemptFeedRunAway = () => {

    const { address} = useGetAccount();


    return async (distance: number, runaway_id:number) => {
        const runAwayTransaction = smartContract.methodsExplicit
        .create_escape_attempt_feed_runaway([new NumericalValue(new U64Type, BigInt(distance)),new NumericalValue(new U32Type, BigInt(runaway_id))])
        .withSender(new Address(address))
        .withValue('0')
        .withGasLimit(60000000)
        .withChainID(getChainId())
        .buildTransaction();

        await refreshAccount();

        await sendTransactions({
            transactions:[runAwayTransaction],
            transactionsDisplayInfo:{
                processingMessage: "Processing escape attempt creation and runaway feeding",
                errorMessage: "An error has occurred while creating escape and feeding the runaway",
                successMessage:"Escape Created and Runaway Fed!"
            },
            redirectAfterSign: false,
            callbackRoute: RouteNamesEnum.dashboard
        });
    }
}