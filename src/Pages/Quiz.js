import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Typography,
} from "@mui/material";
import useAxios from "../hooks/useAxios";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { handleScoreChange } from "../redux/actions";
import { decode } from "html-entities";

const getRandomInt = (max) => {
  return Math.floor(Math.random() * Math.floor(max));
};

const Quiz = () => {
  const {
    question_category,
    question_difficulty,
    question_type,
    amount_of_question,
    score,
  } = useSelector((state) => state);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  let apiUrl = `/api.php?amount=${amount_of_question}`;
  if (question_category) {
    apiUrl = apiUrl.concat(`&category=${question_category}`);
  }
  if (question_difficulty) {
    apiUrl = apiUrl.concat(`&difficulty=${question_difficulty}`);
  }
  if (question_type) {
    apiUrl = apiUrl.concat(`&type=${question_type}`);
  }

  const { response} = useAxios({ url: apiUrl });
  const [questionIndex, setQuestionIndex] = useState(0);
  const [options, setOptions] = useState([]);
  const [timer, setTimer] = useState(10); // Timer in seconds
  const [nextQuestionLoading, setNextQuestionLoading] = useState(false); // Loading state for next question

  const startTimer = () => {
    setTimer(10); // Reset the timer to 10 seconds
  };

  const handleTimerEnd = useCallback(() => {
    if (questionIndex + 1 < (response?.results?.length || 0)) {
      setNextQuestionLoading(true); // Show CircularProgress while loading next question
      setTimeout(() => {
        setNextQuestionLoading(false); // Hide CircularProgress after a delay (simulated loading)
        setQuestionIndex((prevIndex) => prevIndex + 1); // Move to the next question
        startTimer(); // Start the timer for the next question
      }, 1000); // Adjust the delay time as needed
    } else {
      navigate("/result"); // Redirect to the result page if there are no more questions
    }
  }, [questionIndex, response, navigate]);

  useEffect(() => {
    if (response && response.results && response.results.length > 0) {
      const question = response.results[questionIndex];
      let answers = [...question.incorrect_answers];
      answers.splice(
        getRandomInt(question.incorrect_answers.length),
        0,
        question.correct_answer
      );
      setOptions(answers);
      startTimer(); // Start the timer for the current question
    }
  }, [response, questionIndex]);

  useEffect(() => {
    let intervalId;

    if (timer > 0) {
      intervalId = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else {
      // When the timer runs out, call handleTimerEnd
      handleTimerEnd();
    }

    // Clean up the interval on unmount and when the timer runs out
    return () => {
      clearInterval(intervalId);
    };
  }, [timer, questionIndex, handleTimerEnd, response?.results?.length, navigate]);

  const handleClickAnswer = (e) => {
    const question = response?.results?.[questionIndex];
    if (question && e.target.textContent === question.correct_answer) {
      dispatch(handleScoreChange(score + 1));
    }

    if (questionIndex + 1 < (response?.results?.length || 0)) {
      setNextQuestionLoading(true); // Show CircularProgress while loading next question
      setTimeout(() => {
        setNextQuestionLoading(false); // Hide CircularProgress after a delay (simulated loading)
        setQuestionIndex(questionIndex + 1);
        startTimer(); // Start the timer for the next question
      }, 1000); // Adjust the delay time as needed
    } else {
      navigate("/result");
    }
  };

  // Check if response.results[questionIndex] exists before accessing its properties
  if (response?.results?.[questionIndex]) {
    return (
      <Box>
        <Typography variant="h4">Question {questionIndex + 1}</Typography>
        <Typography mt={5}>
          {decode(response.results[questionIndex].question)}
        </Typography>
        <Typography mt={5}>Time Left: {timer} seconds</Typography>
        {options.map((data, id) => (
          <Box mt={2} key={id}>
            <Button
              onClick={handleClickAnswer}
              variant="contained"
              fullWidth
            >
              {decode(data)}
            </Button>
          </Box>
        ))}
        {nextQuestionLoading ? (
          <Box mt={5}>
            <CircularProgress />
          </Box>
        ) : null}
        <Box mt={5}>
          Score: {score}/{response.results.length}
        </Box>
      </Box>
    );
  } else {
    return (
      <Box>
        <Typography variant="h4">No questions available.</Typography>
      </Box>
    );
  }
};

export default Quiz;
