
import React from 'react';

// Add missing className prop to components
declare module 'react' {
  interface IntrinsicAttributes {
    className?: string;
  }
}
