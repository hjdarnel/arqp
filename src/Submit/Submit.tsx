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
import { useEffect, useState } from 'react';
import FileInput from './FileInput';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { getContest } from '../util/get-contest';
import { Contest } from '@prisma/client';
import useAnalyticsEventTracker from '../util/analytics';

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
  const [selectedFile, setSelectedFile] = useState<any>();
  const [isFilePicked, setIsFilePicked] = useState<boolean>(false);
  const [currentContest, setCurrentContest] = useState<Contest>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const gaEventTracker = useAnalyticsEventTracker();

  useEffect(() => {
    getContest()
      .then((response) => setCurrentContest(response))
      .catch((err) => {
        console.error(err);
        toast.error(
          `Error retrieving the active contest! Please contact arkansasqsoparty@gmail.com for help. ${err}`,
          { duration: 6000 }
        );
        return navigate('/');
      })
      .finally(() => setIsLoading(false));
  }, []);

  const fileChangeHandler = (event: any) => {
    setSelectedFile(event.target.files[0]);
    setIsFilePicked(true);
    gaEventTracker('select', 'selected_file');
  };

  const handleInputChange = (e: any) => {
    let { name, value } = e.target;
    if (name === 'callsign') {
      setFormValues({
        ...formValues,
        [name]: value.toUpperCase()
      });
    } else {
      setFormValues({
        ...formValues,
        [name]: value
      });
    }
  };

  const handleSubmit = (e: any) => {
    setIsLoading(true);
    gaEventTracker('submit', 'submit_log');

    e.preventDefault();
    if (!selectedFile || !currentContest) return;
    const formData = new FormData();
    formData.append('contestId', currentContest.id);

    Object.entries(formValues).map(([k, v]) => {
      formData.append(k, v);
    });

    formData.append(
      'file',
      new Blob([selectedFile], { type: selectedFile.type }),
      selectedFile.name
    );

    fetch('/api/parse', {
      method: 'POST',
      body: formData
    })
      .then(async (response) => {
        if (response.status < 400) {
          toast.success('Successfully submitted!', { duration: 6000 });
          navigate('/');
        } else {
          throw new Error(await response.text());
        }
      })
      .catch((error) => {
        toast.error(
          `Error submitting log. Please contact arkansasqsoparty@gmail.com for help! ${error}`,
          { duration: 10000 }
        );
        console.error(error);
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
            <Typography component="h2" variant="h6" color="primary">
              Contest Log Submission
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              align="left"
              sx={{ mb: 2 }}
            >
              Results will be submitted to current contest (
              {currentContest?.title})
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
                  color="secondary"
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
