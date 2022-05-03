import {
  Box,
  Container,
  Grid,
  Paper,
  Toolbar,
  TextField,
  InputLabel,
  MenuItem,
  Select,
  FormHelperText,
  FormControl,
  Button,
  Typography
} from '@mui/material';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import FileInput from './FileInput';
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const defaultValues = {
  callsign: '',
  email: '',
  power: '',
  assistance: 'false',
  multipleOperators: 'false'
};

export default function Submit() {
  const navigate = useNavigate();
  const [formValues, setFormValues] = useState(defaultValues);
  const [selectedFile, setSelectedFile] = useState();
  const [isFilePicked, setIsFilePicked] = useState(false);

  const fileChangeHandler = (event: any) => {
    setSelectedFile(event.target.files[0]);
    setIsFilePicked(true);
  };

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value
    });
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (!selectedFile) return;
    const formData = new FormData();

    Object.entries(formValues).map(([k, v]) => {
      formData.append(k, v);
    });

    formData.append(
      'file',
      new Blob([selectedFile], { type: (selectedFile as any).type }),
      (selectedFile as any).name
    );

    fetch('/api/parse', {
      method: 'POST',
      body: formData
    })
      .then((response) => {
        if (response.status < 400) {
          toast.success('Successfully submitted!', { duration: 6000 });
          navigate('/');
        } else {
          toast.error(
            'Error submitting log. Please contact arkansasqsoparty@gmail.com for help!',
            { duration: 10000 }
          );
          console.error('Error:', response);
        }
      })
      .catch((error) => {
        toast.error(
          'Error submitting log. Please contact arkansasqsoparty@gmail.com for help!',
          { duration: 10000 }
        );
        console.error('Error:', error);
      });
  };

  return (
    <Box
      component="main"
      sx={{
        backgroundColor: (theme) =>
          theme.palette.mode === 'light'
            ? theme.palette.grey[100]
            : theme.palette.grey[900],
        flexGrow: 1,
        height: 'auto',
        overflow: 'auto'
      }}
    >
      <Toolbar />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <form onSubmit={handleSubmit}>
          <Paper sx={{ p: 2 }}>
            <Typography
              component="h2"
              variant="h6"
              color="primary"
              sx={{ mb: 2 }}
            >
              Contest Log Submission
            </Typography>

            <Grid container rowSpacing={3} columnSpacing={1}>
              <Grid item xs={3}>
                <TextField
                  label="Callsign"
                  helperText="Call Sign Used During Contest"
                  variant="filled"
                  required
                  name="callsign"
                  value={formValues.callsign}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={3}>
                <TextField
                  fullWidth
                  label="Email"
                  helperText="Submitter's E-mail Address"
                  variant="filled"
                  type="email"
                  required
                  name="email"
                  value={formValues.email}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl variant="filled" sx={{ minWidth: 160 }} required>
                  <InputLabel id="power-select-label">Power</InputLabel>
                  <Select
                    id="power-select"
                    labelId="power-select-label"
                    name="power"
                    value={formValues.power}
                    label="Power"
                    onChange={handleInputChange}
                  >
                    <MenuItem value={'<5'}>5W or less</MenuItem>
                    <MenuItem value={'<100'}>100W or less</MenuItem>
                    <MenuItem value={'>100'}>More than 100W</MenuItem>
                  </Select>
                  <FormHelperText>
                    What's the highest output power you used during the contest?
                  </FormHelperText>
                </FormControl>
              </Grid>
              <Grid item xs={5}>
                <FormControl variant="filled" sx={{ minWidth: 160 }} required>
                  <InputLabel id="power-select-label">
                    Spotting Assistance
                  </InputLabel>
                  <Select
                    id="power-select"
                    labelId="power-select-label"
                    name="assistance"
                    value={formValues.assistance}
                    label="Spotting Assistance"
                    onChange={handleInputChange}
                  >
                    <MenuItem value="false">No</MenuItem>
                    <MenuItem value="true">Yes</MenuItem>
                  </Select>
                  <FormHelperText>
                    At any time during the contest, did you use spotting
                    assistance of any kind, or software capable of
                    simultaneously decoding multiple call signs?
                  </FormHelperText>
                </FormControl>
              </Grid>
              <Grid item xs={8}>
                <FormControl variant="filled" sx={{ minWidth: 160 }} required>
                  <InputLabel id="power-select-label">Operators</InputLabel>
                  <Select
                    id="power-select"
                    labelId="power-select-label"
                    name="multipleOperators"
                    value={formValues.multipleOperators}
                    label="Operators"
                    onChange={handleInputChange}
                  >
                    <MenuItem value="false">One</MenuItem>
                    <MenuItem value="true">One or more</MenuItem>
                  </Select>
                  <FormHelperText>
                    How many people operated under the call used during the
                    contest?
                  </FormHelperText>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <label htmlFor="file">
                  <Typography color="text.secondary">
                    Upload Cabrillo log (*.log file extension)
                  </Typography>
                </label>
                <FileInput
                  required
                  type="file"
                  name="file"
                  fileChangeHandler={fileChangeHandler}
                />
              </Grid>
              <Grid item xs={1}>
                <Button type="submit" variant="contained" color="primary">
                  Submit
                </Button>
              </Grid>
              <Grid item xs={1}>
                <Button
                  component={Link}
                  to="/"
                  type="submit"
                  variant="outlined"
                  color="warning"
                >
                  Cancel
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </form>
      </Container>
    </Box>
  );
}
