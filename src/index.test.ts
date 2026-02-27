import { describe, it, expect } from 'vitest';
import { detectScope } from './analyzer/scopeDetector';

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
