import { useState } from 'react';
import styled from '@emotion/styled';
import { css } from '@emotion/react';
import DataTableExample from './examples/DataTableExample';
import FileUploaderExample from './examples/FileUploaderExample';
import FileUploaderTExample from './examples/FileUploaderTExample';
import VirtualListExample from './examples/VirtualListExample';
import ErrorBoundaryTest from './examples/ErrorBoundaryTest';
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

// Button className 测试样式
// 创建带测试样式的 Button 容器
const TestButtonContainer = styled.div`
  border: 5px solid #8b5cf6 !important;
  border-radius: 25px !important;
  box-shadow: 0 0 30px rgba(139, 92, 246, 0.8) !important;
  background: rgba(139, 92, 246, 0.1) !important;
  transform: scale(1.2) !important;
  margin: 10px !important;
  position: relative !important;
  display: inline-block !important;

  &::before {
    content: '🎯 ThemeToggle className 生效！';
    position: absolute;
    top: -15px;
    left: 20px;
    background: #8b5cf6;
    color: white;
    padding: 5px 15px;
    border-radius: 15px;
    font-size: 14px;
    font-weight: bold;
    z-index: 1000;
    animation: glow 2s infinite;
    white-space: nowrap;
  }

  &::after {
    content: '✨ 主题切换 ✨';
    position: absolute;
    bottom: -15px;
    right: 20px;
    background: #7c3aed;
    color: white;
    padding: 5px 15px;
    border-radius: 15px;
    font-size: 12px;
    z-index: 1000;
    white-space: nowrap;
  }

  @keyframes glow {
    0%,
    100% {
      box-shadow: 0 0 5px #8b5cf6;
    }
    50% {
      box-shadow:
        0 0 20px #8b5cf6,
        0 0 30px #8b5cf6;
    }
  }
`;

const ButtonTestStyles = styled.div`
  .button-test-class {
    border: 5px solid #ff00ff !important;
    border-radius: 25px !important;
    box-shadow: 0 8px 30px rgba(255, 0, 255, 0.5) !important;
    background: linear-gradient(
      135deg,
      rgba(255, 0, 255, 0.2),
      rgba(255, 0, 255, 0.1)
    ) !important;
    position: relative !important;
    transform: scale(1.2) !important;
    margin: 10px !important;

    &::before {
      content: '🎯 ThemeToggle className 生效！';
      position: absolute;
      top: -45px;
      left: 50%;
      transform: translateX(-50%);
      background: linear-gradient(135deg, #ff00ff, #cc00cc);
      color: white;
      padding: 12px 20px;
      border-radius: 30px;
      font-size: 14px;
      font-weight: bold;
      z-index: 1000;
      white-space: nowrap;
      box-shadow: 0 4px 15px rgba(255, 0, 255, 0.4);
      animation: glow 2s infinite;
    }

    &::after {
      content: '✨ 主题切换 ✨';
      position: absolute;
      bottom: -40px;
      left: 50%;
      transform: translateX(-50%);
      background: #ff44ff;
      color: white;
      padding: 6px 12px;
      border-radius: 15px;
      font-size: 12px;
      font-weight: bold;
      z-index: 1000;
    }
  }

  @keyframes glow {
    0%,
    100% {
      transform: translateX(-50%) scale(1);
      box-shadow: 0 4px 15px rgba(255, 0, 255, 0.4);
    }
    50% {
      transform: translateX(-50%) scale(1.1);
      box-shadow: 0 6px 25px rgba(255, 0, 255, 0.8);
    }
  }
`;

function App() {
  const [activeTab, setActiveTab] = useState<
    'datatable' | 'fileuploader' | 'fileuploadert' | 'virtuallist' | 'errortest'
  >('errortest');

  return (
    <ThemeProvider defaultMode="light">
      <ButtonTestStyles />
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
                  <TabButton
                    onClick={() => setActiveTab('errortest')}
                    active={activeTab === 'errortest'}
                  >
                    错误边界测试
                  </TabButton>
                </TabContainer>
              </NavLeft>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  position: 'relative',
                }}
              >
                <TestButtonContainer>
                  <ThemeToggle />
                </TestButtonContainer>
              </div>
            </NavContent>
          </NavContainer>
        </NavBar>

        <MainContent>
          {activeTab === 'datatable' && <DataTableExample />}
          {activeTab === 'fileuploader' && <FileUploaderExample />}
          {activeTab === 'fileuploadert' && <FileUploaderTExample />}
          {activeTab === 'virtuallist' && <VirtualListExample />}
          {activeTab === 'errortest' && <ErrorBoundaryTest />}
        </MainContent>
      </AppContainer>
    </ThemeProvider>
  );
}

export default App;
