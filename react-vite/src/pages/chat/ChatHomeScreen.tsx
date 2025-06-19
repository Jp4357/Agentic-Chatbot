import { useState } from 'react';
import { Send, Paperclip, Mic, Eye, EyeOff, MoreVertical } from 'lucide-react';

const ChatHomeScreen = () => {
  const [messages, setMessages] = useState([
    { id: 1, text: "hi", sender: "user" },
    { id: 2, text: "Hi! It's nice to meet you. Is there something I can help you with or would you like to chat?", sender: "assistant" },
    { id: 3, text: "I love football", sender: "user" },
    { id: 4, text: "A football fan! Which team do you support? Do you have a favorite player or league? Are you excited about the upcoming season or a specific tournament?\n\nI'm happy to chat with you about football!", sender: "assistant" }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [apiKey, setApiKey] = useState('•••••••••••••••••••••••••••••••••••••');
  const [selectedLLM, setSelectedLLM] = useState('Groq');
  const [selectedModel, setSelectedModel] = useState('llama3-8b-8192');
  const [selectedUsecase, setSelectedUsecase] = useState('Basic Chatbot');

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      setMessages([...messages, { id: messages.length + 1, text: inputMessage, sender: "user" }]);
      setInputMessage('');
    }
  };

  const handleKeyPress = (e: any) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 p-6 space-y-6">
        {/* LLM Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Select LLM</label>
          <select
            value={selectedLLM}
            onChange={(e) => setSelectedLLM(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Groq">Groq</option>
            <option value="OpenAI">OpenAI</option>
            <option value="Anthropic">Anthropic</option>
          </select>
        </div>

        {/* Model Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Select Model</label>
          <select
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="llama3-8b-8192">llama3-8b-8192</option>
            <option value="gpt-4">gpt-4</option>
            <option value="claude-3">claude-3</option>
          </select>
        </div>

        {/* API Key */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">API Key</label>
          <div className="relative">
            <input
              type={showApiKey ? "text" : "password"}
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={() => setShowApiKey(!showApiKey)}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showApiKey ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {/* Usecase Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Select Usecases</label>
          <select
            value={selectedUsecase}
            onChange={(e) => setSelectedUsecase(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Basic Chatbot">Basic Chatbot</option>
            <option value="Code Assistant">Code Assistant</option>
            <option value="Creative Writing">Creative Writing</option>
          </select>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center">
              <span className="text-white text-xs">😊</span>
            </div>
            <h1 className="text-lg font-semibold">LangGraph: Build Stateful Agentic AI LangGraph</h1>
          </div>
          {/* <div className="flex items-center space-x-3">
            <button className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors">
              Clear Chat
            </button>
            <button className="text-gray-500 hover:text-gray-700">
              <MoreVertical size={20} />
            </button>
          </div> */}
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-start' : 'justify-start'}`}
            >
              <div className="flex items-start space-x-3 max-w-3xl">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${message.sender === 'user' ? 'bg-red-500' : 'bg-orange-500'
                  }`}>
                  <span className="text-white text-xs">
                    {message.sender === 'user' ? '😊' : '🤖'}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="text-gray-800 whitespace-pre-wrap">{message.text}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Input Area */}
        <div className="bg-white border-t border-gray-200 px-6 py-4">
          <div className="flex items-center space-x-3">
            <div className="flex-1 relative">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter your message:"
                className="w-full px-4 py-3 pr-24 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
                <button className="text-gray-500 hover:text-gray-700 p-1">
                  <Paperclip size={20} />
                </button>
                <button className="text-gray-500 hover:text-gray-700 p-1">
                  <Mic size={20} />
                </button>
              </div>
            </div>
            <button
              onClick={handleSendMessage}
              className="bg-blue-500 text-white p-3 rounded-full hover:bg-blue-600 transition-colors"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Deploy Button - Fixed Position */}
      <button className="fixed top-4 right-4 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors flex items-center space-x-2">
        <span>Deploy</span>
        <MoreVertical size={16} />
      </button>
    </div>
  );
};

export default ChatHomeScreen;