# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [1.10.3](https://github.com/claytonfbell/ondemand-mnw/compare/v1.10.2...v1.10.3) (2025-05-06)


### Bug Fixes

* added new admin ([c9d37f0](https://github.com/claytonfbell/ondemand-mnw/commit/c9d37f07bbdc7d16fb33a91bde7371659b5e139d))
* new certificate template ([90c4bd5](https://github.com/claytonfbell/ondemand-mnw/commit/90c4bd51bde031075ded970f1d48957fa52a94a0))

### [1.10.2](https://github.com/claytonfbell/ondemand-mnw/compare/v1.10.1...v1.10.2) (2024-11-04)


### Bug Fixes

* typo fixed ([145d714](https://github.com/claytonfbell/ondemand-mnw/commit/145d714eacb4dc5401f27a401e8cdc46d3608bad))

### [1.10.1](https://github.com/claytonfbell/ondemand-mnw/compare/v1.10.0...v1.10.1) (2024-11-04)


### Bug Fixes

* added admin ([e674d85](https://github.com/claytonfbell/ondemand-mnw/commit/e674d85b2c6658c9edbb4d013a080f52b4da9b5f))

## [1.10.0](https://github.com/claytonfbell/ondemand-mnw/compare/v1.9.2...v1.10.0) (2024-10-26)


### Features

* refactored populi tag processing to api2, cleanup code ([28afc26](https://github.com/claytonfbell/ondemand-mnw/commit/28afc26b59312ad2143bc89055f0286d858edecf))

### [1.9.2](https://github.com/claytonfbell/ondemand-mnw/compare/v1.9.1...v1.9.2) (2024-09-13)

### [1.9.1](https://github.com/claytonfbell/ondemand-mnw/compare/v1.9.0...v1.9.1) (2024-03-03)


### Bug Fixes

* wrapped api calls to handle 429 too many request errors ([ac69334](https://github.com/claytonfbell/ondemand-mnw/commit/ac693345e627bb2072be94af0c073199f3b8b7b6))

## [1.9.0](https://github.com/claytonfbell/ondemand-mnw/compare/v1.8.0...v1.9.0) (2024-03-03)


### Features

* reinstate script to process populi data ([7ec7324](https://github.com/claytonfbell/ondemand-mnw/commit/7ec7324abe003b07528f7cc72c07838a55e72ef4))

## [1.8.0](https://github.com/claytonfbell/ondemand-mnw/compare/v1.7.1...v1.8.0) (2023-09-07)


### Features

* upgrade next 12, react 18 ([5f7fc9f](https://github.com/claytonfbell/ondemand-mnw/commit/5f7fc9fcef6ac94d6f12ba543929f4aefb8bcd83))
* upgrade next 13, mui packages ([bb6efaf](https://github.com/claytonfbell/ondemand-mnw/commit/bb6efaf7f593de10aeba13c2aca7d01ca171a26b))
* upgrade react-query v4 ([1231bcf](https://github.com/claytonfbell/ondemand-mnw/commit/1231bcfaf42a98e3cecf33abdf11cd6b86c8f659))

### [1.7.1](https://github.com/claytonfbell/ondemand-mnw/compare/v1.7.0...v1.7.1) (2023-09-04)


### Bug Fixes

* disabled old export to mailchimp script ([3f55d65](https://github.com/claytonfbell/ondemand-mnw/commit/3f55d652ccd79a4c1014450cddb8b748cc1e5cb7))

## [1.7.0](https://github.com/claytonfbell/ondemand-mnw/compare/v1.6.2...v1.7.0) (2023-09-04)


### Features

* added admin tool to export mailing list contact csv files ([81c7e8e](https://github.com/claytonfbell/ondemand-mnw/commit/81c7e8e0e9b83bc1d731055379cc814f09b4ab07))


### Bug Fixes

* updated approved admin list ([1361334](https://github.com/claytonfbell/ondemand-mnw/commit/1361334404b2710bdf1b20edeb5f64da352d9283))

### [1.6.2](https://github.com/claytonfbell/ondemand-mnw/compare/v1.6.1...v1.6.2) (2022-05-26)


### Bug Fixes

* Some adjustments to populi and mailchimp processing ([28539ee](https://github.com/claytonfbell/ondemand-mnw/commit/28539ee0adfadda6deeff7322a46735d233cee61))

### [1.6.1](https://github.com/claytonfbell/ondemand-mnw/compare/v1.6.0...v1.6.1) (2022-05-25)


### Bug Fixes

* Refetch person after populi tags processed for mailchimp processing ([bdc63f9](https://github.com/claytonfbell/ondemand-mnw/commit/bdc63f9f8da7ebbfde5be5b34cb6e6fc03538d57))

## [1.6.0](https://github.com/claytonfbell/ondemand-mnw/compare/v1.5.7...v1.6.0) (2022-05-25)


### Features

* New Certificate table, upgraded prisma, pagination component and more ([f25110a](https://github.com/claytonfbell/ondemand-mnw/commit/f25110a444c6f8ecb4abbfae2e57bac80fdb0d3b))

### [1.5.7](https://github.com/claytonfbell/ondemand-mnw/compare/v1.5.6...v1.5.7) (2022-05-02)


### Bug Fixes

* Ignore error `is not a valid person_id` for merged contacts ([691678f](https://github.com/claytonfbell/ondemand-mnw/commit/691678fcfd37ef4527ee5b702b3b482b3a86901d))

### [1.5.6](https://github.com/claytonfbell/ondemand-mnw/compare/v1.5.5...v1.5.6) (2022-05-02)


### Bug Fixes

* Pass the start_time parameter to populi using Pacific time zone ([44d981b](https://github.com/claytonfbell/ondemand-mnw/commit/44d981bc8f7de6568ee288e185c7adb9e492ebdb))

### [1.5.5](https://github.com/claytonfbell/ondemand-mnw/compare/v1.5.4...v1.5.5) (2022-04-26)


### Bug Fixes

* Fixed the wrapText function that had errors with line breaks ([b301dca](https://github.com/claytonfbell/ondemand-mnw/commit/b301dca97d2e4f8d7bf3120aaf758496caf44181))

### [1.5.4](https://github.com/claytonfbell/ondemand-mnw/compare/v1.5.3...v1.5.4) (2022-04-22)


### Bug Fixes

* more certificate adjustments ([9669a1c](https://github.com/claytonfbell/ondemand-mnw/commit/9669a1ce3d016096fdeea35f65367c13ae512010))

### [1.5.3](https://github.com/claytonfbell/ondemand-mnw/compare/v1.5.2...v1.5.3) (2022-04-22)


### Bug Fixes

* more certificate adjustments ([60afad7](https://github.com/claytonfbell/ondemand-mnw/commit/60afad72dc5866cdf0f12ac9f32370963bc15195))

### [1.5.2](https://github.com/claytonfbell/ondemand-mnw/compare/v1.5.1...v1.5.2) (2022-04-22)


### Bug Fixes

* certificate adjustments, renamed from diploma ([ac1801c](https://github.com/claytonfbell/ondemand-mnw/commit/ac1801c8d2aef4aec44b6ce6d51ff40d29497105))

### [1.5.1](https://github.com/claytonfbell/ondemand-mnw/compare/v1.5.0...v1.5.1) (2022-04-21)


### Bug Fixes

* added admin account ([67a32a0](https://github.com/claytonfbell/ondemand-mnw/commit/67a32a085440322a4dd5b0fb1d0ad63dc74fb63e))

## [1.5.0](https://github.com/claytonfbell/ondemand-mnw/compare/v1.4.1...v1.5.0) (2022-04-21)


### Features

* New diploma generator tool ([0c0256b](https://github.com/claytonfbell/ondemand-mnw/commit/0c0256b2e6de585509836fc5babdf9c761479712))

### [1.4.1](https://github.com/claytonfbell/ondemand-mnw/compare/v1.4.0...v1.4.1) (2022-03-30)


### Bug Fixes

* Fixed first/last name update bug, fixed a tagging bug ([b8291f9](https://github.com/claytonfbell/ondemand-mnw/commit/b8291f94ce2e884003cdbd87f073b4aa1ff3120b))

## [1.4.0](https://github.com/claytonfbell/ondemand-mnw/compare/v1.3.0...v1.4.0) (2022-03-17)


### Features

* upgrade node v16, switch from yarn to npm, dockerize app ([575cd2c](https://github.com/claytonfbell/ondemand-mnw/commit/575cd2c8ee3fc56c2c54051a30db6907185b576c))

## [1.3.0](https://github.com/claytonfbell/ondemand-mnw/compare/v1.2.0...v1.3.0) (2022-03-07)


### Features

* added ability to sort table columns ([0e7bf95](https://github.com/claytonfbell/ondemand-mnw/commit/0e7bf95bd3920af896481df733017d2183278138))
* changes to the confirmation email ([d7966c5](https://github.com/claytonfbell/ondemand-mnw/commit/d7966c54338fcc5eb5945db90e03d1511c8cbd99))
* Modified the quiz button label ([766032b](https://github.com/claytonfbell/ondemand-mnw/commit/766032bb4785af43b434d4b21925fa594e0789a7))
* restructured to find multiple users in each scraped order ([0d82e81](https://github.com/claytonfbell/ondemand-mnw/commit/0d82e81276738496e904f72b8d327fe41fa3ff38))
* user management tools ([cef51e1](https://github.com/claytonfbell/ondemand-mnw/commit/cef51e15bef5ef6a4cebf0d3a7b5e26a506389ca))


### Bug Fixes

* adjusted protection from sending email in non-production environments ([b03bdc6](https://github.com/claytonfbell/ondemand-mnw/commit/b03bdc6ba9d1b872ee03e9a505b8b41a66163a55))

## [1.2.0](https://github.com/claytonfbell/ondemand-mnw/compare/v1.1.1...v1.2.0) (2022-02-10)


### Features

* Adjustments to layout ([0aa0f68](https://github.com/claytonfbell/ondemand-mnw/commit/0aa0f68617e37110256deb46a8a75a8746907a54))

### [1.1.1](https://github.com/claytonfbell/ondemand-mnw/compare/v1.1.0...v1.1.1) (2022-02-07)


### Bug Fixes

* Improvements to square space scraping ([04794f3](https://github.com/claytonfbell/ondemand-mnw/commit/04794f3edfa7fe31700dbffda2ad2bb7db38dd0b))

## [1.1.0](https://github.com/claytonfbell/ondemand-mnw/compare/v1.0.0...v1.1.0) (2022-02-05)


### Features

* Added data export from Popul to MailChimp ([09792c4](https://github.com/claytonfbell/ondemand-mnw/commit/09792c49abbdb3c05fc02145d0126e07cc5fd098))

## 1.0.0 (2022-02-05)


### Features

* Completed initial code-sprint for requirements ([cb9ad9c](https://github.com/claytonfbell/ondemand-mnw/commit/cb9ad9cde5a985fa3be3a983b2190552f9d42fc8))
