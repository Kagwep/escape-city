import { AddressValue, NumericalType, NumericalValue, ResultsParser, U32Type } from "@multiversx/sdk-core/out";
import { useGetAccount } from "@multiversx/sdk-dapp/hooks/account/useGetAccount";
import { useGetNetworkConfig } from "@multiversx/sdk-dapp/hooks/useGetNetworkConfig";
import { ProxyNetworkProvider } from "@multiversx/sdk-network-providers/out";
import { smartContract } from "utils/smartContract";
import {Address} from 'utils/sdkDappCore'

const resultsParser = new ResultsParser()


const GET_TOKENS_OF_OWNER = 'tokensOfOwner'

export const useGetTokensOfOwner = () => {

    const {address} = useGetAccount()
    const {network} = useGetNetworkConfig();
    
    return async () => {
        try{
            const query = smartContract.createQuery({
                func:GET_TOKENS_OF_OWNER,
                args:[new AddressValue(new Address(address))]
            });
            const provider = new ProxyNetworkProvider(network.apiAddress);
            const queryResponse = await provider.queryContract(query);
    
            const endpointDefination =  smartContract.getEndpoint(GET_TOKENS_OF_OWNER);
    
            const {firstValue} = resultsParser.parseQueryResponse(
                queryResponse,
                endpointDefination
            )

            const data = firstValue?.valueOf();
    
            console.log("from tokens of owner",firstValue?.valueOf())
            
            return data
    
        }catch(err){
            console.log(`unable to call ${GET_TOKENS_OF_OWNER} `, err)
        }
    }
}