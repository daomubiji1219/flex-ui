import { useState } from 'react';
// import DataTableExample from './examples/DataTableExample'
import FileUploaderExample from './examples/FileUploaderExample';
import FileUploaderTExample from './examples/FileUploaderTExample';

function App() {
  const [activeTab, setActiveTab] = useState<
    'datatable' | 'fileuploader' | 'fileuploadert'
  >('fileuploadert');

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold text-gray-900">
                  Flexi UI Components
                </h1>
              </div>
              <div className="ml-6 flex space-x-8">
                <button
                  onClick={() => setActiveTab('datatable')}
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    activeTab === 'datatable'
                      ? 'border-blue-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  DataTable
                </button>
                <button
                  onClick={() => setActiveTab('fileuploader')}
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    activeTab === 'fileuploader'
                      ? 'border-blue-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  FileUploader
                </button>
                <button
                  onClick={() => setActiveTab('fileuploadert')}
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    activeTab === 'fileuploadert'
                      ? 'border-blue-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  FileUploader增强版
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* {activeTab === 'datatable' && <DataTableExample />} */}
        {activeTab === 'fileuploader' && <FileUploaderExample />}
        {activeTab === 'fileuploadert' && <FileUploaderTExample />}
      </main>
    </div>
  );
}

export default App;
