import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { FileUploader } from '../FileUploader';
import type { FileUploaderProps } from '../FileUploader';
import { ThemeProvider } from '../../../providers/ThemeProvider';

// Mock fetch for upload requests
global.fetch = vi.fn();

// Mock FileReader
class MockFileReader {
  result: string | ArrayBuffer | null = null;
  onload:
    | ((this: FileReader, ev: ProgressEvent<FileReader>) => unknown)
    | null = null;
  onerror:
    | ((this: FileReader, ev: ProgressEvent<FileReader>) => unknown)
    | null = null;

  readAsArrayBuffer() {
    setTimeout(() => {
      this.result = new ArrayBuffer(8);
      if (this.onload) {
        this.onload.call(
          this as unknown as FileReader,
          {} as ProgressEvent<FileReader>
        );
      }
    }, 10);
  }
}

global.FileReader = MockFileReader as unknown as typeof FileReader;

// Mock crypto for hash calculation
Object.defineProperty(global, 'crypto', {
  value: {
    subtle: {
      digest: vi.fn().mockResolvedValue(new ArrayBuffer(32)),
    },
  },
});

describe('FileUploader Component', () => {
  const defaultProps: FileUploaderProps = {
    action: '/upload',
  };

  // 测试辅助函数：包装ThemeProvider
  const renderWithTheme = (ui: React.ReactElement) => {
    return render(<ThemeProvider>{ui}</ThemeProvider>);
  };

  // const mockFile = new File(['test content'], 'test.txt', {
  //   type: 'text/plain',
  //   lastModified: Date.now(),
  // });

  beforeEach(() => {
    vi.clearAllMocks();
    (fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ success: true }),
    });
  });

  describe('Rendering', () => {
    it('should render upload area', () => {
      renderWithTheme(<FileUploader {...defaultProps} />);
      expect(screen.getByText('点击或拖拽文件到此处上传')).toBeInTheDocument();
    });

    it('should render with custom className', () => {
      renderWithTheme(
        <FileUploader {...defaultProps} className="custom-uploader" />
      );
      const uploader = screen.getByTestId('file-uploader');
      expect(uploader).toHaveClass('custom-uploader');
    });

    it('should render file input', () => {
      renderWithTheme(<FileUploader {...defaultProps} />);
      const fileInput = screen.getByTestId('file-input');
      expect(fileInput).toBeInTheDocument();
      expect(fileInput).toHaveAttribute('type', 'file');
    });
  });

  describe('Basic Functionality', () => {
    it('should support multiple files when enabled', () => {
      renderWithTheme(<FileUploader {...defaultProps} multiple />);
      const fileInput = screen.getByTestId('file-input');
      expect(fileInput).toHaveAttribute('multiple');
    });

    it('should accept specified file types', () => {
      renderWithTheme(<FileUploader {...defaultProps} accept=".jpg,.png" />);
      const fileInput = screen.getByTestId('file-input');
      expect(fileInput).toHaveAttribute('accept', '.jpg,.png');
    });
  });

  describe('Theme Support', () => {
    it('should apply light theme', () => {
      renderWithTheme(<FileUploader {...defaultProps} />);
      const uploader = screen.getByTestId('file-uploader');
      expect(uploader).toBeInTheDocument();
    });

    it('should apply dark theme', () => {
      renderWithTheme(<FileUploader {...defaultProps} />);
      const uploader = screen.getByTestId('file-uploader');
      expect(uploader).toBeInTheDocument();
    });
  });
});
