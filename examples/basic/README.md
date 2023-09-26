Welcome to the **ESLint REPL**! This is a place where you can learn how to use ESLint, reproduce bugs and helpful use cases, and write a few rules of your own - all with live feedback and testing.

### Things to Know

- Only supports [Flat Config](https://eslint.org/docs/latest/use/configure/configuration-files-new) (\`eslint.config.js\`) - we can add support for \`.eslintrc\` and \`.eslintrc.json\` if needed.
- Uses [Webcontainers](https://webcontainers.io/) to run ESLint in Node.JS to give you a full-stack environment that supports all the frameworks you can use on Stackblitz (most). The first time you visit the site will be slow as the webcontainer code downloads, and the first time in each project with a unique package-lock.json will also be slower. Don't expect this to be as fast as other ESLint playgrounds. It's purpose is not to be fast, but to be a universal playground across all projects using ESLint that also lets you develop new rules. If you run into issues with the WebContainer, please try a different browser/device and check the current [webcontainer-core issues](https://github.com/stackblitz/webcontainer-core/issues) to debug. If you find a solution then feel free to create a PR on this repo to fix it for everyone else!
- To remove a file just delete all the contents (start typing again if you didn't want to remove)
- Lint only runs when updating the bigger editor on the right, so if you change your config on the left, just change a keystroke on the right to see the new lint results
- You can add packages in the terminal though you won't see the result of the changes in your package.json

### Roadmap

- Shareable URLs
- Training
- Diff view showing auto-fix result
- Mobile support