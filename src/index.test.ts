// src/index.test.ts
import { describe, it, expect, vi } from 'vitest';
import { detectScope } from './analyzer/scopeDetector';
import { ValidationError, CancellationError } from './utils/errors';

// Mock any external dependencies if needed
vi.mock('node:child_process', () => ({
  execFileSync: vi.fn(),
  execFile: vi.fn(),
}));

describe('detectScope', () => {
    it('should detect scope from src directory', () => {
        const files = ['src/analyzer/scopeDetector.ts', 'src/analyzer/typeClassifier.ts'];
        expect(detectScope(files)).toBe('analyzer');
    });

    it('should return "core" if no src directory is found', () => {
        const files = ['package.json', 'README.md'];
        expect(detectScope(files)).toBe('core');
    });

    it('should pick the most frequent scope', () => {
        const files = ['src/analyzer/f1.ts', 'src/ui/f2.ts', 'src/ui/f3.ts'];
        expect(detectScope(files)).toBe('ui');
    });
});

describe('Errors', () => {
    it('should create ValidationError with correct name and message', () => {
        const error = new ValidationError('test error');
        expect(error.name).toBe('ValidationError');
        expect(error.message).toBe('test error');
    });

    it('should create CancellationError with default message', () => {
        const error = new CancellationError();
        expect(error.name).toBe('CancellationError');
        expect(error.message).toBe('Commit cancelled.');
    });
});