'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Button, Card, CardBody, CardFooter, CardHeader, Chip, ScrollShadow } from '@heroui/react';
import { AnimatePresence, motion } from 'framer-motion';
import { Icon } from '@iconify/react/dist/iconify.js';

// Premium Chat Message Component
function ChatMessage({
  message,
  isUser,
  isTyping,
  timestamp,
}: {
  message: string;
  isUser: boolean;
  isTyping?: boolean;
  timestamp?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={`mb-4 flex gap-3 ${isUser ? 'flex-row-reverse' : ''}`}
    >
      {!isUser && (
        <div className="mt-1 shrink-0">
          <div className="bg-foreground flex h-8 w-8 items-center justify-center rounded-full">
            <Icon icon="solar:bot-linear" className="text-background h-4 w-4" />
          </div>
        </div>
      )}

      <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} max-w-[75%]`}>
        <div
          className={`rounded-2xl px-4 py-3 ${
            isUser ? 'bg-black text-white' : 'border border-gray-100 bg-gray-50 text-gray-900'
          }`}
        >
          {isTyping ? (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Thinking</span>
              <div className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    animate={{
                      opacity: [0.4, 1, 0.4],
                    }}
                    transition={{
                      duration: 1.2,
                      repeat: Number.POSITIVE_INFINITY,
                      delay: i * 0.2,
                    }}
                    className="h-1 w-1 rounded-full bg-gray-400"
                  />
                ))}
              </div>
            </div>
          ) : (
            <p className="text-start text-sm leading-relaxed whitespace-pre-wrap">{message}</p>
          )}
        </div>

        {timestamp && <span className="mt-1 text-xs text-gray-400">{timestamp}</span>}
      </div>
    </motion.div>
  );
}

// Premium AI Chat Interface
function PremiumAIChatInterface({
  errorType,
  onClose,
}: {
  errorType: string;
  onClose: () => void;
}) {
  const [messages, setMessages] = useState<
    Array<{
      text: string;
      isUser: boolean;
      timestamp: string;
      id: string;
    }>
  >([]);
  const [currentStep, setCurrentStep] = useState<'initial' | 'feedback' | 'resolved' | 'escalate'>(
    'initial'
  );
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    initializeChat();
  }, []);

  const addMessage = (text: string, isUser: boolean) => {
    const newMessage = {
      text,
      isUser,
      timestamp: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
      id: Date.now().toString(),
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  const simulateTyping = async (message: string) => {
    setIsTyping(true);
    await new Promise((resolve) => setTimeout(resolve, 1200));
    setIsTyping(false);
    addMessage(message, false);
  };

  const initializeChat = async () => {
    const initialMessage = `I can help you resolve this ${errorType} error. Here are the most effective solutions:

${
  errorType === 'unauthorized'
    ? '• Refresh the page and sign in again\n• Clear browser cache and cookies\n• Check if your session expired\n• Verify account permissions'
    : errorType === 'not-found'
      ? '• Verify the URL is correct\n• Navigate from the homepage\n• Page may have been moved\n• Use search to find content'
      : errorType === 'forbidden'
        ? '• Contact administrator for access\n• Verify required permissions\n• Sign out and back in\n• Confirm account status'
        : '• Refresh the page\n• Wait a moment and retry\n• Clear browser cache\n• Contact support if persistent'
}

Did this resolve your issue?`;

    await simulateTyping(initialMessage);
    setCurrentStep('feedback');
  };

  const handleFeedback = async (resolved: boolean) => {
    addMessage(resolved ? 'Yes, issue resolved' : 'No, still need help', true);

    if (resolved) {
      setCurrentStep('resolved');
      await simulateTyping(
        'Perfect! Glad I could help resolve the issue. Feel free to reach out if you need assistance again.'
      );
    } else {
      setCurrentStep('escalate');
      await simulateTyping(
        'I understand. Let me connect you with additional resources for more specific assistance.'
      );
    }
  };

  const handleEscalation = async (option: 'contact' | 'retry' | 'documentation') => {
    if (option === 'contact') {
      addMessage('Contact support team', true);
      await simulateTyping(
        "I'll connect you with our support team for personalized assistance. They have advanced tools to help resolve your specific issue."
      );
      setTimeout(() => {
        window.open('/support', '_blank');
      }, 1500);
    } else if (option === 'retry') {
      addMessage('Try solutions again', true);
      setCurrentStep('initial');
      await simulateTyping(
        "Let's go through the troubleshooting steps again with more detailed instructions."
      );
    } else {
      addMessage('View documentation', true);
      await simulateTyping(
        "I'll open our technical documentation with comprehensive troubleshooting guides for this error type."
      );
      setTimeout(() => {
        window.open('/docs', '_blank');
      }, 1500);
    }
  };

  const renderActionButtons = () => {
    switch (currentStep) {
      case 'feedback':
        return (
          <div className="flex gap-2 border-t border-gray-100 p-4">
            <Button
              onPress={() => handleFeedback(true)}
              className="h-11 flex-1 bg-black text-white hover:bg-gray-800"
            >
              <Icon icon="solar:check-circle-linear" className="mr-2 h-4 w-4" />
              Yes, resolved
            </Button>
            <Button
              onPress={() => handleFeedback(false)}
              variant="bordered"
              className="h-11 flex-1 border-gray-200 hover:bg-gray-50"
            >
              <Icon icon="solar:x-circle-linear" className="mr-2 h-4 w-4" />
              Still need help
            </Button>
          </div>
        );

      case 'escalate':
        return (
          <div className="space-y-2 border-t border-gray-100 p-4">
            <Button
              onPress={() => handleEscalation('contact')}
              className="h-11 w-full bg-black text-white hover:bg-gray-800"
            >
              <Icon icon="solar:help-circle-linear" className="mr-2 h-4 w-4" />
              Contact Support
            </Button>
            <div className="flex gap-2">
              <Button
                onPress={() => handleEscalation('retry')}
                variant="bordered"
                className="h-10 flex-1 border-gray-200 hover:bg-gray-50"
              >
                <Icon icon="solar:refresh-cw-linear" className="mr-2 h-4 w-4" />
                Try Again
              </Button>
              <Button
                onPress={() => handleEscalation('documentation')}
                variant="bordered"
                className="h-10 flex-1 border-gray-200 hover:bg-gray-50"
              >
                <Icon icon="solar:external-link-linear" className="mr-2 h-4 w-4" />
                Documentation
              </Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="flex w-full flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Messages */}
        <ScrollShadow
          hideScrollBar
          className="max-h-[256px] flex-1 overflow-y-auto p-4"
          orientation="vertical"
        >
          {messages.map((message) => (
            <ChatMessage
              key={message.id}
              message={message.text}
              isUser={message.isUser}
              timestamp={message.timestamp}
            />
          ))}

          {isTyping && <ChatMessage message="" isUser={false} isTyping />}

          <div ref={messagesEndRef} />
        </ScrollShadow>

        {/* Action Buttons */}
        {renderActionButtons()}
      </motion.div>
    </motion.div>
  );
}

export default function CustomError({
  title,
  description,
  type,
}: {
  title?: string;
  description?: string;
  type: 'unauthorized' | 'not-found' | 'forbidden' | 'error';
}) {
  const [showChat, setShowChat] = useState(false);

  const getErrorConfig = () => {
    switch (type) {
      case 'not-found':
        return {
          code: '404',
          title: title || 'Page not found',
          description: description || "The page you're looking for doesn't exist.",
        };
      case 'unauthorized':
        return {
          code: '401',
          title: title || 'Unauthorized',
          description: description || 'Please sign in to access this page.',
        };
      case 'forbidden':
        return {
          code: '403',
          title: title || 'Access denied',
          description: description || "You don't have permission to access this resource.",
        };
      default:
        return {
          code: '500',
          title: title || 'Something went wrong',
          description: description || "We're working to fix this issue.",
        };
    }
  };

  const errorConfig = getErrorConfig();

  return (
    <main className="flex min-h-[calc(100vh-var(--navbar-height))] items-center justify-center p-6">
      <div className="flex w-full max-w-lg flex-col gap-4 text-center">
        {/* Error Code */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Chip variant="bordered">Error {errorConfig.code}</Chip>
        </motion.div>
        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-col gap-2"
        >
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 md:text-5xl">
            {errorConfig.title}
          </h1>
          <p className="text-lg leading-relaxed text-gray-600">{errorConfig.description}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card>
            <CardHeader className="justify-center">
              <div className="bg-secondary text-secondary-foreground flex h-12 w-12 items-center justify-center rounded-full">
                <Icon icon="solar:chat-dots-bold-duotone" className="h-6 w-6" />
              </div>
            </CardHeader>
            <AnimatePresence>
              {showChat ? (
                <PremiumAIChatInterface errorType={type} onClose={() => setShowChat(false)} />
              ) : (
                <CardBody className="justify-center px-8 text-center">
                  <h3 className="mb-2 text-xl font-semibold text-gray-900">Get instant help</h3>
                  <p className="text-sm leading-relaxed text-gray-600">
                    Our AI assistant can provide step-by-step guidance to resolve this issue
                    quickly.
                  </p>
                </CardBody>
              )}
            </AnimatePresence>
            <CardFooter>
              <AnimatePresence>
                {showChat ? null : (
                  <Button fullWidth onPress={() => setShowChat(true)} color="secondary">
                    <Icon icon="solar:message-circle-linear" className="mr-2 h-4 w-4" />
                    Start conversation
                  </Button>
                )}
              </AnimatePresence>
            </CardFooter>
          </Card>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col justify-center gap-3 sm:flex-row"
        >
          <Button
            color="secondary"
            size="lg"
            onPress={() => (window.location.href = '/')}
            startContent={<Icon icon="solar:home-2-linear" width={20} />}
          >
            Go home
          </Button>

          <Button
            variant="bordered"
            size="lg"
            onPress={() => (window.location.href = '/support')}
            endContent={<Icon icon="solar:arrow-right-linear" width={18} />}
          >
            Contact support
          </Button>
        </motion.div>
      </div>
    </main>
  );
}
