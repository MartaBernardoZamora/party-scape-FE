import React, { useEffect, useState, useRef } from 'react';

import sueloImg from '../../assets/images/game1/bric.jpg';
import protaImg from '../../assets/images/game1/gizmo.jpg';
import maloImg from '../../assets/images/game1/stripe.jpg';
import caminoImg from '../../assets/images/game1/inter.png';
import puertaImg from '../../assets/images/game1/puerta.jpg';
import pista1 from '../../assets/images/game1/m.jpg';
import pista2 from '../../assets/images/game1/o.jpg';
import pista3 from '../../assets/images/game1/g.jpg';
import pista4 from '../../assets/images/game1/w.jpg';
import pista5 from '../../assets/images/game1/a.jpg';
import pista6 from '../../assets/images/game1/i.jpg';

function Game1(props) {    
    const [andado, setAndado] = useState([
        [1, 2, 0, 0, 0, 0, 0, 0, 0],
        [2, 0, 0, 0, 0, 0, 0, 0, 0],
        Array(9).fill(0),
        Array(9).fill(0),
        Array(9).fill(0),
        Array(9).fill(0),
        Array(9).fill(0),
        Array(9).fill(0),
        Array(9).fill(0),
      ]);
      const [images, setImages] = useState(null);
    
      useEffect(() => {
        const loadImages = (sources) => {
          const imgs = [];
          let loaded = 0;
          sources.forEach((src, i) => {
            const img = new Image();
            img.src = src;
            img.onload = () => {
              loaded++;
              if (loaded === sources.length) {
                setImages(imgs);
              }
            };
            imgs[i] = img;
          });
        };
    
        loadImages([
          sueloImg, protaImg, maloImg, caminoImg, puertaImg,
          pista1, pista2, pista3, pista4, pista5, pista6
        ]);
      }, []);
    
      useEffect(() => {
        if (!images || prueba !== 1 || !props.canvasRef.current) return;
    
        const canvas = props.canvasRef.current;
        const ctx = canvas.getContext('2d');
        const alto = 200;
        canvas.height = alto;
        canvas.width = alto;
        canvas.classList.remove('none');
    
        const cellSize = canvas.width / 9;
    
        const suelo = createPatternCanvas(images[0], cellSize);
        const prota = createPatternCanvas(images[1], cellSize);
        const camino = createPatternCanvas(images[3], cellSize);
        const puerta = createPatternCanvas(images[4], cellSize);
    
        const laberinto = [
          [0, 1, 1, 1, 1, 1, 1, 1, 1],
          [0, 0, 0, 1, 1, 1, 1, 1, 1],
          [1, 1, 0, 1, 0, 0, 0, 1, 1],
          [1, 1, 0, 1, 0, 1, 0, 1, 1],
          [1, 1, 0, 1, 0, 1, 0, 0, 1],
          [1, 1, 0, 0, 0, 1, 1, 0, 1],
          [1, 1, 1, 1, 1, 1, 1, 0, 1],
          [1, 1, 1, 1, 1, 1, 1, 0, 0],
          [1, 1, 1, 1, 1, 1, 1, 1, 0],
        ];
    
        drawLaberinto(ctx, cellSize, andado, suelo, prota, camino, puerta);
    
        const handleStart = (e) => {
          const canvas = props.canvasRef.current;
          if (!canvas) return;
    
          const rect = canvas.getBoundingClientRect();
          let clientX, clientY;
    
          if (e.type === 'touchstart') {
            e.preventDefault();
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
          } else if (e.type === 'mousedown') {
            clientX = e.clientX;
            clientY = e.clientY;
          }
    
          const casillaX = clientX - rect.left;
          const casillaY = clientY - rect.top;
    
          const cellSize = canvas.width / 9;
          let x = Math.floor(casillaX / cellSize);
          let y = Math.floor(casillaY / cellSize);
    
          if (andado[x]?.[y] === 2 && laberinto[x][y] === 0) {
            expandirCamino(x, y);
          }
    
          if (andado[x]?.[y] === 2 && laberinto[x][y] === 1) {
            animateDefeat(x, y);
          }
        };
    
        canvas.addEventListener('touchstart', handleStart, { passive: false });
        canvas.addEventListener('mousedown', handleStart);
    
        return () => {
          canvas.removeEventListener('touchstart', handleStart);
          canvas.removeEventListener('mousedown', handleStart);
        };
      }, [images, prueba, andado]);
      4
      useEffect(() => {
        if (andado[8][8] === 1) {
          for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
              if (andado[i][j] === 2) {
                andado[i][j] = 0;
              }
            }
          }
          animateVictory(8, 8);
        }
      }, [andado]);
    
      const createPatternCanvas = (image, cellSize) => {
        const patternCanvas = document.createElement('canvas');
        patternCanvas.width = cellSize;
        patternCanvas.height = cellSize;
        const ctx = patternCanvas.getContext('2d');
        ctx.drawImage(image, 0, 0, cellSize, cellSize);
        return patternCanvas;
      };
    
      const drawLaberinto = (ctx, cellSize, andado, suelo, prota, camino, puerta) => {
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    
        for (let x = 0; x < 9; x++) {
          for (let y = 0; y < 9; y++) {
            const posX = x * cellSize;
            const posY = y * cellSize;
    
            if (andado[x][y] === 1) {
              ctx.drawImage(prota, posX, posY, cellSize, cellSize);
            } else if (andado[x][y] === 3) {
              ctx.fillStyle = 'white';
              ctx.fillRect(posX, posY, cellSize, cellSize);
            } else if (x === 8 && y === 8) {
              ctx.drawImage(puerta, posX, posY);
            } else if (andado[x][y] === 2) {
              ctx.drawImage(suelo, posX, posY);
              ctx.drawImage(camino, posX, posY);
            } else {
              ctx.drawImage(suelo, posX, posY);
            }
          }
        }
      };
    
      const expandirCamino = (x, y) => {
        setAndado((prev) => {
          const nuevo = prev.map((fila) => fila.slice());
          for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
              if (nuevo[i][j] === 1) {
                nuevo[i][j] = 3;
              }
              if (nuevo[i][j] === 2) {
                nuevo[i][j] = 0;
              }
            }
          }
          nuevo[x][y] = 1;
    
          const alrededornuevo = (i, j) => {
            if (i >= 0 && i < 9 && j >= 0 && j < 9) {
              if (nuevo[i][j] === 0) {
                nuevo[i][j] = 2;
              }
            }
          };
    
          alrededornuevo(x - 1, y);
          alrededornuevo(x + 1, y);
          alrededornuevo(x, y - 1);
          alrededornuevo(x, y + 1);
    
          return nuevo;
        });
      };
      const animateVictory = (x, y) => {
        const canvas = props.canvasRef.current;
        const ctx = canvas.getContext('2d');
        const cellSize = canvas.width / 9;
        const prota = images[1];
    
        let scale = 1;
        let posX = x * cellSize;
        let posY = y * cellSize;
    
        const targetScale = canvas.width / cellSize;
        const targetX = (canvas.width / 2) - (canvas.width / 2);
        const targetY = (canvas.height / 2) - (canvas.height / 2);
    
        const animate = () => {
          const progress = (scale - 1) / (targetScale - 1);
          const currentX = posX + (targetX - posX) * progress;
          const currentY = posY + (targetY - posY) * progress;
    
          const scaledWidth = cellSize * scale;
          const scaledHeight = cellSize * scale;
    
          ctx.drawImage(
            prota,
            currentX,
            currentY,
            scaledWidth,
            scaledHeight
          );
    
          scale += 0.1;
    
          if (scale < targetScale) {
            requestAnimationFrame(animate);
          } else {
            ctx.drawImage(prota, 0, 0, canvas.width, canvas.height);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const cellSize = canvas.width / 9;
            const newSuelo = createPatternCanvas(images[0], cellSize);
            const newProta = createPatternCanvas(images[1], cellSize);
            const newCamino = createPatternCanvas(images[3], cellSize);
            const newPuerta = createPatternCanvas(images[4], cellSize);
    
            drawLaberinto(ctx, cellSize, andado, newSuelo, newProta, newCamino, newPuerta);
            showAnswer();
          }
        };
    
        requestAnimationFrame(animate);
      };
    
      const animateDefeat = (startX, startY) => {
        const canvas = props.canvasRef.current;
        const ctx = canvas.getContext('2d');
        const cellSize = canvas.width / 9;
        const stripe = images[2];
    
        let scale = 1;
        let posX = startX * cellSize;
        let posY = startY * cellSize;
    
        const targetScale = canvas.width / cellSize;
        const targetX = 0;
        const targetY = 0;
    
        const animate = () => {
          const scaledWidth = cellSize * scale;
          const scaledHeight = cellSize * scale;
          const centerX = posX + cellSize / 2;
          const centerY = posY + cellSize / 2;
    
          const progress = (scale - 1) / (targetScale - 1);
          const currentX = posX + (targetX - posX) * progress;
          const currentY = posY + (targetY - posY) * progress;
    
          ctx.drawImage(
            stripe,
            currentX,
            currentY,
            scaledWidth,
            scaledHeight
          );
    
          scale += 0.1;
    
          if (scale < targetScale) {
            requestAnimationFrame(animate);
          } else {
    
            alert('¡Stripe te ha atrapado! Inténtalo de nuevo.');
    
            resetGame();
          }
        };
    
        requestAnimationFrame(animate);
      };
      const showAnswer = () => {
        const canvas = props.canvasRef.current;
        const ctx = canvas.getContext('2d');
        const cellSize = canvas.width / 9;
        ctx.drawImage(images[5], 1 * cellSize, 1 * cellSize, cellSize, cellSize);
        ctx.drawImage(images[6], 4 * cellSize, 2 * cellSize, cellSize, cellSize);
        ctx.drawImage(images[7], 5 * cellSize, 4 * cellSize, cellSize, cellSize);
        ctx.drawImage(images[8], 3 * cellSize, 6 * cellSize, cellSize, cellSize);
        ctx.drawImage(images[9], 4 * cellSize, 7 * cellSize, cellSize, cellSize);
        ctx.drawImage(images[10], 7 * cellSize, 7 * cellSize, cellSize, cellSize);
      };
      const resetGame = () => {
        setAndado([
          [1, 2, 0, 0, 0, 0, 0, 0, 0],
          [2, 0, 0, 0, 0, 0, 0, 0, 0],
          Array(9).fill(0),
          Array(9).fill(0),
          Array(9).fill(0),
          Array(9).fill(0),
          Array(9).fill(0),
          Array(9).fill(0),
          Array(9).fill(0),
        ]);
      };
  return (   
    <p>
    Gizmo nos quiere mostrar los primeros pasos del camino, acompañémosle.
    Cuidado, que Stripe ya se ha saltado las reglas...
  </p>
  )
}

export default Game1;