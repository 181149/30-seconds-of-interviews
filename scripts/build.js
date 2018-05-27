// This script generates the README file
const fs = require("fs-extra")
const path = require("path")
const chalk = require("chalk")
const format = require("prettier-eslint")
const util = require("./util.js")
const questions = require("../data/questions.json")
const { QUESTIONS_PATH, TAG_NAMES } = util

const STATIC_PARTS_PATH = "./static-parts"

const formatOptions = code => {
	return {
		text: code,
		eslintConfig: {
			parserOptions: {
				ecmaVersion: 7
			},
			rules: {
				semi: ["error", "never"]
			}
		},
		prettierOptions: {
			bracketSpacing: true,
			printWidth: 80,
			tabWidth: 2
		},
		fallbackPrettierOptions: {
			singleQuote: false
		}
	}
}

let tagOrder = ["javascript", "css", "html"]
let questionTags = {}
let startPart = ""
let endPart = ""
let output = ""

// methods for converting to markdown
const hX = (n, text) => `\n${"#".repeat(n)} ${text}`

const detailsTOC = (title, questionsArray) => {
	let list = questionsArray
		.map(
			question =>
				`* [${question.question}](#${util.toKebabCase(question.question)})`
		)
		.join("\n")
	return `\n\n<details>\n<summary>${title}</summary>\n\n${list}\n</details>\n\n`
}
const detailsQuestion = (title, question) => {
	let answer = question.answer
	// add Good to Hear
	answer += `\n\n${hX(4, "Good to hear")}\n\n`
	answer += `\n${question.goodToHear.map(s => `* ${s}`).join("\n")}`
	// add Additional links
	answer += `\n\n${hX(5, "Additional links")}\n\n`
	answer += `\n${question.links.map(link => `* ${link}`).join("\n")}`
	return `\n\n<details>\n<summary>${title}</summary>\n${answer}\n</details>\n\n`
}

console.time("Builder")

// questions = util.readQuestions(QUESTIONS_PATH)

try {
	startPart = fs.readFileSync(
		path.join(STATIC_PARTS_PATH, "README-start.md"),
		"utf8"
	)
	endPart = fs.readFileSync(
		path.join(STATIC_PARTS_PATH, "README-end.md"),
		"utf8"
	)
} catch (err) {
	console.log(`${chalk.red("ERROR!")} During static part loading: ${err}`)
	process.exit(1)
}

try {
	// add static part for start
	output += `${startPart + "\n"}`

	let questionsInTag = {}

	// put questions into respective tag-keyed arrays
	questions.forEach(question => {
		question.tags.forEach(tag => {
			if (Object.keys(questionsInTag).includes(tag)) {
				questionsInTag[tag].push(question)
			} else {
				let newArr = []
				newArr.push(question)
				questionsInTag[tag] = newArr
			}
		})
	})

	// write Table of Contents
	Object.keys(questionsInTag).forEach(tagKey => {
		taggedQuestions = questionsInTag[tagKey]
		output += hX(3, TAG_NAMES[tagKey])
		output += detailsTOC("View content", taggedQuestions)
	})

	// delimeter after TOC
	output += "\n---\n"

	// write actual questions
	Object.keys(questionsInTag).forEach(tagKey => {
		taggedQuestions = questionsInTag[tagKey]
		taggedQuestions.forEach(question => {
			output += detailsQuestion("View answer", question)
			output += `\n\n<br>[⬆ Back to top](#table-of-contents)\n\n`
		})
	})

	// add static part for end
	output += `\n${endPart + "\n"}`

	fs.writeFileSync("README.md", output)
} catch (err) {
	console.log(`${chalk.red("ERROR!")} During README generation: ${err}`)
	process.exit(1)
}

console.log(`${chalk.green("SUCCESS!")} README file generated!`)
console.timeEnd("Builder")
