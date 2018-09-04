# Étapes de construction

## Squelette applicatif

Utilisation de l'utilitaire `create-react-app` pour construire le squelette du projet :

```bash
npx create-react-app capitaine-flemme
cd capitaine-flemme
npm install
```

## Initialisation du projet Git

`git init`

## Mise en place des outils d'automatisation

### Auto-formatage du code avec Prettier

`npm install --save-dev prettier`

Comme ça on du code nickel chez tout le monde utilisant le projet et pour tout un tas d'extensions (JS, JSX, CSS, SCSS, JSON, Markdown, YAML, GraphQL…).

On ajoute nos règle custom dans le `package.json` :

```JSON
  "prettier": {
    "arrowParens": "always",
    "singleQuote": true,
    "trailingComma": "es5",
    "semi": false
  },
```

On souhaitera également rappliquer le formatage lors de la création de nos commits, des fois que l'éditeur ait manqé qqch ou qu'un fichier ait été mis à jour sans que nous l'ayons ouvert (exemple du `package.json` suite à un `npm install …`). Il faut donc appliquer le formattage Prettier uniquement sur les portions de code modifiées et _stagées_/prêtes à être commitées avec [precise-commits](https://github.com/nrwl/precise-commits).

`npm install --save-dev precise-commits`

#### Configuration VSCode

