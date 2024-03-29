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
  Typography,
  Autocomplete
} from '@mui/material';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import FileInput from './FileInput';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { getActiveContest } from '../util/get-active-contest';
import { Contest } from '@prisma/client';
import useAnalyticsEventTracker from '../util/analytics';
import { postSubmission } from '../util/post-submission';
import { Category } from '../util/categories';
import { Location } from '../util/locations';
import LogRocket from 'logrocket';

const defaultValues = {
  callsign: '',
  email: '',
  claimedScore: 0,
  category: '',
  location: '',
  multipleOperators: 'false'
};

export default function Submit() {
  const navigate = useNavigate();
  const [formValues, setFormValues] = useState(defaultValues);
  const [selectedFile, setSelectedFile] = useState<any>();
  const [currentContest, setCurrentContest] = useState<Contest>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const gaEventTracker = useAnalyticsEventTracker();

  useEffect(() => {
    const ac = new AbortController();

    getActiveContest(ac)
      .then((response) => {
        if (ac.signal.aborted) return;
        setCurrentContest(response);
        if (!response) {
          toast.error(`No contest is currently running!`, { duration: 6000 });
          return navigate('/');
        }
      })
      .catch((err) => {
        console.error(err);
        toast.error(
          `Error retrieving the active contest! Please contact arkansasqsoparty@gmail.com for help. \n\n${err}`,
          { duration: 6000 }
        );
        return navigate('/');
      })
      .finally(() => setIsLoading(false));

    return () => ac.abort();
  }, []);

  const fileChangeHandler = (event: any) => {
    setSelectedFile(event.target.files[0]);
    gaEventTracker('select file', 'selected_file');
  };

  const setLocationValue = (value: string | null) => {
    setFormValues({
      ...formValues,
      location: value ?? ''
    });
  };

  const handleInputChange = (e: any) => {
    let { name, value } = e.target;
    switch (name) {
      case 'callsign':
        setFormValues({
          ...formValues,
          [name]: value.toUpperCase()
        });

        break;
      case 'claimedScore':
        const isNumeric = /^[0-9]*$/.test(value);
        if (isNumeric && value !== '') {
          setFormValues({
            ...formValues,
            [name]: value.replace(/^0+/, '')
          });
        } else {
          setFormValues({
            ...formValues,
            [name]: 0
          });
        }
        break;
      default:
        setFormValues({
          ...formValues,
          [name]: value
        });
        break;
    }
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    setIsLoading(true);
    gaEventTracker('submit log', 'submit_log');

    LogRocket.identify(formValues.callsign, {
      email: formValues.email,
      location: formValues.location
    });

    if (!selectedFile || !currentContest) return;
    const formData = new FormData();
    formData.append('contestId', currentContest.id);
    Object.entries(formValues).map(([k, v]) => {
      formData.append(k, v.toString());
    });

    formData.append(
      'file',
      new Blob([selectedFile], { type: selectedFile.type }),
      selectedFile.name
    );

    const ac = new AbortController();

    postSubmission(ac, formData)
      .then(() => {
        if (ac.signal.aborted) return;
        toast.success('Successfully submitted!', { duration: 6000 });
        navigate('/');
      })
      .catch((error) => {
        toast.error(
          `Error submitting log. Please contact arkansasqsoparty@gmail.com for help! \n\n${error.message}`,
          { duration: 15000 }
        );
        console.error(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
    return () => {
      ac.abort();
    };
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

            <Grid container rowSpacing={3} columnSpacing={4}>
              <Grid item sm={4} md={3}>
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
              <Grid item sm={4} md={3}>
                <TextField
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
              <Grid item sm={8} md={3}>
                <FormControl variant="filled" required>
                  <TextField
                    InputProps={{
                      inputMode: 'numeric',
                      inputProps: { min: '0' }
                    }}
                    value={formValues.claimedScore}
                    label="Score"
                    variant="filled"
                    type="number"
                    required
                    name="claimedScore"
                    onChange={handleInputChange}
                  />
                  <FormHelperText>
                    For calculation instructions, check out the{' '}
                    <a href="https://arkqp.com/arkansas-qso-party-rules/">
                      Rules
                    </a>
                    .{' '}
                    <strong>
                      Bear in mind your logging software may underestimate!
                    </strong>
                  </FormHelperText>
                </FormControl>
              </Grid>
              <Grid item md={1}></Grid>
              <Grid item sm={8} md={3}>
                <FormControl variant="filled" required fullWidth>
                  <InputLabel id="category-select-label">Category</InputLabel>
                  <Select
                    id="category-select"
                    labelId="category-select-label"
                    name="category"
                    value={formValues.category}
                    label="Category"
                    onChange={handleInputChange}
                    MenuProps={{ transitionDuration: 0 }}
                  >
                    {Object.keys(Category).map((x) => {
                      return (
                        <MenuItem key={x} value={x}>
                          {x}
                        </MenuItem>
                      );
                    })}
                  </Select>
                  <FormHelperText>
                    For contest category definition, check out the{' '}
                    <a href="https://arkqp.com/arkansas-qso-party-rules/">
                      Rules
                    </a>
                    .
                  </FormHelperText>
                </FormControl>
              </Grid>
              <Grid item sm={8} md={3}>
                <FormControl variant="filled" required fullWidth>
                  <Autocomplete
                    disablePortal
                    id="combo-box-demo"
                    options={Object.keys(Location)}
                    onChange={(e: any, newValue: string | null) => {
                      setLocationValue(newValue);
                    }}
                    renderInput={(params) => (
                      <TextField
                        required
                        variant="filled"
                        {...params}
                        label="Location"
                      />
                    )}
                  />
                  <FormHelperText>
                    Location of the operating station. County for Arkansas,
                    otherwise US state or Canadian province, DX for
                    international
                  </FormHelperText>
                </FormControl>
              </Grid>
              <Grid item sm={8} md={3}>
                <FormControl variant="filled" required fullWidth>
                  <InputLabel id="power-select-label">Operators</InputLabel>
                  <Select
                    id="power-select"
                    labelId="power-select-label"
                    name="multipleOperators"
                    value={formValues.multipleOperators}
                    label="Operators"
                    onChange={handleInputChange}
                    MenuProps={{ transitionDuration: 0 }}
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
              <Grid item sm={12}>
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
              <Grid item sm={4}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={isLoading}
                  sx={{ mr: 2 }}
                >
                  Submit
                </Button>
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
