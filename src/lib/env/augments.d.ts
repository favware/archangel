import type { ArchAngelEnv } from './types';

declare global {
  namespace NodeJS {
    interface ProcessEnv extends ArchAngelEnv {}
  }
}
