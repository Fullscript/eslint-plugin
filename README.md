# eslint-plugin

Fullscript eslint rules

## How to Create a Custom ESLint Rule

At Fullscript, we maintain a [public GitHub repo](https://github.com/Fullscript/eslint-plugin) that houses custom rules to cater to the specific use cases of our app. You can create custom rules to use with ESLint if the core rules do not cover your use case, and if there isn't an existing open-source plugin that can be used (e.g., [@shopify/eslint-plugin](https://github.com/Shopify/web-configs/tree/main/packages/eslint-plugin)).

We have two-way syncing between our GitHub and GitLab repos. This means we can author changes in the GitLab repo, similar to hw-admin, and have them sync to GitHub. Please be mindful that the changes we make here will also be synced to the public GitHub repo.

To write custom ESLint rules, you will need to:

- Add a custom rule in the ESLint module (in this repo)
- Enable the rule in the ESLint configuration in your hw-admin repo

### Setup Steps

1. Clone this repo to your local machine.
2. In the cloned ESLint-plugin repo:
   - Run `yarn build-watch` to generate the dist folder. You can also run `yarn build` if you only want to run once instead of re-building automatically as you make changes.
   - Run `yarn link`. This will create a symlink to the local package that allows you to use your local version to debug a problem.
3. In your hw-admin repo, run `yarn link @fullscript/eslint-plugin`. This will link the package to your current project and allows you to use the local version of the package you previously linked. To remove the linked package, run `yarn unlink @fullscript/eslint-plugin` and `yarn install –force`.

4. In the cloned ESLint-plugin repo, create a new rule as follows:
   - Create a new folder for the rule under `./src`.
   - Add a file that contains the new rule (e.g., `/oneTranslationImport.js`) and an index file that exports it (e.g., `/oneTranslationImport/index.js`).
   - Add your new rule in `rules` in `src/index.js` to be exported as a new rule.
5. In your hw-admin repo, add the rule in a config file (e.g., `.eslintrc.loose.js`).
6. Run `yarn eslint {path to the file}` or you can also run to test more specific rule by `yarn eslint —c .eslintrc.loose.js {file name}`. Restart the ESLint server on VS Code for the new rule to be picked up. You can do so by pressing Cmd + Shift + P and typing `eslint`.
7. Make sure to include the package versioning change (e.g., "version": "2.3.2") in `package.json` in your MR following the [semantic versioning](https://semver.org/) guidelines.

Now, you’re ready to develop. Happy coding!

### Once the MR is Approved:

1. Reach out to the maintainer (post in the hopper channel on Slack) to bump the version and create a new release.
2. Once the new release is ready, create an MR in the main app repo to apply the new ESLint rule.
3. Once it’s merged, announce in the #feds channel that the new rule has been applied!

### Tips:

ESLint uses Abstract Syntax Trees (AST). An AST is a tree representation of the source code that provides information about the code structure. Tools like ESLint create an AST for a given piece of code and execute rules on it. To figure out specific instructions for our custom rule, we need to inspect the AST manually.

AST Explorer allows you to play around with it: https://astexplorer.net

\*Select @typescript-eslint/parser and ESLint v8 as the transform to use AST Explorer in the ESLint environment.

### How to Debug

1. In the eslint file, set the `debugger` on the line where you'd like to trigger the debugger.
2. In hw-admin, run `node --inspect-brk ./node_modules/.bin/eslint --c .eslintrc.loose.js <path to file> --ext .js,.jsx,.ts,.tsx,.d.ts`. The path to the file is the file that you want to run the rule against.
3. In VS Code, press `Ctrl + Shift + P` and then type “Attach”. Select the “Debug: Attach to Node Process” option.
4. You should now see the debugger running, and can move forward until you reach the trigger you set.

### Useful Resources:

- ESLint official documentation: https://eslint.org/docs/latest/extend/custom-rules
- How to write custom ESLint rules: https://developers.mews.com/how-to-write-custom-eslint-rules/
- How to write a custom ESLint rule: https://blog.scottlogic.com/2021/09/06/how-to-write-an-es-lint-rule-for-beginners.html
