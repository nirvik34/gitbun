import { describe, it, expect } from 'vitest';
import { detectScope } from './analyzer/scopeDetector';
import { ValidationError, CancellationError } from './utils/errors';

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

    it('should detect monorepo scope from apps/ directory', () => {
        const files = ['apps/web/src/auth/login.ts'];
        expect(detectScope(files)).toBe('web');
    });

    it('should detect monorepo scope from packages/ directory', () => {
        const files = ['packages/ui/Button.tsx', 'packages/ui/Modal.tsx'];
        expect(detectScope(files)).toBe('ui');
    });

    it('should detect monorepo scope from libs/ directory', () => {
        const files = ['libs/shared/utils/index.ts'];
        expect(detectScope(files)).toBe('shared');
    });

    it('should detect monorepo scope from services/ directory', () => {
        const files = ['services/auth-service/src/index.ts'];
        expect(detectScope(files)).toBe('auth-service');
    });

    it('should pick the most frequent monorepo package scope', () => {
        const files = [
            'libs/shared/utils.ts',
            'apps/api/server.ts',
            'apps/api/routes.ts',
        ];
        expect(detectScope(files)).toBe('api');
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
