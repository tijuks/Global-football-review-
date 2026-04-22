import React, { useEffect, useRef, useState } from 'react';
import * as tf from '@tensorflow/tfjs';
import * as cocossd from '@tensorflow-models/coco-ssd';

export const ObjectDetector: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [model, setModel] = useState<cocossd.ObjectDetection | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadModel = async () => {
      try {
        await tf.ready();
        const loadedModel = await cocossd.load();
        setModel(loadedModel);
      } catch (err) {
        setError('Failed to load object detection model.');
        console.error(err);
      }
    };
    loadModel();
  }, []);

  useEffect(() => {
    if (!model || !videoRef.current) return;

    const detect = async () => {
      if (videoRef.current && videoRef.current.readyState === 4) {
        const predictions = await model.detect(videoRef.current);
        const ctx = canvasRef.current?.getContext('2d');
        if (ctx && canvasRef.current) {
          ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
          predictions.forEach((prediction: any) => {
            const [x, y, width, height] = prediction.bbox;
            ctx.strokeStyle = '#00FF00';
            ctx.lineWidth = 2;
            ctx.strokeRect(x, y, width, height);
            ctx.fillStyle = '#00FF00';
            ctx.fillText(`${prediction.class} (${Math.round(prediction.score * 100)}%)`, x, y > 10 ? y - 5 : 10);
          });
        }
      }
      requestAnimationFrame(detect);
    };

    const stream = async () => {
      const vid = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = vid;
        videoRef.current.play();
        detect();
      }
    };
    stream();
  }, [model]);

  return (
    <div className="relative">
      {error && <p className="text-red-500">{error}</p>}
      <video ref={videoRef} className="w-full h-auto" autoPlay muted playsInline />
      <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full" />
    </div>
  );
};
