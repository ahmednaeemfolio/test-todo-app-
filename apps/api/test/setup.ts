import 'reflect-metadata';

// Keep the test environment deterministic and aligned with local defaults.
process.env.NODE_ENV ??= 'test';
process.env.PORT ??= '3001';
