import { Box, Button, Typography } from "@mui/material"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom";
import { handleAmountChange, handleScoreChange } from "../redux/actions";

const Result = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {score} = useSelector(state => state);

  const handleBackToHome = () =>{
    dispatch(handleScoreChange(0));
    dispatch(handleAmountChange(50));
    navigate('/');
  }
  return (
   <Box mt={30}>
    <Typography variant="h3" fontWeight="bold" mb={3}>Fianl Score {score}</Typography>
    <Button variant="outlined" onClick={handleBackToHome}>Back To Main Screen!</Button>
   </Box>
  )
}

export default Result