import { Box, Button, CircularProgress, Typography } from "@mui/material";
import useAxios from "../hooks/useAxios";
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { handleScoreChange } from "../redux/actions";
import { decode } from "html-entities";

const getRandomInt = (max) =>{
  return Math.floor(Math.random() * Math.floor(max));
}

const Quiz = () => {
  const {
    question_category,
    question_difficulty,
    question_type,
    amount_of_question,
    score,
  } = useSelector(state => state);
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

  const { response, loading } = useAxios({ url: apiUrl });
  const [questionIndex, setQuestionIndex] = useState(0);
  const [options, setOptions] = useState([]);

  useEffect(()=>{
      if(response?.results.length){
        const question =response.results[questionIndex];
        let answers = [...question.incorrect_answers];
        answers.splice(
          getRandomInt(question.incorrect_answers.length),
          0,
          question.correct_answer
        );
        setOptions(answers);
      }
  }, [response, questionIndex]);

  // Add an effect to update the question index when the response changes
  useEffect(() => {
    if (!loading && response.results.length > 0) {
      setQuestionIndex(0);
    }
  }, [loading, response]);

  if (loading) {
    return (
      <Box mt={20}>
        <CircularProgress />
      </Box>
    );
  }

  const handleClickAnswer = (e) => {
    const question =response.results[questionIndex];
    if (e.target.textContent === question.correct_answer) {
        dispatch(handleScoreChange(score+1));
    }

    if(questionIndex+1 < response.results.length){
      setQuestionIndex(questionIndex + 1);
    } else {
      navigate('/result')
    }
  };
  // Check if response.results[questionIndex] exists before accessing its properties
  if (response.results[questionIndex]) {
    return (
      <Box>
        <Typography variant="h4">Question {questionIndex + 1}</Typography>
        <Typography mt={5}>{decode(response.results[questionIndex].question)}</Typography>
        {options.map((data, id) => (
          <Box mt={2} key={id}>
            <Button onClick={handleClickAnswer} variant="contained" fullWidth>{decode(data)}</Button>
          </Box>
        ))}
        <Box mt={5}>Score: {score}/{response.results.length}</Box>
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
