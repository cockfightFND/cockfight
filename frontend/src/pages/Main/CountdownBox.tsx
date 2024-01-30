import React, { useState, useEffect } from 'react';
import { Box, Text } from '@mantine/core';

const CountdownBox = ({ targetTime }: { targetTime: string }) => {
    const [timeLeft, setTimeLeft] = useState('');

    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date();
            const target = new Date(targetTime);
            if (isNaN(target.getTime())) return
    
            const difference = target.getTime() - now.getTime();

            if (difference <= 0) {
                clearInterval(interval);
                setTimeLeft('Time is up!');
            } else {
                const days = Math.floor(difference / (1000 * 60 * 60 * 24));
                const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
                const minutes = Math.floor((difference / 1000 / 60) % 60);
                const seconds = Math.floor((difference / 1000) % 60);

                setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [targetTime]);

    return (
        <Box
            sx={{ 
                padding: '20px',
                borderRadius: '12px',
                backgroundColor: '#f0f4f8', // Light background color
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // Subtle shadow for depth
                textAlign: 'center',
                margin: '20px',
                border: '1px solid #d0d7de', // Adding a border
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100px', // Minimum height for better visual
                fontSize: '1.5rem', // Larger font size
                color: '#333', // Darker text color for contrast
            }}
        >
            <Text style={{ fontSize: '0.8rem', color: '#666' }}>Next Egg Time</Text> {/* Small-sized text */}
            <Text style={{ fontWeight: 'bold' }}>{timeLeft}</Text>
        </Box>
    );
};

export default CountdownBox;
