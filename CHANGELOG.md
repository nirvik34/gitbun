# [1.16.0](https://github.com/nirvik34/gitbun/compare/v1.15.0...v1.16.0) (2026-09-13)


### Features

* **analyzer:** add analyzer logic ([fb51888](https://github.com/nirvik34/gitbun/commit/fb5188810ebf54b65bdf1177209dcc2b9372347a))
* **bin:** add bin logic ([0f19de1](https://github.com/nirvik34/gitbun/commit/0f19de1a14c3fc16e194f12f686f01fd16ba3895))

# [1.15.0](https://github.com/nirvik34/gitbun/compare/v1.14.0...v1.15.0) (2026-06-05)


### Features

* **ui:** add lightweight color formatting to commit types ([5800ce8](https://github.com/nirvik34/gitbun/commit/5800ce865c487264fd899379997aa61842cb998d))

# [1.14.0](https://github.com/nirvik34/gitbun/compare/v1.13.1...v1.14.0) (2026-06-04)


### Bug Fixes

* address CodeRabbit review feedback ([7ea2983](https://github.com/nirvik34/gitbun/commit/7ea2983ba445a550c313f540bdf0b8bf10c95f6b))


### Features

* add git hook integration with install and uninstall commands ([1469fdb](https://github.com/nirvik34/gitbun/commit/1469fdbc8b3b5ef04c1c140c388ae9d00d41cd8e))

## [1.13.1](https://github.com/nirvik34/gitbun/compare/v1.13.0...v1.13.1) (2026-06-04)


### Bug Fixes

* address CodeRabbit review suggestions ([09306ac](https://github.com/nirvik34/gitbun/commit/09306ac5c9033630b69af848299929f6bf1684aa))
* handle outside diff comments ([97b627c](https://github.com/nirvik34/gitbun/commit/97b627c5058bad87008f9ffe46af630512b2eb37))
* **rate-limit:** harden proxy trust and cooldown handling ([0edbd5a](https://github.com/nirvik34/gitbun/commit/0edbd5a605f1f980c77c6bf44580b30483646206))

# [1.13.0](https://github.com/nirvik34/gitbun/compare/v1.12.1...v1.13.0) (2026-05-28)


### Features

* add onboarding welcome bot workflow ([c8355bb](https://github.com/nirvik34/gitbun/commit/c8355bb731b8f46798615be3ea26fcd93d8d8ed7))

## [1.12.1](https://github.com/nirvik34/gitbun/compare/v1.12.0...v1.12.1) (2026-05-24)


### Bug Fixes

* **analyzer:** make path parsing and scope detection platform-safe on Windows ([0165703](https://github.com/nirvik34/gitbun/commit/0165703d22ccd8906414c508c5a1fd1d8d921f49))

# [1.12.0](https://github.com/nirvik34/gitbun/compare/v1.11.0...v1.12.0) (2026-05-21)


### Bug Fixes

* preserve node:child_process real exports in staging test mock ([9e9af35](https://github.com/nirvik34/gitbun/commit/9e9af35ae601113a8b97d07785ea0b6362c2c30c))
* propagate CancellationError through launchStagingUI catch block ([df6f4c4](https://github.com/nirvik34/gitbun/commit/df6f4c407b6fa6c77f257bbba3b85e82aa576fac))
* use vi.hoisted to fix mock hoisting in staging tests ([a701d81](https://github.com/nirvik34/gitbun/commit/a701d81c3c3322e2e561b8389ec789fe9b582048))


### Features

* add interactive file staging UI when no files are staged ([6841ff7](https://github.com/nirvik34/gitbun/commit/6841ff72e4fc93dc6b5fa8c4ad00cdc884ace9b6)), closes [#26](https://github.com/nirvik34/gitbun/issues/26)

# [1.11.0](https://github.com/nirvik34/gitbun/compare/v1.10.0...v1.11.0) (2026-05-21)


### Bug Fixes

* **config:** restore config fields and test custom prompts ([#31](https://github.com/nirvik34/gitbun/issues/31)) ([3096997](https://github.com/nirvik34/gitbun/commit/3096997e7812eb4fc278a28fc68cc79f72e50b6f))


### Features

* **config:** add customPrompt support via .gitbunrc ([#31](https://github.com/nirvik34/gitbun/issues/31)) ([0eeedba](https://github.com/nirvik34/gitbun/commit/0eeedba0d2961a1e37f63f522c73fcd1f9b5bf1a))

# [1.10.0](https://github.com/nirvik34/gitbun/compare/v1.9.1...v1.10.0) (2026-05-21)


### Bug Fixes

* address PR review comments (semantic analysis safety & correctness) ([14ba674](https://github.com/nirvik34/gitbun/commit/14ba67447545b319641ebc120c466135b6e88bb1))


### Features

* **analyzer:** add semantic diff understanding for TS/JS ([b7b619e](https://github.com/nirvik34/gitbun/commit/b7b619e51bc4399d6549c25083aaa81bdd8139ea)), closes [#7](https://github.com/nirvik34/gitbun/issues/7)

## [1.9.1](https://github.com/nirvik34/gitbun/compare/v1.9.0...v1.9.1) (2026-05-20)


### Bug Fixes

* replace process.exit() with custom Error throws ([#18](https://github.com/nirvik34/gitbun/issues/18)) ([80e90c4](https://github.com/nirvik34/gitbun/commit/80e90c4875d2f9be492387e2b8f80fd40fdbe61f))
* resolve coderabbit reviews and lint warnings ([ba714ae](https://github.com/nirvik34/gitbun/commit/ba714aef11c2e4c16d898e158c3343fd529a1a2e))

# [1.9.0](https://github.com/nirvik34/gitbun/compare/v1.8.0...v1.9.0) (2026-05-19)


### Features

* **cli:** add --dry-run flag to preview commit message without committing ([9640dc5](https://github.com/nirvik34/gitbun/commit/9640dc509baccd2afc65a4167a64cc6024ff9faa))

# [1.8.0](https://github.com/nirvik34/gitbun/compare/v1.7.0...v1.8.0) (2026-05-19)


### Bug Fixes

* **analyzer:** address review feedback for language profiles ([ad9ba29](https://github.com/nirvik34/gitbun/commit/ad9ba296857b7cfdacd199a489be281643bdc4e9))


### Features

* **analyzer:** add modular multi-language analyzer support ([4099c52](https://github.com/nirvik34/gitbun/commit/4099c52b71ee84174018da75d899cb99f2c8cdd8))

# [1.7.0](https://github.com/nirvik34/gitbun/compare/v1.6.0...v1.7.0) (2026-05-19)


### Features

* **cli:** added progress spinners ([83488ac](https://github.com/nirvik34/gitbun/commit/83488acf216cf61cfef7c19d87ec0851bc8cc3da))

# [1.6.0](https://github.com/nirvik34/gitbun/compare/v1.5.1...v1.6.0) (2026-05-19)


### Bug Fixes

* harden vscode gitbun runner ([987cd54](https://github.com/nirvik34/gitbun/commit/987cd543533b2fef64ac2ab5492ac29da3b5fd27))


### Features

* add gitbun vscode extension scaffold ([97ee5ae](https://github.com/nirvik34/gitbun/commit/97ee5ae54898e100aa6c9a37e630ba8789a5d033))

## [1.5.1](https://github.com/nirvik34/gitbun/compare/v1.5.0...v1.5.1) (2026-05-18)


### Bug Fixes

* **llm:** support custom Ollama host URLs via environment variables ([#17](https://github.com/nirvik34/gitbun/issues/17)) ([812b56c](https://github.com/nirvik34/gitbun/commit/812b56c95493730c44c31a3e36da2a84aca0cb89))

# [1.5.0](https://github.com/nirvik34/gitbun/compare/v1.4.0...v1.5.0) (2026-05-18)


### Bug Fixes

* define MIN_GROUP_SIZE constant and resolve merge conflict ([273c46f](https://github.com/nirvik34/gitbun/commit/273c46fff5cf70196b61f4f40fa860002fb16f34))
* pass config.format to generateCommitMessage ([d00c400](https://github.com/nirvik34/gitbun/commit/d00c4001d74b28a86e0425e26fbb81a3fb29cb00))
* **security:** replace execSync with execFileSync to prevent command injection ([2dc662e](https://github.com/nirvik34/gitbun/commit/2dc662e0b1e3820be23a9b41b8a4cfb0e41832a4))


### Features

* **analyzer:** improve fallback diff summarization ([9a39117](https://github.com/nirvik34/gitbun/commit/9a39117f7aaf82e644ada59e7438cea2f09d2eb9))

# [1.4.0](https://github.com/nirvik34/gitbun/compare/v1.3.2...v1.4.0) (2026-05-17)


### Bug Fixes

* **config:** relax template placeholder validation ([da0d385](https://github.com/nirvik34/gitbun/commit/da0d385c1831be7cc23367034071d93126e3edfe))
* **config:** validate commit format templates ([64efc33](https://github.com/nirvik34/gitbun/commit/64efc3371bf3f170eadbecde7ce3ef018d3d8cf4))


### Features

* **config:** add configurable commit templates ([32d0fe7](https://github.com/nirvik34/gitbun/commit/32d0fe7c8f9d9f003a288ea0c59e2488a13a4c7a))

## [1.3.2](https://github.com/nirvik34/gitbun/compare/v1.3.1...v1.3.2) (2026-05-17)


### Bug Fixes

* **llm:** add timeouts to Ollama API calls to prevent CLI freezing ([6f8436c](https://github.com/nirvik34/gitbun/commit/6f8436ca33bcbc027c7e3170152a16e42f7cb1d5))

## [1.3.1](https://github.com/nirvik34/gitbun/compare/v1.3.0...v1.3.1) (2026-05-16)


### Bug Fixes

* **core:** fix .coderabbit ([d579a00](https://github.com/nirvik34/gitbun/commit/d579a004c5b4fbb6bb41b8e1dc0bad99c8e18058))

# [1.3.0](https://github.com/nirvik34/gitbun/compare/v1.2.4...v1.3.0) (2026-02-28)


### Features

* **components:** add layout and sections ([19aeec4](https://github.com/nirvik34/gitbun/commit/19aeec4ecddca69b5d47cda41cf3d937d8e29e02))

## [1.2.4](https://github.com/nirvik34/gitbun/compare/v1.2.3...v1.2.4) (2026-02-28)


### Bug Fixes

* new npm token ([3e476a3](https://github.com/nirvik34/gitbun/commit/3e476a399cdca3ff19ae37ee1d39e516e7993d6a))

## [1.2.3](https://github.com/nirvik34/gitbun/compare/v1.2.2...v1.2.3) (2026-02-28)


### Bug Fixes

* trigger release ([91d2c97](https://github.com/nirvik34/gitbun/commit/91d2c97ac8580cf273ff86ebdfb179b47700d90f))

## [1.2.2](https://github.com/nirvik34/gitbun/compare/v1.2.1...v1.2.2) (2026-02-28)


### Bug Fixes

* escape unescaped entities and fix font url warning ([c59dd8e](https://github.com/nirvik34/gitbun/commit/c59dd8eade041ef9b45829390ed448c80ceab391))

## [1.2.1](https://github.com/nirvik34/gitbun/compare/v1.2.0...v1.2.1) (2026-02-27)


### Bug Fixes

* **frontend:** upgrade next.js to 15.1.12 to resolve CVE-2025-66478 ([7ff50b0](https://github.com/nirvik34/gitbun/commit/7ff50b02f365c6d0013a0632ba111ff110a40eeb))

# [1.2.0](https://github.com/nirvik34/gitbun/compare/v1.1.0...v1.2.0) (2026-02-27)


### Features

* **frontend:** implement sleek dark minimal landing page design with interactive features ([4ddcbbf](https://github.com/nirvik34/gitbun/commit/4ddcbbf72a25f4fdb77092d5830f85badffcae8e))

# [1.1.0](https://github.com/nirvik34/gitbun/compare/v1.0.0...v1.1.0) (2026-02-27)


### Bug Fixes

* **ci:** disable husky in CI and force NODE_ENV=development for devDeps ([ebdd494](https://github.com/nirvik34/gitbun/commit/ebdd4948fa27e9ece54137b8ddbcfc1f163fc0ca))
* **ci:** ensure semantic-release uses local plugins ([0e578a7](https://github.com/nirvik34/gitbun/commit/0e578a78287e2cdde70d4c2be195380b63618102))
* **ci:** force install devDependencies and use npm exec for semantic-release ([b6b94fa](https://github.com/nirvik34/gitbun/commit/b6b94fa8c141174df8a72d7cc1748c95577fcefc))
* **ci:** use local path for semantic-release to avoid npx issues ([9efcd25](https://github.com/nirvik34/gitbun/commit/9efcd254bd1382777fbcbb96946ac31d0ffe786b))
* **ci:** use Node 22 for release job to satisfy semantic-release v25 requirements ([02dc030](https://github.com/nirvik34/gitbun/commit/02dc030e368c1322cfec48a5a1673a1c2476f9dc))


### Features

* **ci:** implement automated semantic-release for versioning and publishing ([9252d2b](https://github.com/nirvik34/gitbun/commit/9252d2bd311a5eab198bbfd5b54f822c03b5ce32))
