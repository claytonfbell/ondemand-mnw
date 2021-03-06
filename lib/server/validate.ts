import owasp from "owasp-password-strength-test"
import { sentenceCase } from "sentence-case"
import vr from "validator"

owasp.config({
  allowPassphrases: true,
  maxLength: 128,
  minLength: 10,
  minPhraseLength: 20,
  minOptionalTestsToPass: 4,
})

type NameValue = { [key: string]: unknown }

class ValidateThese {
  name: string
  value: unknown
  label: string

  constructor(nameValue: NameValue, label?: string) {
    this.name = Object.keys(nameValue)[0]
    this.value = Object.values(nameValue)[0]
    this.label = label === undefined ? sentenceCase(this.name) : label
  }

  fail(message: string) {
    throw new Error(message)
  }

  notNull() {
    if (typeof this.value === "undefined" || this.value === null) {
      this.fail(`Value for **${this.label}** is missing.`)
    }
    return this
  }

  notEmpty() {
    this.notNull()
    if (this.value === "") {
      this.fail(`Value for **${this.label}** is empty.`)
    }
    return this
  }

  min(x: number) {
    this.notNull()
    if (x > 0) {
      this.notEmpty()
    }
    if (typeof this.value === "string") {
      if (this.value.length < x) {
        this.fail(
          `Value for **${this.label}** must be at least **${x}** characters.`
        )
      }
    }
    return this
  }

  max(x: number) {
    this.notNull()
    if (typeof this.value === "string") {
      if (this.value.length > x) {
        this.fail(
          `Value for **${this.label}** must be less than **${x}** characters.`
        )
      }
    }
    return this
  }

  greaterThanZero() {
    return this.greaterThan(0)
  }

  greaterThan(x: number) {
    this.notNull()
    if ((this.value as number) <= x) {
      this.fail(`Value for **${this.label}** must be greater than **${x}**.`)
    }
    return this
  }

  lessThan(x: number) {
    this.notNull()
    if ((this.value as number) >= x) {
      this.fail(`Value for **${this.label}** must be less than **${x}**.`)
    }
    return this
  }

  email() {
    this.notNull().min(5)

    if (!vr.isEmail(this.value as string)) {
      this.fail(`**Email address** does not look valid.`)
    }
    return this
  }

  match(regex: string) {
    const pattern = new RegExp(regex)
    const matched = pattern.test(String(this.value))
    if (!matched) {
      this.fail(`Value for **${this.label}** does not look valid.`)
    }
    return this
  }

  phone(allowBlank = false) {
    this.notNull()
    if (allowBlank === true) {
      if (this.value === "") {
        return this // allowing empty string
      }
    }
    return this.min(10)
      .max(20)
      .match("^(\\+\\d{1,2}\\s)?\\(?\\d{3}\\)?[\\s.-]\\d{3}[\\s.-]\\d{4}$")
  }

  numericString() {
    return this.min(1).match("^[0-9]+$")
  }

  boolean() {
    this.notNull()
    if (this.value !== true && this.value !== false) {
      this.fail(`Value for **${this.label}** does not look valid.`)
    }
    return this
  }

  strongPassword() {
    this.notNull().notEmpty()
    const result = owasp.test(this.value as string)
    if (result.errors.length > 0) {
      this.fail(result.errors.join("\n"))
    }
    return this
  }

  oneOf(values: unknown[] = []) {
    this.notNull()
    if (Array.isArray(this.value)) {
      for (let i = 0; i < this.value.length; i++) {
        if (values.indexOf(this.value[i]) === -1) {
          this.fail(`Values for **${this.label}** are not all valid options.`)
        }
      }
    } else {
      if (values.indexOf(this.value) === -1) {
        this.fail(
          `Value for **${this.label}** is not one of the valid options.`
        )
      }
    }
    return this
  }
}

const validate = (nameValue: NameValue, label?: string) =>
  new ValidateThese(nameValue, label)

export default validate
