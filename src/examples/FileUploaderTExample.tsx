import React from 'react';
import styled from '@emotion/styled';
import { css } from '@emotion/react';
import { FileUploader } from '../components/FileUploader/FileUploader';
import { Button } from '../components/Button/Button';
import { useTheme } from '../hooks/useTheme';
import type { UploadFile } from '../components/FileUploader/FileUploader';

// 样式化组件
const PageContainer = styled.div`
  ${({ theme }) => css`
    min-height: 100vh;
    background-color: ${theme.colors.background};
    transition: all ${theme.tokens.transitions.normal};
  `}
`;

const Container = styled.div`
  ${({ theme }) => css`
    max-width: 1200px;
    margin: 0 auto;
    padding: ${theme.tokens.spacing[9]}px ${theme.tokens.spacing[6]}px;
  `}
`;

const Header = styled.div`
  ${({ theme }) => css`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: ${theme.tokens.spacing[9]}px;
  `}
`;

const Title = styled.h1`
  ${({ theme }) => css`
    font-size: ${theme.tokens.typography.sizes[6]}px;
    font-weight: ${theme.tokens.typography.weights.bold};
    color: ${theme.colors.text.primary};
  `}
`;

const ThemeToggleButton = styled.button`
  ${({ theme }) => css`
    padding: ${theme.tokens.spacing[2]}px ${theme.tokens.spacing[4]}px;
    background-color: ${theme.tokens.colors.primary[500]};
    color: white;
    border: none;
    border-radius: ${theme.tokens.radii.lg};
    font-size: ${theme.tokens.typography.sizes[1]}px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: ${theme.tokens.spacing[2]}px;
    transition: background-color ${theme.tokens.transitions.fast};

    &:hover {
      background-color: ${theme.tokens.colors.primary[600]};
    }

    &:focus {
      outline: none;
      box-shadow: 0 0 0 2px ${theme.tokens.colors.primary[200]};
    }
  `}
`;

const ExampleSection = styled.div`
  ${({ theme }) => css`
    margin-bottom: ${theme.tokens.spacing[9]}px;
    padding: ${theme.tokens.spacing[6]}px;
    border: 1px solid ${theme.colors.border};
    border-radius: ${theme.tokens.radii.lg};
    background-color: ${theme.colors.surface};
    box-shadow: ${theme.mode === 'dark'
      ? '0 1px 3px rgba(0, 0, 0, 0.3)'
      : '0 1px 3px rgba(0, 0, 0, 0.1)'};
  `}
`;

const SectionTitle = styled.h2`
  ${({ theme }) => css`
    font-size: ${theme.tokens.typography.sizes[4]}px;
    font-weight: ${theme.tokens.typography.weights.semibold};
    color: ${theme.colors.text.primary};
    margin-bottom: ${theme.tokens.spacing[2]}px;
  `}
`;

const SectionDescription = styled.p`
  ${({ theme }) => css`
    color: ${theme.colors.text.secondary};
    margin-bottom: ${theme.tokens.spacing[5]}px;
    line-height: ${theme.tokens.typography.lineHeights.relaxed};
  `}
`;

const ButtonGrid = styled.div`
  ${({ theme }) => css`
    display: flex;
    gap: ${theme.tokens.spacing[4]}px;
    flex-wrap: wrap;
    margin-bottom: ${theme.tokens.spacing[4]}px;
  `}
`;

// 主题切换按钮组件
const ThemeToggleButtonComponent: React.FC<{
  isDark: boolean;
  onToggle: () => void;
}> = ({ isDark, onToggle }) => {
  return (
    <ThemeToggleButton
      onClick={onToggle}
      aria-label={isDark ? '切换到亮色模式' : '切换到暗色模式'}
    >
      {isDark ? (
        <>
          <span>☀️</span>
          <span>亮色模式</span>
        </>
      ) : (
        <>
          <span>🌙</span>
          <span>暗色模式</span>
        </>
      )}
    </ThemeToggleButton>
  );
};

