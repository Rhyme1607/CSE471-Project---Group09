'use client';

import { useState, useEffect, useRef } from 'react';

export default function IframeModelViewer({ modelUrl }: { modelUrl: string | null }) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  if (!modelUrl) {
    return (
      <div className="w-full h-[400px] flex items-center justify-center bg-gray-100 rounded-lg">
        <p className="text-gray-500">3D model not available yet</p>
      </div>
    );
  }

  return (
    <div className="w-full h-[400px] bg-gray-100 rounded-lg overflow-hidden relative">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 mx-auto"></div>
            <p className="mt-2 text-gray-500">Loading 3D model...</p>
          </div>
        </div>
      )}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-500">{error}</p>
          </div>
        </div>
      )}
      <iframe 
        src={`/model-viewer.html?model=${encodeURIComponent(modelUrl)}`}
        className="w-full h-full border-0"
        onLoad={() => setIsLoading(false)}
        onError={() => setError('Failed to load 3D model viewer. Please try again.')}
        title="3D Model Viewer"
      />
    </div>
  );
} 