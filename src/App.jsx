import React, { useState } from 'react';
import InputView from './components/InputView';
import ListView from './components/ListView';
import DueView from './components/DueView';

function App() {
  const [activeTab, setActiveTab] = useState('input');

  return (
    <div>
      <h1 className="heading">LeetCode Tracker</h1>

      <div className="tabs">
        <button
          className={`tab ${activeTab === 'input' ? 'active' : ''}`}
          onClick={() => setActiveTab('input')}
        >
          Add Name
        </button>
        <button
          className={`tab ${activeTab === 'list' ? 'active' : ''}`}
          onClick={() => setActiveTab('list')}
        >
          All Questions
        </button>
        <button
          className={`tab ${activeTab === 'due' ? 'active' : ''}`}
          onClick={() => setActiveTab('due')}
        >
          Due Today
        </button>
      </div>

      <main>
        {activeTab === 'input' && <InputView />}
        {activeTab === 'list' && <ListView />}
        {activeTab === 'due' && <DueView />}
      </main>
    </div>
  );
}

export default App;
