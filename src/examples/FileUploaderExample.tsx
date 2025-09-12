import React from 'react';
import styled from '@emotion/styled';
import { css } from '@emotion/react';
import { FileUploader } from '../components/FileUploader/FileUploader';
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

const FeatureList = styled.ul`
  ${({ theme }) => css`
    list-style: none;
    padding: 0;
    margin: 0;

    li {
      margin-bottom: ${theme.tokens.spacing[2]}px;
      color: ${theme.colors.text.secondary};

      strong {
        color: ${theme.colors.text.primary};
      }
    }
  `}
`;

const CodeBlock = styled.code`
  ${({ theme }) => css`
    padding: ${theme.tokens.spacing[1]}px ${theme.tokens.spacing[2]}px;
    background-color: ${theme.mode === 'dark'
      ? theme.tokens.colors.neutral[700]
      : theme.tokens.colors.neutral[100]};
    border-radius: ${theme.tokens.radii.sm};
    font-size: ${theme.tokens.typography.sizes[0]}px;
    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
    color: ${theme.colors.text.primary};
  `}
`;

const InfoBox = styled.div`
  ${({ theme }) => css`
    font-size: ${theme.tokens.typography.sizes[0]}px;
    color: ${theme.colors.text.disabled};
    margin-top: ${theme.tokens.spacing[4]}px;
    padding: ${theme.tokens.spacing[3]}px;
    background-color: ${theme.mode === 'dark'
      ? theme.tokens.colors.primary[900]
      : theme.tokens.colors.primary[50]};
    border-radius: ${theme.tokens.radii.lg};
    border-left: 4px solid ${theme.tokens.colors.primary[400]};
  `}
`;

const FileUploaderExample: React.FC = () => {
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
      'text/tsx',
      'text/jsx',
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
          <Title>文件上传组件示例</Title>
          <ThemeToggleButton onClick={toggleMode}>
            {mode === 'dark' ? (
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
        </Header>

        <ExampleSection>
          <SectionTitle>基础文件上传</SectionTitle>
          <SectionDescription>
            支持拖拽上传、分片上传、断点续传
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
            accept=".ts,.tsx,.js,.jsx,.html,.css"
            maxSize={100 * 1024 * 1024} // 100MB
            onProgress={handleProgress}
            onSuccess={handleSuccess}
            onError={handleError}
            beforeUpload={beforeUpload}
          />
        </ExampleSection>

        <ExampleSection>
          <SectionTitle>单文件上传</SectionTitle>
          <SectionDescription>只允许上传单个文件</SectionDescription>
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
          <SectionTitle>大文件上传</SectionTitle>
          <SectionDescription>
            专门用于大文件上传，使用更大的分片
          </SectionDescription>
          <FileUploader
            action="http://localhost:3001/upload"
            urls={{
              check: 'http://localhost:3001/upload/check',
              chunk: 'http://localhost:3001/upload/chunk',
              merge: 'http://localhost:3001/upload/merge',
            }}
            multiple={true}
            chunkSize={10 * 1024 * 1024} // 10MB分片
            maxConcurrent={5}
            accept="video/*,.zip,.rar,.7z"
            maxSize={1024 * 1024 * 1024} // 1GB
            onProgress={handleProgress}
            onSuccess={handleSuccess}
            onError={handleError}
            beforeUpload={file => {
              if (file.size < 100 * 1024 * 1024) {
                alert('此上传器专用于大文件（>100MB），请使用基础上传器');
                return false;
              }
              return true;
            }}
          />
        </ExampleSection>

        <ExampleSection>
          <SectionTitle>使用说明</SectionTitle>
          <FeatureList>
            <li>
              <strong>拖拽上传：</strong>
              将文件拖拽到上传区域即可开始上传
            </li>
            <li>
              <strong>点击上传：</strong>
              点击上传区域选择文件
            </li>
            <li>
              <strong>分片上传：</strong>
              大文件会自动分片上传，提高上传成功率
            </li>
            <li>
              <strong>断点续传：</strong>
              上传中断后可以继续上传，无需重新开始
            </li>
            <li>
              <strong>并发控制：</strong>
              可以设置最大并发分片数，避免网络拥堵
            </li>
            <li>
              <strong>进度监控：</strong>
              实时显示上传进度
            </li>
            <li>
              <strong>暂停/继续：</strong>
              可以暂停和继续上传任务
            </li>
          </FeatureList>
        </ExampleSection>

        <ExampleSection>
          <SectionTitle>后端API接口</SectionTitle>
          <SectionDescription>
            使用此组件需要后端提供以下接口（当前运行在 http://localhost:3001）：
          </SectionDescription>
          <FeatureList>
            <li>
              <CodeBlock>POST /upload/check</CodeBlock> - 检查已上传的分片
            </li>
            <li>
              <CodeBlock>POST /upload/chunk</CodeBlock> - 上传分片
            </li>
            <li>
              <CodeBlock>POST /upload/merge</CodeBlock> - 合并分片
            </li>
            <li>
              <CodeBlock>GET /files</CodeBlock> - 获取文件列表
            </li>
            <li>
              <CodeBlock>GET /files/:filename</CodeBlock> - 下载文件
            </li>
            <li>
              <CodeBlock>GET /health</CodeBlock> - 健康检查
            </li>
          </FeatureList>
          <InfoBox>
            💡 提示：确保后端服务已启动在 3001 端口，前端开发服务器运行在 5173
            端口
          </InfoBox>
        </ExampleSection>
      </Container>
    </PageContainer>
  );
};

export default FileUploaderExample;
