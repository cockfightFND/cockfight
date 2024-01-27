import React, { useContext, useEffect, useState } from "react";
import { Egg, TestChickens, TestEgg } from "../../Custom/items";
import { Grid, Card, Image, Text } from '@mantine/core';
import Modal from './MarketModal'; 
import { useSetRecoilState } from "recoil";
import { isBuyState } from "../../../app/hooks";
const MarketGrid = () => {
    const additionalItems = new Array(2).fill(TestChickens[TestChickens.length - 1]);
    const Chickens = [...TestChickens, ...additionalItems];
    const [showModal, setShowModal] = useState(false);
    const setIsBuyState = useSetRecoilState(isBuyState)

    const handleCardClick = () => {
        setIsBuyState(true)
        setShowModal(true);
        console.log('buy:', isBuyState)
    };

    const handleCloseModal = () => {
        setIsBuyState(false)
        console.log('buy:', isBuyState)
        setShowModal(false);
    };

    // useEffect(() => {
    //     setIsBuyState(height)
    //     return () => setIsBuyState(0)
    //   }, [setIsBuyState])

    return (
        <>
            <Grid>
            {
                Chickens.map((chicken) => (
                <Grid.Col span={4} key={chicken.id} onClick={handleCardClick}>
                <Card shadow="sm" padding="lg">
                    <Card.Section>
                    <Image src={chicken.image} alt={chicken.name} height={160} />
                    </Card.Section>
                    <div style={{ textAlign: 'center' }}>
                        <Text weight={400} size="md">
                            {chicken.name}
                        </Text>
                    </div>
                </Card>
                </Grid.Col>
                ))
            }
            </Grid>
            {showModal && <Modal onClose={handleCloseModal} />}
        </>
    );
};

export default MarketGrid;

// const Eggs: Egg[] = new Array(3).fill(TestEgg);
// {/* {
//             Eggs.map((egg) => (
//                 <Grid.Col span={4}>
//                     <Card shadow="sm" padding="lg">
//                         <Card.Section>
//                         <Image src={egg.image} height={160} />
//                         </Card.Section>
//                         <div style={{ textAlign: 'center' }}>
//                             <Text weight={500} size="lg" mt="md">
//                                 {egg.price} USDT
//                             </Text>
//                         </div>
//                     </Card>
//                 </Grid.Col>
//             ))
// } */}