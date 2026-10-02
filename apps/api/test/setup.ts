import 'reflect-metadata';

// Use deterministic local defaults without overriding explicit test settings.
process.env.NODE_ENV ??= 'test';
process.env.PORT ??= '0';
