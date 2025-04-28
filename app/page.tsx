'use client';
import { addToast, Button } from '@heroui/react';

const Home = () => {
  return (
    <>
      <Button
        className="absolute mt-4"
        onPress={() => {
          addToast({
            title: 'Hello',
            description: 'World',
            color: 'secondary',
          });
        }}
      >
        Click me
      </Button>
    </>
  );
};

export default Home;
