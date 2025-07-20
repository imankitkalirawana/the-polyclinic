'use client';

import dynamic from 'next/dynamic';

// Dynamically import ReactQuill to avoid SSR
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

import 'react-quill/dist/quill.snow.css';

export default ReactQuill;
