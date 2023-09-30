import { Box, Button, CircularProgress, Typography } from "@mui/material"
// import { Form } from "react-router-dom"
import SelectField from "../Components/SelectField"
import TextFieldComp from "../Components/TextFieldComp";
import useAxios from "../hooks/useAxios";
import { useNavigate } from "react-router-dom";


const Settings = () => {
  const {response, error, loading} = useAxios({url:"/api_category.php"})
  const navigate = useNavigate()
  if(loading){
    return(
      <Box mt={70}>
          <CircularProgress/>
      </Box>
    )
  }

  if(error){
    return(
      <Typography variant="h6" mt={50} color="red">
        Something Went Wrong!
      </Typography>
    )
  }

  const difficultyOptions = [
    { id: "easy", name: "Easy" },
    { id: "medium", name: "Medium" },
    { id: "hard", name: "Hard" },
  ]

  const typeOptions = [
    { id: "multiple", name: "Multiple Choice" },
    { id: "boolean", name: "True/False" },
  ]

  const handleSubmit= e =>{
      e.preventDefault();
      navigate("/quiz");
  };

  return (
    <div>
        <Typography variant="h2" fontWeight="bold">Quiz App</Typography>
        <form onSubmit={handleSubmit}>
        {<SelectField options={response.trivia_categories} label="Category"/>}
        {<SelectField options={difficultyOptions} label="Difficulty"/>}
        {<SelectField options={typeOptions} label="Type"/>}
        {<TextFieldComp/>}
        <Box mt={3} width="100%">
            <Button fullWidth variant="contained" type="submit">
              Let's Play
            </Button>
        </Box>
        </form>
    </div>
  )
}

export default Settings