import { NumericalType, NumericalValue, ResultsParser, U32Type } from "@multiversx/sdk-core/out";
import { useGetNetworkConfig } from "@multiversx/sdk-dapp/hooks/useGetNetworkConfig";
import { ProxyNetworkProvider } from "@multiversx/sdk-network-providers/out";
import { type } from "os";
import { smartContract } from "utils/smartContract";

const resultsParser = new ResultsParser()


const GET_RUNAWAY_BY_ID = 'getRunAwayById'

export const useGetRunAway = () => {

    const {network} = useGetNetworkConfig();
    
    return async (id:number) => {
        try{
            const query = smartContract.createQuery({
                func:GET_RUNAWAY_BY_ID,
                args:[new NumericalValue(new U32Type, BigInt(id))]
            });
            const provider = new ProxyNetworkProvider(network.apiAddress);
            const queryResponse = await provider.queryContract(query);
    
            const endpointDefination =  smartContract.getEndpoint(GET_RUNAWAY_BY_ID);
    
            const {firstValue} = resultsParser.parseQueryResponse(
                queryResponse,
                endpointDefination
            )
    
            console.log(firstValue)
            
            return firstValue
    
        }catch(err){
            console.log(`unable to call ${GET_RUNAWAY_BY_ID} `, err)
        }
    }
}