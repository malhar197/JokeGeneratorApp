// import React, { Component } from 'react';
// import { render } from "react-testing-library";
// import "dom-testing-library/extend-expect";

import React from "react";
import { render, Simulate, wait } from "react-testing-library";
import "dom-testing-library/extend-expect";
import JokeGenerator from "../jokeGenerator";
import Joke from "../joke";
import * as axios from "axios";
import MockAxios from "axios-mock-adapter";

const mock = new MockAxios(axios, {delayResponse: Math.random() * 500 });

afterAll(() => mock.restore());

test("Joke component receives props and then renders text", () => {
	//Renders Joke component with some text prop.
	const { getByTestId } = render(
		<Joke text = "The funniest joke this year." />
		);

	//Expects Joke component to render correct text.
	expect(getByTestId("joke-text")).toHaveTextContent(
		"The funniest joke this year."
		);
});

test("'JokeGenerator' component fetches a random joke and renders it", async () => {
	mock.onGet().replyOnce(200, {
		value: {
			joke: "Really funny joke!"
		}
	});

	//Rendering JokeGenerator component
	const { getByText, queryByText, queryByTestId } = render(<JokeGenerator />);

	expect(getByText("You haven't loaded any joke yet!")).toBeInTheDOM();

	Simulate.click(getByText("Load a random joke"));

	expect(queryByText("You haven't loaded any joke yet!")).not.toBeInTheDOM();

	expect(queryByText("Loading...")).toBeInTheDOM();

	// Check if a default text is being when
	// no joke has been loaded yet.

	await wait(() => expect(queryByText("Loading...")).not.toBeInTheDOM());

	expect(queryByTestId("joke-text")).toBeInTheDOM();
});