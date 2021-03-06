import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Square from "./Square";
import {
	fastCreateSudokuSolution,
	trimSolution,
	createSudokuBoard,
	generateRandomIdx,
} from "../../assets/sudoku/functions";
import Difficulty from "./Difficulty";
import Scores from "./Scores";
import lightBulb from "../../images/sudoku/lightBulb.png";
import "./Sudoku.css";

const Sudoku = () => {
	const [difficulty, setDifficulty] = useState(45);
	const [points, setPoints] = useState(difficulty);
	const [solution, setSolution] = useState([[]]);
	const [board, setBoard] = useState([[]]);
	const [clicked, setClicked] = useState(false);
	const score = useSelector((state) => state.session.user.sudoku_score);

	const newGame = () => {
		let solutionBoard = createSudokuBoard();
		fastCreateSudokuSolution(solutionBoard);
		setSolution(solutionBoard);

		const gameBoard = trimSolution(solutionBoard, difficulty);
		setBoard(gameBoard);
		setPoints(difficulty);
	};

	const reset = () => {
		const unset = document.querySelectorAll(".unset");
		unset.forEach((element) => (element.innerHTML = ""));
		return;
	};

	const getHint = () => {
		const boardWithHint = JSON.parse(JSON.stringify(board));

		let i = 0;
		while (!i) {
			const row = generateRandomIdx();
			const col = generateRandomIdx();
			i += 1;
			if (board[row][col]) i--;
			else boardWithHint[row][col] = solution[row][col];
		}
		setBoard(boardWithHint);
		setPoints((points) => points - 1);
	};

	const showHintDesc = (e) => {
		const hintEle = document.querySelector(".hint");
		hintEle.classList.remove("--hidden");
		hintEle.style.left = e.clientX + "px";
		hintEle.style.top = e.clientY + "px";
	};

	const hideHintDesc = (e) => {
		const hintEle = document.querySelector(".hint");
		hintEle.classList.add("--hidden");
	};

	function handleClick(e) {
		e.stopPropagation();
		if (!e.target.classList.contains("square")) {
			setClicked(false);
		}
	}

	useEffect(() => {
		if (clicked) return;
		document.addEventListener("DOMContentLoaded", () => {
			const squares = document.querySelectorAll("td");
			squares.forEach((square) => (square.id = ""));
		});

		setClicked(false);

		return document.removeEventListener("", () => {
			const squares = document.querySelectorAll("td");
			squares.forEach((square) => (square.id = ""));
		});
	}, [clicked]);

	useEffect(() => {
		newGame();
	}, [difficulty]); // eslint-disable-line react-hooks/exhaustive-deps

	return (
		<div className="sudoku-container">
			<div className="game sudoku" onClick={handleClick}>
				<div className="game-nav chess">
					<Difficulty
						difficulty={difficulty}
						setDifficulty={setDifficulty}
					/>
					<Scores points={points} score={score} />
					<div className="sudoku-buttons">
						<button onClick={newGame} className="new-game">
							New Game
						</button>
						<button onClick={reset} className="sudoku-reset">
							Reset
						</button>
						<p className="hint --hidden">Hint</p>
						<div>
							<img
								className="hint"
								onMouseEnter={showHintDesc}
								onMouseLeave={hideHintDesc}
								onClick={getHint}
								src={lightBulb}
								alt="hint"
							/>
						</div>
					</div>
				</div>
				<table>
					<tbody>
						{board.map((row, i) => (
							<tr key={i} className={i}>
								{row.map((square, j) => {
									return (
										<Square
											key={j}
											i={i}
											j={j}
											num={board[i][j]}
											solution={solution}
											board={board}
											clicked={clicked}
											setClicked={setClicked}
											points={points}
										/>
									);
								})}
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default Sudoku;
