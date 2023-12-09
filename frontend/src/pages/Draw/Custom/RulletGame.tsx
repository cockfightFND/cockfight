// import React, { useRef, useEffect } from 'react';
// import { Button } from '@mantine/core';

// const RouletteWheel = () => {
//   const canvasRef = useRef(null);
//   const segments = ['상품 A', '상품 B', '상품 C', '상품 D', '상품 E', '상품 F']; // 룰렛 세그먼트

//   const drawRouletteWheel = () => {
//     const canvas = canvasRef.current;
//     const ctx = canvas.getContext('2d');
//     const numSegments = segments.length;
//     const angle = 2 * Math.PI / numSegments;
//     const centerX = canvas.width / 2;
//     const centerY = canvas.height / 2;
//     const radius = Math.min(centerX, centerY);

//     segments.forEach((text, index) => {
//       ctx.beginPath();
//       ctx.moveTo(centerX, centerY);
//       ctx.arc(centerX, centerY, radius, angle * index, angle * (index + 1));
//       ctx.closePath();

//       ctx.fillStyle = index % 2 === 0 ? '#FFC0CB' : '#ADD8E6'; // 색상 변경
//       ctx.fill();

//       // 텍스트 추가 (옵션)
//       ctx.save();
//       ctx.translate(centerX, centerY);
//       ctx.rotate(angle * index + angle / 2);
//       ctx.textAlign = 'right';
//       ctx.fillStyle = '#000';
//       ctx.fillText(text, radius - 10, 0);
//       ctx.restore();
//     });
//   };

//   useEffect(() => {
//     drawRouletteWheel();
//   }, []);

//   const spinWheel = () => {
//     const canvas = canvasRef.current;
//     const ctx = canvas.getContext('2d');
//     ctx.clearRect(0, 0, canvas.width, canvas.height);

//     // 회전 애니메이션 로직
//     // ...
//   };

//   return (
//     <div>
//       <canvas ref={canvasRef} width={300} height={300} style={{ border: '1px solid #ccc' }} />
//       <Button onClick={spinWheel} style={{ marginTop: '10px' }}>룰렛 돌리기</Button>
//     </div>
//   );
// };

// export default RouletteWheel;