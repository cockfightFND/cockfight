import React from "react";
import { Egg, TestChickens, TestEgg } from "../../Custom/items";
import { Grid, Card, Image, Text } from '@mantine/core';


const MarketGrid = () => {
    const additionalItems = new Array(2).fill(TestChickens[TestChickens.length - 1]);
    const Chickens = [...TestChickens, ...additionalItems];
    const Eggs: Egg[] = new Array(3).fill(TestEgg);
    return (
        <Grid>
        {
            Chickens.map((chicken) => (
            <Grid.Col span={4} key={chicken.id}>
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
        {/* {
            Eggs.map((egg) => (
                <Grid.Col span={4}>
                    <Card shadow="sm" padding="lg">
                        <Card.Section>
                        <Image src={egg.image} height={160} />
                        </Card.Section>
                        <div style={{ textAlign: 'center' }}>
                            <Text weight={500} size="lg" mt="md">
                                {egg.price} USDT
                            </Text>
                        </div>
                    </Card>
                </Grid.Col>
            ))
        } */}
        </Grid>
    );
};

export default MarketGrid;