Pour que ça marche nickel dans VSCode, installer [l'extension Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode).

Puis on customise la configuration du projet ([workspace settings](https://code.visualstudio.com/docs/getstarted/settings))

```JSON
  // Exclusions from the explorer
  "files.exclude": {
    "**/.git": true,
    "**/.DS_Store": true,
    "**/node_modules": true
  },
  // Prettier & ESLint
  "prettier.arrowParens": "always",
  "prettier.eslintIntegration": true,
  "prettier.singleQuote": true,
  "prettier.trailingComma": "es5",
  "prettier.semi": false,
  "editor.formatOnSave": true,
  "javascript.format.enable": false,
```

### ESLint

Comme on adore ESLint et que la norme tend à aller vers StandardJS pour les règles, on installe tout ce qu'il faut pour que tout ça marche ensemble :

`npm install --save-dev eslint eslint-plugin-import eslint-plugin-node eslint-plugin-prettier eslint-plugin-promise eslint-plugin-react eslint-plugin-standard eslint-config-standard eslint-config-prettier`

On affine notre configuration pour charger tout ça dans `package.json` :

```JSON
  "eslintConfig": {
    "extends": [
      "standard",
      "prettier",
      "plugin:react/recommended",
      "plugin:import/errors"
    ],
    "plugins": [
      "prettier",
      "react",
      "import"
    ],
    "parser": "babel-eslint",
    "rules": {
      "prettier/prettier": [
        "error",
        {
          "arrowParens": "always",
          "singleQuote": true,
          "trailingComma": "es5",
          "semi": false
        }
      ],
      "no-irregular-whitespace": 0
    },
    "env": {
      "browser": true,
      "commonjs": true,
      "es6": true,
      "jest": true,
      "node": true
    },
    "settings": {
      "import/resolver": {
        "node": {
          "paths": [
            "jest/"
          ]
        }
      }
    }
  },
```

### Garantir le format des messages de commit

Un format de message de commit complet et pratique pour leur réutilisation via des scripts pour générer des changelog/release-notes est le _conventional changelog_.
Pour garantir leur rédaction on peut avoir deux approches complémentaires :

- proposer une aide à la saisie
- valider la saisie a posteriori

Pour l'aide à la saisie on peut utiliser [commitizen](http://commitizen.github.io/cz-cli/) qui nous permettra de faire `git cz` au lieu de `git commit` pour afficher un wizard :

`npm install --save-dev commitizen cz-conventional-changelog`

On précise dans la configuration (`package.json`) qu'on veut utiliser le *conventional-changelog* :

```JSON
  "config": {
    "commitizen": {
      "path": "cz-conventional-changelog"
    }
  }
```

Ensuite on veut s'assurer que les messages saisis répondent bien aux critères du conventional-changelog (dans le cas des saisies manuelles). On utilise _commit-lint_ à cet effet :

`npm install --save-dev @commitlint/cli @commitlint/config-conventional @commitlint/prompt-cli`

On doit également préciser dans le `package.json` qu'on utilise le *conventional-changelog* :

```JSON
  "commitlint": {
    "extends": [
      "@commitlint/config-conventional"
    ]
  },
```

Attention, _commit-lint_ n'est pas lancé automatiquement au moment de notre saisie, il faut compléter son chargement via l'utilitaire de hooks Git : _Husky_.

### Nos petits scripts à nous

On a un peut triché ici car on a directement injectés les fichiers dans un répertoire `git-hooks` à la racine du projet. Peut-être changerons-nous cela prochainement pour rendre ces compléments génériques et installables.

NB : si vous souhaitez les réutiliser, notez que ces derniers doivent être exécutables (`chmod +x git-hooks/*.js`).

#### Lors du commit

On veut effectuer tout un tas de vérifications sur les fichiers _stagés_/prêts à être commités :

- Reste-t-il des marqueurs de conflits  ?
- A-t-on laissé des mots clés `FIXME` ou `TODO` ?
- A-t-on laissé des `console.log…` dans nos fichiers JS ?

#### Lors du push

On veut vérifier qu'on introduit par de régression de couverture de tests JS/Jest.
Pour ça on va utiliser un module node qui met à jour les stats de couverture qu'on aura préalablement renseigné dans notre `package.json`.

En mettant ces valeurs à jour et en relançant les tests de Jest, ce dernier bloquera de lui même le process en cours (le push) pour indiquer que notre couverture à regressé.

On ajoute une surcouche d'appel via notre script `git-hooks/pre-push.js` qui ne lance cette analyse que lorsque des fichiers JS ont été modifiés et _stagés_.

`npm install --save-dev jest-coverage-ratchet`

Dans le `package.json` :

```JSON
  "jest": {
    "coverageReporters": [
      "json-summary"
    ],
    "coverageThreshold": {
      "global": {
        "lines": 0,
        "statements": 0,
        "functions": 0,
        "branches": 0
      }
    }
  },
```

### Husky

Husky permet de gérer les hooks Git depuis le `package.json`.
On installe a minima la version 1.x (d'où le `@next` qui suit car actuellement release candidate `1.0.0-rc.13`) :

`npm install --save-dev husky@next`

On le configure alors pour lancer nos scripts de hooks ainsi que _commit-lint_ et _precise-commit_ (`package.json`) :

```JSON
  "husky": {
    "hooks": {
      "commit-msg": "commitlint -e $GIT_PARAMS",
      "pre-commit": "./git-hooks/pre-commit.js && precise-commits",
      "pre-push": "./git-hooks/pre-push.js"
    }
  },
```

NB : [d'autres hooks](https://github.com/typicode/husky/blob/master/HOOKS.md#hooks) sont disponibles.

### Tests automatisés d'accessibilité ♿️

#### Dans notre éditeur

Un super plugin ESLint permet de faire de l'analyse statique sur du JSX. Donc pour notre appli React c'est top. Reste à l'installer : `npm install --save-dev eslint-plugin-jsx-a11y`.

Puis dans notre `package.json`, on ajoute la conf :

```JSON
  "eslintConfig": {
    "extends": [
      …
      "plugin:jsx-a11y/recommended"
    ],
    "plugins": [
      …
      "jsx-a11y"
    ],
    …
  }
```

#### En appui de nos tests automatisés

Bon là on ne promet pas de miracles, mais déjà quelques vérifications de base.
Comme la plupart des scripts on pourra préférer intégrer ça au niveau de la CI plutôt que côté dev en pre-push.
Mais comme ici on veut blinder le travail partagé avant envoi, on fera ça côté machine de dév, même si ça bouffe de la ressource.

_Disclaimer : la suite de cette section suit une prodécure décrite par des gens biens chez [Marmelab](https://marmelab.com/blog/2018/07/18/accessibility-performance-testing-puppeteer.html)_

Pour tester l'accessibilité, il faut simuler l'affichage. Pour ça on a un truc génial, du chrome headless (depuis la v59) avec son API (les dev-tools) pour intéragir avec : [puppeteer](https://github.com/GoogleChrome/puppeteer).

Nos tests eux sont écrits et lancés avec Jest, on va donc avoir besoin d'une passerelle, et coup de bol, 'y'en a une toute faite : [jest-puppeteer](https://github.com/smooth-code/jest-puppeteer).

Côté tests automatisés de l'accessibilité, on va utiliser [axe-core](https://github.com/dequelabs/axe-core).

On aura besoin d'un serveur pour tout ça.

`npm install --save-dev axe-core jest-puppeteer puppeteer serve babel-preset-env react-scripts@next`.

Notez la présence de `babel-preset-env` pour nous permettre d'utiliser les dernières syntaxes ES6, notamment `async/await`. On complète avec le fichier `accessibility/.babelrc` :

```JS
{
  "presets": ["env"]
}
```

On est également obligé de tricher pour utiliser la dernière version de *react-scripts* qui permettra de faire fonctionner tout ça.

_Rq : selon le gouvernement anglais, l'automatisation des tests d'accessibilité ne permet de couvrir que 30% des problématiques. Soyez donc vigilants et allez au bout de vos démarches en ajoutant des tests via les technologies d'assistance (lecteurs d’écrans etc.) et incluez si possible des utilisateurs en situation de handicap pour des tests en situation._

## Mise en place de l'Auto DevOps de GitLab

Dans notre projet GitLab fraichement créé nous devons activer l'[auto DevOps](https://docs.gitlab.com/ee/user/project/clusters/). Comme tout ceci est encore à ses premisses il nous faut gérer quelques détails parfois mal documentés :

### Cluster Kubernetes

Créer un ou plusieurs clusters Kubernetes (depuis [Google Kubernetes Enginee](https://console.cloud.google.com/kubernetes/clusters), alias GKE).

### Domaine

Pour ne pas se galérer dans l'immédiat avec un domaine custom, on va passer par [nip.io](http://nip.io). Mais pour que ça marche bien avec GitLab il faut activer Ingress qui va s'auto-câler sur notre cluster. De ce fait on aura plus qu'à copier/coller ce qui nous sera proposé dans la partie _Settings > CI/CD > Auto DevOps_ pour le domaine.

### Et ensuite ?

Là ça commence à devenir plaisant. Si on créé une pull request on, GitLab va automatiquement déclencher tout un tas de choses avec sa pipeline après avoir fait de l'auto-détection de stack technique.
