# LSC Utilities Reports Bot

*Created by Tyler McDonald (tm21cy/Blizzy#8953). Please leave this README on every fork to denote appropriate attribution.*

### Deployment Necessities
1. On your (likely Linux) machine, ensure `pnpm` and `pm2` are installed. Ensure that `pm2` is appropriately configured.
2. Run `pnpm i` to get all dependencies.
3. Create a `.env` in root containing:
   1. `TOKEN` - the token of your Discord deployment instance.
   2. `CLIENT_ID` - the User ID of the above instance.
   3. `IT_ROLE` - the Role ID of your Investigations Team staff role.
4. Ensure Typescript is installed, ideally globally (`pnpm i -g typescript`).
5. Use any of the following scripts:
   1. `pnpm build` - Runs `rm -rf ./dist` to clear existing files, `tsc` to build.
   2. `pnpm start` - Runs `node dist/index.js` to start with current files.
   3. `pnpm fullstart` - Runs a union of `build` and `start`.
   4. `pnpm deploystart` - Runs `fullstart`, but with  a full command deployment and `pm2` startup.

### Support
Contact - tm21cy@outlook.com OR Blizzy#8953