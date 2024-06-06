import React,{ useEffect, useState } from 'react';
import { Link, useLoaderData, useNavigation } from "react-router-dom";
import { Modal, RunAwaysItem } from "components/Views";
import { useGetTokensOfOwner, useGetRunAway, useCreateEscapeAttemptFeedRunAway,useSendRunAway } from 'hooks';
import { TypedValue } from '@multiversx/sdk-core/out';
import { RunAwayType } from 'utils/EscapeCityTypes';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { AuthRedirectWrapper } from 'wrappers';
import { faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button } from 'components/Button';

interface PropTypes {}

export const RunAwaysManage: React.FC<PropTypes> = () => {

  const[tokensOfOwner, setTokensOfOwner] = useState<TypedValue | undefined>();
  const[ownerRunAways, setOwnerRunAways] = useState([])
  const [loading, setLoading] = useState(false)
  const [selectedRunawayId, setSelectedRunawayId] = useState<number | null>(null);
  const [approvedId, setAuctionApproveMultiplyRunawayId] = useState<number | null>(null);
  const [auctionRunawayId, setAuctionId] = useState<number | null>(null);
  const [distanceCovered, setDistanceCovered] = useState(0);
  const [gameOver, setGameOver] = useState(false); 
  const [showModal, setShowModal] = useState(false);
  const [hasRunaways, setHasRunAways] = useState(false)
  const [numberOfTokens, setNumberOfTokens] = useState(0)

  const getTokens = useGetTokensOfOwner();
  const getRunAway = useGetRunAway();
  const createEscapeAndFeedRunAway = useCreateEscapeAttemptFeedRunAway();
  const sendRunaway = useSendRunAway();


  const onCreateRunaway = async () =>{
    if(window.confirm('Create Runaway')){
      await sendRunaway("The test runaway");
     }
   }

  const fetchTokensOfOwner = async () =>{
      setLoading(true);
      const tokens: TypedValue | undefined = await getTokens();
      setTokensOfOwner(tokens);
      fetchRunAways(tokens as any || []);
  }

  const fetchRunAways = async (tokens: number[]) => {
    const runAways: RunAwayType[] = [];
    setNumberOfTokens(tokens.length)
    if(tokens.length >= 1){
      setHasRunAways(true)
    }
    for (const token of tokens) {
      try {
        const { trail_print, weight, experience, name } = await getRunAway(token);
        // Construct the RunAwayType object including the token as runaway_id
        const runaway: RunAwayType = {
          runaway_id: token,  // Use token as the runaway_id
          trail_print,
          weight,
          experience,
          name
        };
        runAways.push(runaway);
      } catch (error) {
        console.error(`Failed to fetch runaway for token ${token}:`, error);
      }
    }
    setOwnerRunAways(runAways as any);
    setLoading(false);
  };

    useEffect (() =>{
      fetchTokensOfOwner()
    },[])

    const handleSelectRunaway = (id: number) => {
      setSelectedRunawayId(id);
    };
  
    const handleSelectAuctionRunaway = (id: number) => {
      setAuctionId(id);
    };

    const handleSelectRunawayMultiply = (id: number) => {
      setAuctionApproveMultiplyRunawayId(id);
    };

    return (
      <>
      <AuthRedirectWrapper>
        <TransitionGroup>
        <CSSTransition key="runAways" timeout={500} classNames="fade">
              <div className="container mx-auto">
                <div className="text-sm breadcrumbs p-2">
                  <ul>
                    <li>
                      <Link to="/" className="link text-slate-100">
                        Home
                      </Link>
                    </li>
                    <li className='text-green-500'> Auction Buy and  sell Runaway tokens</li>
                    <li className='text-blue-500'> You Own <span className='text-green-700'>{numberOfTokens}</span> RunWays</li>
                  </ul>
                </div>
                <hr className="h-px bg-gray-300 border-0 dark:bg-gray-500 opacity-30" />
                {loading ? (
                  <div className="text-center text-blue-400">
                    Loading runaways...
                  </div>
                ) : (
                     
                  hasRunaways ? (
                    <div className="grid grid-cols-12 gap-6">
                    <div className="col-span-12 lg:col-span-9">
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 my-4 p-2 ">
                        {ownerRunAways.map((runaway, index) => (
                          <RunAwaysItem runaway={runaway} key={index} onSelectRunaway={handleSelectRunaway} onApproveMultiply={handleSelectRunawayMultiply} onAuction={handleSelectAuctionRunaway}/>
                        ))}
                      </div>
                    </div>
                  </div>
                  ) : (
                      <Button
                      onClick={onCreateRunaway}
                      data-testid='btnPingAbi'
                      data-cy='transactionBtn'
                      className='inline-block rounded-lg px-3 py-2 text-center hover:no-underline my-0 bg-cyan-600 text-white hover:bg-blue-700 mr-0 disabled:bg-gray-200 disabled:text-black disabled:cursor-not-allowed'
                        >
                        <FontAwesomeIcon icon={faArrowUp} className='mr-1' />
                      Create Runaway
                    </Button>
                  )
                )}
              </div>
            </CSSTransition>
        </TransitionGroup>

        </AuthRedirectWrapper>
      </>
    );
  };
