'use client';
import {
  Autocomplete,
  Box,
  Button,
  Container,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  type SelectChangeEvent,
  TextField,
  Toolbar,
  Typography
} from '@mui/material';
import type { Contest } from '@prisma/client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { type ChangeEvent, type FormEvent, useState } from 'react';
import toast from 'react-hot-toast';
import { submitSubmission } from '~/server/submit';
import useAnalyticsEventTracker from '~/util/analytics';
import { Category } from '~/util/categories';
import { Location } from '~/util/locations';
import { SubmitButton } from './SubmitButton';

const defaultValues = {
  callsign: '',
  email: '',
  score: 0,
  category: '',
  location: '',
  file: null,
  multipleOperators: 'false'
} as const;

export default function Submit({ contest }: { contest: Contest }) {
  const [formValues, setFormValues] = useState<{
    callsign: string;
    email: string;
    score: number;
    category: string;
    location: string;
    file: File | null;
    multipleOperators: string;
  }>(defaultValues);
  const gaEventTracker = useAnalyticsEventTracker();
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const submission = {
      email: formValues.email,
      callsign: formValues.callsign,
      category: formValues.category,
      location: formValues.location,
      score: Number(formValues.score),
      file: formValues.file,
      multipleOperators: formValues.multipleOperators === 'true'
    };
    try {
      await submitSubmission(submission);
      gaEventTracker('submit log', 'submit_log');
      router.push('/');
      toast.success('Successfully submitted!', { duration: 6000 });
    } catch (err) {
      let message = '';
      if (err instanceof Error) {
        message = err.message;
      }
      toast.error(
        `Error submitting log. Please contact arkansasqsoparty@gmail.com for help! ${message}`
      );
    }
  };

  const handleInputChange = (
    e:
      | ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
      | SelectChangeEvent<string>
  ) => {
    const { name, value } = e.target;
    switch (name) {
      case 'callsign': {
        setFormValues({
          ...formValues,
          callsign: value.toUpperCase()
        });
        break;
      }
      case 'score': {
        const isNumeric = /^[0-9]*$/.test(value);
        if (isNumeric && value !== '') {
          setFormValues({
            ...formValues,
            score: Number.parseInt(value, 10)
          });
        } else {
          setFormValues({
            ...formValues,
            [name]: 0
          });
        }
        break;
      }
      default:
        setFormValues({
          ...formValues,
          [name]: value
        });
        break;
    }
  };

  const fileChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.[0])
      setFormValues({
        ...formValues,
        file: event.target.files[0]
      });
    gaEventTracker('select file', 'selected_file');
  };

  const setLocationValue = (value: string | null) => {
    setFormValues({
      ...formValues,
      location: value ?? ''
    });
  };

  return (
    <Box
      component="main"
      sx={{
        backgroundColor: '#f5f5f5',
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
              Results will be submitted to current contest ({contest?.title})
            </Typography>

            <Grid container rowSpacing={3} columnSpacing={4}>
              <Grid item sm={4} md={3}>
                <TextField
                  label="Callsign"
                  helperText="Call Sign Used During Contest"
                  variant="filled"
                  required
                  value={formValues.callsign}
                  onChange={handleInputChange}
                  name="callsign"
                />
              </Grid>
              <Grid item sm={4} md={3}>
                <TextField
                  label="Email"
                  helperText="Submitter's E-mail Address"
                  variant="filled"
                  type="email"
                  required
                  value={formValues.email}
                  onChange={handleInputChange}
                  name="email"
                />
              </Grid>
              <Grid item sm={8} md={3}>
                <FormControl variant="filled" required>
                  <TextField
                    slotProps={{
                      input: { inputMode: 'numeric', inputProps: { min: '0' } }
                    }}
                    label="Score"
                    variant="filled"
                    type="number"
                    required
                    onChange={handleInputChange}
                    value={formValues.score}
                    name="score"
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
              <Grid item md={1} />
              <Grid item sm={8} md={3}>
                <FormControl variant="filled" required fullWidth>
                  <InputLabel id="category-select-label">Category</InputLabel>
                  <Select
                    id="category-select"
                    labelId="category-select-label"
                    name="category"
                    label="Category"
                    value={formValues.category}
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
                    onChange={(_: unknown, newValue: string | null) => {
                      setLocationValue(newValue);
                    }}
                    renderInput={(params) => (
                      <TextField
                        required
                        name="location"
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
                  <InputLabel id="operators-select-label">Operators</InputLabel>
                  <Select
                    id="operators-select"
                    labelId="operators-select-label"
                    name="multipleOperators"
                    label="Operators"
                    value={formValues.multipleOperators}
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
                <input
                  required
                  type="file"
                  name="file"
                  onChange={fileChangeHandler}
                />
              </Grid>
              <Grid item sm={4}>
                <SubmitButton />
                <Link href="/" style={{ textDecoration: 'none' }}>
                  <Button type="submit" variant="outlined" color="secondary">
                    Cancel
                  </Button>
                </Link>
              </Grid>
            </Grid>
          </Paper>
        </form>
      </Container>
    </Box>
  );
}
