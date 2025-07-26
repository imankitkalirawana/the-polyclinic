'use client';

import dynamic from 'next/dynamic';

import 'react-quill/dist/quill.snow.css';

// Dynamically import ReactQuill to avoid SSR
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

export default ReactQuill;
