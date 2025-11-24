import db from './sqlite';
import { saveMessage } from './chat-history';

export function seedMockChatHistory(userId: number) {
  const mockChats = [
    {
      chatId: 'default',
      messages: [
        { role: 'system' as const, content: 'You are a helpful AI assistant. Answer user questions clearly and concisely. Answer in English language.' },
        { role: 'user' as const, content: 'Hello! Can you help me understand machine learning basics?' },
        { role: 'assistant' as const, content: 'Hello! I\'d be happy to help you understand machine learning basics. Machine learning is a subset of artificial intelligence that enables computers to learn and make decisions from data without being explicitly programmed for every task.\n\nKey concepts include:\n- **Supervised Learning**: Learning from labeled examples\n- **Unsupervised Learning**: Finding patterns in unlabeled data\n- **Neural Networks**: Computing systems inspired by biological neural networks\n\nWould you like me to explain any of these concepts in more detail?' },
        { role: 'user' as const, content: 'What is a neural network?' },
        { role: 'assistant' as const, content: 'A neural network is a computing system inspired by biological neural networks. It consists of interconnected nodes (neurons) organized in layers:\n\n- **Input Layer**: Receives the data\n- **Hidden Layers**: Process the data through weighted connections\n- **Output Layer**: Produces the final result\n\nEach connection has a weight that adjusts during training to minimize errors. Neural networks excel at pattern recognition and are used in image recognition, natural language processing, and many other applications.' },
      ]
    },
    {
      chatId: 'ml-basics',
      messages: [
        { role: 'system' as const, content: 'You are a helpful AI assistant. Answer user questions clearly and concisely. Answer in English language.' },
        { role: 'user' as const, content: 'Explain gradient descent' },
        { role: 'assistant' as const, content: 'Gradient descent is an optimization algorithm used to minimize a cost function in machine learning. It works by:\n\n1. Starting at a random point\n2. Calculating the gradient (slope) of the cost function\n3. Moving in the direction of steepest descent\n4. Repeating until reaching a minimum\n\nThe learning rate controls how big steps you take. Too large and you might overshoot; too small and training is slow.' },
        { role: 'user' as const, content: 'What about backpropagation?' },
        { role: 'assistant' as const, content: 'Backpropagation is the algorithm used to train neural networks. It calculates gradients by:\n\n1. **Forward Pass**: Data flows through the network to produce output\n2. **Calculate Error**: Compare output to expected result\n3. **Backward Pass**: Propagate error backwards through layers\n4. **Update Weights**: Adjust weights using calculated gradients\n\nThis allows the network to learn from its mistakes and improve over time.' },
      ]
    },
    {
      chatId: 'python-help',
      messages: [
        { role: 'system' as const, content: 'You are a helpful AI assistant. Answer user questions clearly and concisely. Answer in English language.' },
        { role: 'user' as const, content: 'How do I use pandas to read a CSV file?' },
        { role: 'assistant' as const, content: 'You can read a CSV file in pandas using `pd.read_csv()`. Here\'s a simple example:\n\n```python\nimport pandas as pd\n\ndf = pd.read_csv(\'file.csv\')\nprint(df.head())\n```\n\nCommon parameters:\n- `sep`: Delimiter (default is comma)\n- `header`: Row to use as column names\n- `index_col`: Column to use as index\n- `nrows`: Number of rows to read\n\nWould you like to see more advanced options?' },
      ]
    }
  ];

  for (const chat of mockChats) {
    for (const msg of chat.messages) {
      saveMessage(userId, chat.chatId, msg.role, msg.content);
    }
  }

  console.log(`Seeded ${mockChats.length} mock chats for user ${userId}`);
}

