import { Address,StringValue } from "@multiversx/sdk-core/out"
import { getChainId } from "utils/getChainId"
import { refreshAccount } from "@multiversx/sdk-dapp/utils/account/refreshAccount"
import { sendTransactions } from "@multiversx/sdk-dapp/services/transactions/sendTransactions"
import { RouteNamesEnum } from "localConstants"
import { useGetAccount } from "@multiversx/sdk-dapp/hooks/account/useGetAccount"
import { smartContract } from "utils/smartContract"


export const useSendRunAway = () => {

    const { address} = useGetAccount();


    return async (runAwayName: string) => {
        const runAwayTransaction = smartContract.methodsExplicit
        .create_new_runaway([new StringValue(runAwayName)])
        .withSender(new Address(address))
        .withValue('0')
        .withGasLimit(60000000)
        .withChainID(getChainId())
        .buildTransaction();

        await refreshAccount();

        await sendTransactions({
            transactions:[runAwayTransaction],
            transactionsDisplayInfo:{
                processingMessage: "Processing runaway Creation",
                errorMessage: "An error has occurred while creating the runaway",
                successMessage:"Runaway Created!"
            },
            redirectAfterSign: false,
            callbackRoute: RouteNamesEnum.dashboard
        });
    }
}