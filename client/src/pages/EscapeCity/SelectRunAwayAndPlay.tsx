import React,{ useEffect, useState } from 'react';
import { Link, useLoaderData, useNavigation } from "react-router-dom";
import { Modal, RunAwayItem } from "components/Views";
import { useGetTokensOfOwner, useGetRunAway, useCreateEscapeAttemptFeedRunAway,useSendRunAway, useGetAccountInfo } from 'hooks';
import { TypedValue } from '@multiversx/sdk-core/out';
import { RunAwayType } from 'utils/EscapeCityTypes';
import { EscapeCity } from './EscapeCity';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { AuthRedirectWrapper } from 'wrappers';
import { faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button } from 'components/Button';


interface PropTypes {}

export const RunAways: React.FC<PropTypes> = () => {

  const[tokensOfOwner, setTokensOfOwner] = useState<TypedValue | undefined>();
  const[ownerRunAways, setOwnerRunAways] = useState([])
  const [loading, setLoading] = useState(false)
  const [selectedRunawayId, setSelectedRunawayId] = useState<number | null>(null);
  const [distanceCovered, setDistanceCovered] = useState(0);
  const [gameOver, setGameOver] = useState(false); 
  const [showModal, setShowModal] = useState(false);
  const [hasRunaways, setHasRunAways] = useState(false)
  const { websocketEvent } = useGetAccountInfo()

  const getTokens = useGetTokensOfOwner();
  const getRunAway = useGetRunAway();
  const createEscapeAndFeedRunAway = useCreateEscapeAttemptFeedRunAway();
  const sendRunaway = useSendRunAway();


  const CreateRunaway = async (distance:number, runaway_id:number) =>{
   if(window.confirm('Game Over Proceed to create escape attempt and feed Runaway')){
     await createEscapeAndFeedRunAway(distance,runaway_id);
    }
  }

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
    },[websocketEvent])

    const handleSelectRunaway = (id: number) => {
      setSelectedRunawayId(id);
    };
  
    const handleDistanceCovered = (distance: number) => {
      setDistanceCovered(distance);
      setGameOver(true);
      setShowModal(true); // Show the modal on game over
    };
  
    const handleModalConfirm = async () => {
      setShowModal(false);
      if (selectedRunawayId !== null) {
        await createEscapeAndFeedRunAway(distanceCovered, selectedRunawayId);
      }
    };
  
    const handleModalCancel = () => {
      setShowModal(false);
    };



    return (
      <>
      <AuthRedirectWrapper>
        <TransitionGroup>
          {selectedRunawayId !== null && !gameOver ? (
            <CSSTransition key="escapeCity" timeout={500} classNames="fade">
              <EscapeCity runaway_id={selectedRunawayId} onSetDistanceCovered={handleDistanceCovered} />
            </CSSTransition>
          ) : (
            <CSSTransition key="runAways" timeout={500} classNames="fade">
              <div className="container mx-auto">
                <div className="text-sm breadcrumbs p-2">
                  <ul>
                    <li>
                      <Link to="/" className="link text-slate-100">
                        Home
                      </Link>
                    </li>
                    <li className='text-green-500'>RunAways</li>
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
                          <RunAwayItem runaway={runaway} key={index} onSelectRunaway={handleSelectRunaway} />
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
          )}
        </TransitionGroup>
        {showModal && (
          <Modal
            title="Game Over"
            message={`You covered ${distanceCovered} kilometers. Proceed to create escape attempt and feed runaway?`}
            onConfirm={handleModalConfirm}
            onCancel={handleModalCancel}
          />
        )}
        </AuthRedirectWrapper>
      </>
    );
  };