const FileUploaderTExample: React.FC = () => {
  const { mode, toggleMode } = useTheme();
  // 上传进度回调
  const handleProgress = (file: UploadFile, progress: number) => {
    console.log(`文件 ${file.name} 上传进度: ${progress.toFixed(2)}%`);
  };

  // 上传成功回调
  const handleSuccess = (file: UploadFile, response: unknown) => {
    console.log(`文件 ${file.name} 上传成功:`, response);
    alert(`文件 ${file.name} 上传成功！`);
  };

  // 上传失败回调
  const handleError = (file: UploadFile, error: Error) => {
    console.error(`文件 ${file.name} 上传失败:`, error);
    alert(`文件 ${file.name} 上传失败: ${error.message}`);
  };

  // 上传前检查
  const beforeUpload = (file: File): boolean => {
    // 检查文件大小（限制为100MB）
    const maxSize = 100 * 1024 * 1024; // 100MB
    if (file.size > maxSize) {
      alert(`文件 ${file.name} 大小超过100MB限制`);
      return false;
    }

    // 检查文件类型
    const allowedTypes = [
      'image/',
      'video/',
      'application/pdf',
      'text/',
      'application/zip',
      'application/x-pdf',
    ];
    const isAllowed = allowedTypes.some(type => file.type.startsWith(type));
    if (!isAllowed) {
      alert(`文件 ${file.name} 类型不支持`);
      return false;
    }

    return true;
  };

  return (
    <PageContainer>
      <Container>
        <Header>
          <Title>增强版文件上传组件示例</Title>
          <ThemeToggleButtonComponent
            isDark={mode === 'dark'}
            onToggle={toggleMode}
          />
        </Header>

        {/* Button组件测试区域 */}
        <ExampleSection>
          <SectionTitle>Button组件测试</SectionTitle>
          <div>
            <ButtonGrid>
              <Button
                variant="primary"
                onClick={() => alert('Primary clicked!')}
              >
                Primary
              </Button>
              <Button
                variant="secondary"
                onClick={() => alert('Secondary clicked!')}
              >
                Secondary
              </Button>
              <Button
                variant="outline"
                onClick={() => alert('Outline clicked!')}
              >
                Outline
              </Button>
              <Button variant="ghost" onClick={() => alert('Ghost clicked!')}>
                Ghost
              </Button>
            </ButtonGrid>
            <ButtonGrid>
              <Button size="sm">Small</Button>
              <Button size="md">Medium</Button>
              <Button size="lg">Large</Button>
            </ButtonGrid>
            <ButtonGrid>
              <Button loading>Loading</Button>
              <Button disabled>Disabled</Button>
              <Button icon={<span>🚀</span>}>With Icon</Button>
            </ButtonGrid>
          </div>
        </ExampleSection>

        <ExampleSection>
          <SectionTitle>拖拽上传文件</SectionTitle>
          <SectionDescription>
            支持拖拽上传、分片上传、断点续传，美观的UI界面
          </SectionDescription>
          <FileUploader
            action="http://localhost:3000/upload"
            urls={{
              check: 'http://localhost:3000/upload/check',
              chunk: 'http://localhost:3000/upload/chunk',
              merge: 'http://localhost:3000/upload/merge',
            }}
            multiple={true}
            chunkSize={2 * 1024 * 1024} // 2MB分片
            maxConcurrent={3} // 最大并发3个分片
            accept="image/*,video/*,.pdf,.txt,.zip"
            maxSize={100 * 1024 * 1024} // 100MB
            onProgress={handleProgress}
            onSuccess={handleSuccess}
            onError={handleError}
            beforeUpload={beforeUpload}
          />
        </ExampleSection>

        <ExampleSection>
          <SectionTitle>单文件上传</SectionTitle>
          <SectionDescription>只允许上传单个图片文件</SectionDescription>
          <FileUploader
            action="http://localhost:3001/upload"
            urls={{
              check: 'http://localhost:3001/upload/check',
              chunk: 'http://localhost:3001/upload/chunk',
              merge: 'http://localhost:3001/upload/merge',
            }}
            multiple={false}
            chunkSize={1 * 1024 * 1024} // 1MB分片
            maxConcurrent={2}
            accept="image/*"
            maxSize={50 * 1024 * 1024} // 50MB
            onProgress={handleProgress}
            onSuccess={handleSuccess}
            onError={handleError}
          />
        </ExampleSection>

        <ExampleSection>
          <SectionTitle>文档文件上传</SectionTitle>
          <SectionDescription>仅支持PDF和文本文件上传</SectionDescription>
          <FileUploader
            action="http://localhost:3002/upload"
            urls={{
              check: 'http://localhost:3002/upload/check',
              chunk: 'http://localhost:3002/upload/chunk',
              merge: 'http://localhost:3002/upload/merge',
            }}
            multiple={true}
            chunkSize={5 * 1024 * 1024} // 5MB分片
            maxConcurrent={4}
            accept=".pdf,.txt,application/pdf,text/plain"
            maxSize={200 * 1024 * 1024} // 200MB
            onProgress={handleProgress}
            onSuccess={handleSuccess}
            onError={handleError}
          />
        </ExampleSection>
      </Container>
    </PageContainer>
  );
};

export default FileUploaderTExample;
