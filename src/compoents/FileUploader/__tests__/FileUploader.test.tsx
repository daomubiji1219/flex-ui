import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { FileUploader } from '../FileUploader';
import type { FileUploaderProps } from '../FileUploader';

// Mock fetch for upload requests
global.fetch = vi.fn();

// Mock FileReader
class MockFileReader {
  result: string | ArrayBuffer | null = null;
  onload: ((this: FileReader, ev: ProgressEvent<FileReader>) => any) | null = null;
  onerror: ((this: FileReader, ev: ProgressEvent<FileReader>) => any) | null = null;
  
  readAsArrayBuffer() {
    setTimeout(() => {
      this.result = new ArrayBuffer(8);
      if (this.onload) {
        this.onload.call(this as any, {} as any);
      }
    }, 10);
  }
}

global.FileReader = MockFileReader as any;

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

  const mockFile = new File(['test content'], 'test.txt', {
    type: 'text/plain',
    lastModified: Date.now(),
  });

  beforeEach(() => {
    vi.clearAllMocks();
    (fetch as any).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ success: true }),
    });
  });

  describe('Rendering', () => {
    it('should render upload area', () => {
      render(<FileUploader {...defaultProps} />);
      expect(screen.getByText('点击或拖拽文件到此处上传')).toBeInTheDocument();
    });

    it('should render with custom className', () => {
      render(<FileUploader {...defaultProps} className="custom-uploader" />);
      const uploader = screen.getByTestId('file-uploader');
      expect(uploader).toHaveClass('custom-uploader');
    });

    it('should render file input', () => {
      render(<FileUploader {...defaultProps} />);
      const fileInput = screen.getByTestId('file-input');
      expect(fileInput).toBeInTheDocument();
      expect(fileInput).toHaveAttribute('type', 'file');
    });
  });

  describe('Basic Functionality', () => {
    it('should support multiple files when enabled', () => {
      render(<FileUploader {...defaultProps} multiple />);
      const fileInput = screen.getByTestId('file-input');
      expect(fileInput).toHaveAttribute('multiple');
    });

    it('should accept specified file types', () => {
      render(<FileUploader {...defaultProps} accept=".jpg,.png" />);
      const fileInput = screen.getByTestId('file-input');
      expect(fileInput).toHaveAttribute('accept', '.jpg,.png');
    });
  });

  describe('Theme Support', () => {
    it('should apply light theme', () => {
      render(<FileUploader {...defaultProps} theme="light" />);
      const uploader = screen.getByTestId('file-uploader');
      expect(uploader).toBeInTheDocument();
    });

    it('should apply dark theme', () => {
      render(<FileUploader {...defaultProps} theme="dark" />);
      const uploader = screen.getByTestId('file-uploader');
      expect(uploader).toHaveClass('dark');
    });
  });
});