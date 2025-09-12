import { useState } from 'react';
import styled from '@emotion/styled';
import { css } from '@emotion/react';
import DataTableExample from './examples/DataTableExample';
import FileUploaderExample from './examples/FileUploaderExample';
import FileUploaderTExample from './examples/FileUploaderTExample';
import VirtualListExample from './examples/VirtualListExample';
import { ThemeProvider } from './providers/ThemeProvider';
import { ThemeToggle } from './components/ThemeToggle';

// 样式化组件
const AppContainer = styled.div`
  min-height: 100vh;
  background-color: ${({ theme }) => theme.colors.background};
  transition: background-color ${({ theme }) => theme.tokens.transitions.normal};
`;

const NavBar = styled.nav`
  background-color: ${({ theme }) => theme.colors.surface};
  box-shadow: ${({ theme }) => theme.tokens.shadows.sm};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  transition: all ${({ theme }) => theme.tokens.transitions.normal};
`;

const NavContainer = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.tokens.spacing[4]}px;

  @media (min-width: ${({ theme }) => theme.tokens.breakpoints.sm}) {
    padding: 0 ${({ theme }) => theme.tokens.spacing[6]}px;
  }

  @media (min-width: ${({ theme }) => theme.tokens.breakpoints.lg}) {
    padding: 0 ${({ theme }) => theme.tokens.spacing[8]}px;
  }
`;

const NavContent = styled.div`
  display: flex;
  justify-content: space-between;
  height: 64px;
`;

const NavLeft = styled.div`
  display: flex;
`;

const Logo = styled.div`
  flex-shrink: 0;
  display: flex;
  align-items: center;
`;

const Title = styled.h1`
  font-size: ${({ theme }) => theme.tokens.typography.sizes[4]}px;
  font-weight: ${({ theme }) => theme.tokens.typography.weights.bold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0;
`;

const TabContainer = styled.div`
  margin-left: ${({ theme }) => theme.tokens.spacing[6]}px;
  display: flex;
  gap: ${({ theme }) => theme.tokens.spacing[8]}px;
`;

const TabButton = styled.button<{ active: boolean }>`
  display: inline-flex;
  align-items: center;
  padding: ${({ theme }) => theme.tokens.spacing[1]}px;
  border-bottom: 2px solid transparent;
  font-size: ${({ theme }) => theme.tokens.typography.sizes[1]}px;
  font-weight: ${({ theme }) => theme.tokens.typography.weights.medium};
  background: none;
  border: none;
  cursor: pointer;
  transition: all ${({ theme }) => theme.tokens.transitions.fast};

  ${({ active, theme }) =>
    active
      ? css`
          border-bottom-color: ${theme.tokens.colors.primary[500]};
          color: ${theme.colors.text.primary};
        `
      : css`
          color: ${theme.colors.text.secondary};

          &:hover {
            color: ${theme.colors.text.primary};
            border-bottom-color: ${theme.colors.border};
          }
        `}
`;

const MainContent = styled.main`
  max-width: 1280px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.tokens.spacing[6]}px;

  @media (min-width: ${({ theme }) => theme.tokens.breakpoints.sm}) {
    padding: ${({ theme }) => theme.tokens.spacing[6]}px;
  }

  @media (min-width: ${({ theme }) => theme.tokens.breakpoints.lg}) {
    padding: ${({ theme }) => theme.tokens.spacing[8]}px;
  }
`;

function App() {
  const [activeTab, setActiveTab] = useState<
    'datatable' | 'fileuploader' | 'fileuploadert' | 'virtuallist'
  >('virtuallist');

  return (
    <ThemeProvider defaultMode="light">
      <AppContainer>
        <NavBar>
          <NavContainer>
            <NavContent>
              <NavLeft>
                <Logo>
                  <Title>Flexi UI Components</Title>
                </Logo>
                <TabContainer>
                  <TabButton
                    onClick={() => setActiveTab('datatable')}
                    active={activeTab === 'datatable'}
                  >
                    DataTable
                  </TabButton>
                  <TabButton
                    onClick={() => setActiveTab('fileuploader')}
                    active={activeTab === 'fileuploader'}
                  >
                    FileUploader
                  </TabButton>
                  <TabButton
                    onClick={() => setActiveTab('fileuploadert')}
                    active={activeTab === 'fileuploadert'}
                  >
                    FileUploader增强版
                  </TabButton>
                  <TabButton
                    onClick={() => setActiveTab('virtuallist')}
                    active={activeTab === 'virtuallist'}
                  >
                    VirtualList
                  </TabButton>
                </TabContainer>
              </NavLeft>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <ThemeToggle />
              </div>
            </NavContent>
          </NavContainer>
        </NavBar>

        <MainContent>
          {activeTab === 'datatable' && <DataTableExample />}
          {activeTab === 'fileuploader' && <FileUploaderExample />}
          {activeTab === 'fileuploadert' && <FileUploaderTExample />}
          {activeTab === 'virtuallist' && <VirtualListExample />}
        </MainContent>
      </AppContainer>
    </ThemeProvider>
  );
}

export default App;
