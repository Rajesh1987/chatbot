import concurrently from 'concurrently';

concurrently([
   {
      name: 'server',
      command: 'cd packages/server && bun run dev',
      prefixColor: 'green',
   },
   {
      name: 'client',
      command: 'cd packages/client && bun run dev',
      prefixColor: 'yellow',
   },
]);
